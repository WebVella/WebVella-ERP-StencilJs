import { Component, Prop, State,Listen, h } from '@stencil/core';
import '@stencil/redux';//fixing undefined error
import { Store,Action } from '@stencil/redux';
import { configureStore } from '../../store/index';
import WvPbStore from '../../models/WvPbStore';
import * as action from '../../store/actions';
import dragula from 'dragula';
import _ from 'lodash';
import axios from 'axios';
import NodeUtils from '../../utils/node';
import WvPbEventPayload from "../../models/WvPbEventPayload";

function ProcessDropEvent(scope,moveObject, pageId, nodeId){
  let requestConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  };
  let siteRootUrl = scope.store.getState().siteRootUrl;      
  let requestUrl = siteRootUrl + "/api/v3.0/page/" + pageId + "/node/" +nodeId + "/move";
  let recordId = scope.store.getState().recordId;
  if(recordId){
    requestUrl += "?recId="+recordId;
  }  
  axios.post(requestUrl,moveObject,requestConfig)
  .then(function (response) {
      scope.updatePageNodes(response.data);
      //We need to give some time for the component loading to finish before ordering the html content back in
      window.setTimeout(function(){
        scope.addReloadNodeIds(scope.nodesPendingReload);
        scope.nodesPendingReload = new Array<string>();
        window.setTimeout(function(){
          //Call affected nodes moved events first
          _.forEach(scope.nodesPendingReload,function(reloadNodeId){
            let componentObject = NodeUtils.GetNodeAndMeta(scope,reloadNodeId);
            var customEvent = new Event("WvPbManager_Node_Moved");
            var payload = new WvPbEventPayload();
            payload.original_event = event;
            payload.node = componentObject.node;
            payload.component_name = componentObject.node["component_name"];
            customEvent["payload"] = payload; 
            document.dispatchEvent(customEvent)
            //console.info("dispatch",customEvent);
          });
          //call current node moved
          {
            let componentObject = NodeUtils.GetNodeAndMeta(scope,nodeId);
            var customEvent = new Event("WvPbManager_Node_Moved");
            var payload = new WvPbEventPayload();
            payload.original_event = event;
            payload.node = componentObject.node;
            payload.component_name = componentObject.node["component_name"];
            customEvent["payload"] = payload;       
            document.dispatchEvent(customEvent)
            //console.info("dispatch",customEvent);
          }
          //Remove the containers width styles fixed on drag start
          var containerElList = document.querySelectorAll(".wv-container");
          _.forEach(containerElList,function(containerEl){
            containerEl.removeAttribute("style");
          });


        },10);
      },10);
  })
  .catch(function (error) {
    console.log(error);
    alert("An error occurred during the move");
    location.reload(true);
  })
}

//Triggered when drag starts in order to move the design content of the component to the stack
function MoveAffectedNodesToStack(scope,moveInfo){
  let nodeIds = new Array<string>();
  let storePageNodes = scope.store.getState().pageNodes;
  NodeUtils.GetChildNodes(moveInfo.originParentNodeId,moveInfo.originContainerId,storePageNodes,nodeIds);
  NodeUtils.GetChildNodes(moveInfo.newParentNodeId,moveInfo.newContainerId,storePageNodes,nodeIds);
  //console.log("=== move affected nodes to stack start =====");
  _.forEach(nodeIds,function(nodeId){
    NodeUtils.MoveNodeToStack(nodeId);
  });
  //console.log("=== move affected nodes to stack end =====");
  scope.nodesPendingReload = nodeIds;
}

function ShowTooltop(e){
  var tooltip = document.querySelectorAll('.wv-pb-content .actions');
    for (var i=tooltip.length; i--;) {
        var tooltipEl = tooltip[i] as any;
        tooltipEl.style.left = e.pageX + 15 + 'px';
        tooltipEl.style.top = e.pageY + 25 + 'px';
    }
}

function RemoveNode(scope){
  let requestConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  }; 
  let componentObject = NodeUtils.GetActiveNodeAndMeta(scope);
  let siteUrl = scope.store.getState().siteRootUrl;    
  let requestUrl = siteUrl + "/api/v3.0/page/" + componentObject.node["page_id"] + "/node/"+ componentObject.node["id"] + "/delete"; 
let recordId = scope.store.getState().recordId;
if(recordId){
  requestUrl += "?recId="+recordId;
}
  axios.post(requestUrl,null,requestConfig)
  .then(function () {

    var customEvent = new Event("WvPbManager_Node_Removed");
    var payload = new WvPbEventPayload();
    payload.original_event = event;
    payload.node = componentObject.node;
    payload.component_name = componentObject.node["component_name"];
    customEvent["payload"] = payload; 
    document.dispatchEvent(customEvent)
    //console.info("dispatch",customEvent);
    scope.removeNode(scope.store.getState().activeNodeId);

  })
  .catch(function (error) {
    if(error.response){
      alert(error.response.statusText + ":" +  error.response.data);
      }
      else if(error.message){
        alert(error.message);
      }        
      else{
        alert(error);
      }   
})  
}

@Component({
  tag: 'wv-pb-manager'
})
export class WvPageManager {
  @Prop({ context: 'store' }) store: Store;
  @Prop() siteRootUrl:string;
  @Prop() pageId:string; 
  @Prop() recordId:string; 
 
  @State() nodesPendingReload: Array<string> = new Array<string>();
  @State() pageNodes:Array<object> = new Array<object>();

  setDrake:Action;  
  addReloadNodeIds:Action;
  updatePageNodes:Action;
  removeNode:Action;

  componentWillLoad() {
    let library = (window as any).PbManagerLibraryJson;
    let pageNodes = (window as any).PbManagerPageNodesJson;
    //make node json options > objects
    _.forEach(pageNodes,function(node){
      if(typeof node["options"] !== 'object'){
        if(!node["options"]){
          node["options"] = {};
        }
        else{
          node["options"] = JSON.parse(node["options"]);
        }
      }      
    });   
    //Init Store
    var initStore = new WvPbStore();
    initStore.library = library;
    initStore.pageNodes = pageNodes;
    initStore.siteRootUrl = this.siteRootUrl;
    initStore.pageId = this.pageId;    
    initStore.recordId = this.recordId;    
    _.forEach(library,function(component){
      initStore.componentMeta[component["name"]] = component;
    });

    this.store.setStore(configureStore(initStore));    
    this.store.mapStateToProps(this, (state) => {
      return { 
        pageNodes:state.pageNodes
      };
    });      
    
    this.store.mapDispatchToProps(this, {
      setDrake:action.setDrake,
      addReloadNodeIds:action.addReloadNodeIds,
      updatePageNodes:action.updatePageNodes,
      removeNode:action.removeNode
    });

    let scope = this;
    let drake = dragula({
      revertOnSpill:false,
      direction: 'vertical',
    });
    drake.on('drop',function(el, target, source){
      //Get MoveInfo before move
      let newIndex = 0;
      _.forEach(el.parentElement.childNodes,function(node){
        if(node === el){
          return false;
        }
        newIndex++;
      });      
      var moveInfo = {
        originContainerId: source.getAttribute("data-container-id"),
        originParentNodeId: source.getAttribute("data-parent-id"),
        newContainerId: target.getAttribute("data-container-id"),
        newParentNodeId: target.getAttribute("data-parent-id"),
        newIndex: newIndex,        
      }        
      let pageId = el.getAttribute("data-page-id");
      let nodeId = el.getAttribute("data-node-id");
      //Move all nodes to the stack as the drag and drop can change all of them, because of reordering weight change
      MoveAffectedNodesToStack(scope,moveInfo);
      ProcessDropEvent(scope,moveInfo,pageId,nodeId);
    });
    drake.on('drag',function(){
      //We need to fix the widths of the containers until the dragging finishes, as otherwise charts are not getting correct width dimensions
      // and stretch the containers unexpectedly
      var containerElList = document.querySelectorAll(".wv-container");
      _.forEach(containerElList,function(containerEl){
        let elWidth = containerEl.offsetWidth;
        containerEl.setAttribute("style","width:" + elWidth + "px");
      });

    });    
    scope.setDrake(drake);
  }

  @Listen('mousemove')
  handleMouseMove(ev: KeyboardEvent){
    ShowTooltop(ev);
  }  

  componentDidLoad(){
    let scope = this;
    document.addEventListener('keydown', function(ev:KeyboardEvent){
      switch(ev.key){
        case "Escape":
          var drake = scope.store.getState().drake;
          if(drake.dragging){
            drake.cancel();
          }
          break;
        case "Delete":
          let activeNodeId = scope.store.getState().activeNodeId;
          let isOptionsModalVisible = scope.store.getState().isOptionsModalVisible;
          let isHelpModalVisible = scope.store.getState().isHelpModalVisible;
          let isCreateModalVisible = scope.store.getState().isCreateModalVisible;
          if(activeNodeId && !isOptionsModalVisible && !isHelpModalVisible && !isCreateModalVisible){
            if(window.confirm('Are you sure you wish to delete the selected component?')){
              RemoveNode(scope);
            }
          }
          break;
        default:
          break;
      }
    }, false);

  }
  
  render() {
    let scope = this;
    let registeredComponentNameservices = [];
    //let pageNodes = this.store.getState().pageNodes;
    let library = this.store.getState().library;

    return (
      <div id="wv-page-manager-wrapper">
        <div class="row no-gutters">
          <div class="col" style={{"overflow-x":"auto"}}>
            <div class="wv-pb-content">
              <div class="wb-pb-content-inner">
                <wv-pb-node-container parent-node-id={null} containerId=""></wv-pb-node-container>
              </div>
            </div>
          </div>
          <div class="col-auto" style={{width:"400px"}}>
            <wv-pb-inspector></wv-pb-inspector>
            <wv-pb-tree></wv-pb-tree>
          </div>
        </div>
        {
            this.pageNodes.map(function(node){
                let nodeComponentName = node["component_name"];
                let componentNameIndex = _.findIndex(registeredComponentNameservices,function(x) { return x === nodeComponentName});
                if(componentNameIndex === -1){
                    let libObjIndex = _.findIndex(library,function(x) { return x["name"] == nodeComponentName});
                    if(libObjIndex > -1){
                        if(library[libObjIndex]["service_js_url"]){
                            registeredComponentNameservices.push(nodeComponentName);
                            return(
                              <script key={node["id"]} src={scope.siteRootUrl + library[libObjIndex]["service_js_url"]}></script>
                            )
                        }
                        else{
                          console.info("Service not found for "  + nodeComponentName);
                          return null;
                        }
                    }        
                }
                return null;
            })
          }        
        <div id="wv-node-design-stack" class="d-none"></div>
        <div id="wv-node-options-stack" class="d-none"></div>
        <div id="wv-node-help-stack" class="d-none"></div>
        <wv-create-modal></wv-create-modal>
        <wv-help-modal></wv-help-modal>
        <wv-options-modal></wv-options-modal>
      </div>
    );
  }
}
