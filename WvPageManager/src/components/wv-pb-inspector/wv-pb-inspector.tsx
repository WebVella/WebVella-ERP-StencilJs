import { Component, Prop,State, h } from '@stencil/core';
import '@stencil/redux';//fixing undefined error
import { Store,Action } from '@stencil/redux';
import _ from 'lodash';
import axios from 'axios';
import WvPbEventPayload from "../../models/WvPbEventPayload";
import * as action from "../../store/actions";
import runScripts from '../../utils/run-scripts';
import NodeUtils from '../../utils/node';

function RenderComponentCard(props){
  let scope = props.scope;
  if(!scope.activeNodeId){
    return (
      <div>Select a component to review its options</div>
    );
  }
  let pageNodes = scope.store.getState().pageNodes;
  let activeNodeIndex = _.findIndex(pageNodes,function(x){return x["id"] === scope.activeNodeId});
  if(activeNodeIndex === -1){
    return null;
  }
  let activeNode = pageNodes[activeNodeIndex];
  let library = scope.store.getState().library;
  let metaIndex = _.findIndex(library,function(x){return x["name"] === activeNode["component_name"]})
  if(metaIndex === -1){
    return null;
  }
  let meta = library[metaIndex];
  let style = {};
  if(meta["color"]){
    style = {
      color:meta["color"]
    }
  }
  return ([
    <div class="icon-card-body">
        <span class={"icon " + meta["icon_class"]} style={style}></span>
        <div class="meta">
          <div class="title">{meta["label"]}</div>
          <div class="description">{meta["description"]}</div>
          <div class="library">{meta["library"]}</div>
        </div>
    </div>,        
    <hr class="divider" style={{margin:"5px 0"}}/>,
    <div class="row no-gutters">
      <div class="col-6 pr-1">
        <button id="wv-pb-inspector-options-btn" type="button" class="btn btn-white btn-sm btn-block" onClick={(e)=> scope.showOptionsModalHandler(e)}><i class={scope.isOptionsLoading ? "fa fa-spin fa-spinner" :"fa fa-cog"}></i> options</button>      
      </div>
      <div class="col-6 pl-1">
      <button type="button" class="btn btn-white btn-sm btn-block" onClick={(e)=> scope.showHelpModalHandler(e)}><i class={scope.isHelpLoading ? "fa fa-spin fa-spinner" :"far fa-question-circle"}></i> help</button>            
      </div>
    
    </div>
  ]);
}

function RenderAction(props){
  let scope = props.scope;
  if(scope.activeNodeId){
    return(
      <a class="go-red" href="#" onClick={(e) => {if(window.confirm('Are you sure you wish to delete this component?')) scope.deleteNodeHandler(e)}}><i class="fa fa-trash-alt"></i> delete node</a>
    )
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
    scope.removeNode(scope.activeNodeId);

  })
  .catch(function (error) {
    if(error.response){
        if(error.response.data){
          alert(error.response.data);
        }
        else{
          alert(error.response.statusText);
        }
      }
      else if(error.message){
        alert(error.message);
      }        
      else{
        alert(error);
      }   
})  
}

function LoadHelpTemplate(scope){
  scope.isHelpLoading = true;    
  let responseObject = NodeUtils.GetNodeAndMeta(scope,scope.activeNodeId);
  let errorMessage: string = null;
  if(responseObject){
      let requestConfig = {
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*",
          }
      };
      let siteRootUrl = scope.store.getState().siteRootUrl;      
      let requestUrl = siteRootUrl + responseObject.meta["help_view_url"] + "&nid=" + responseObject.node["id"] + "&pid=" +responseObject.node["page_id"];
      let recordId = scope.store.getState().recordId;
      if(recordId){
        requestUrl += "&recId="+recordId;
      }
      let requestBody = responseObject.node["options"];
      axios.post(requestUrl,requestBody,requestConfig)
      .then(function (response) {
          let nodeHelpStack = document.getElementById("wv-node-help-stack");
          let nodeDiv = document.createElement("div");
          nodeDiv.id = "node-help-" + scope.activeNodeId;
          nodeDiv.innerHTML = response.data;
          nodeHelpStack.appendChild(nodeDiv);
          runScripts(nodeDiv);


          var customEvent = new Event("WvPbManager_Help_Loaded");
          var payload = new WvPbEventPayload();
          payload.node = responseObject.node;
          payload.component_name = responseObject.node["component_name"];
          customEvent["payload"] = payload;
          document.dispatchEvent(customEvent)      

          scope.setHelpModalState(true);
          scope.isHelpLoading = false;  
      })        
      .catch(function (error) {
        if(error.response){
            if(error.response.data){
              errorMessage = error.response.data;
            }
            else{
                errorMessage = error.response.statusText;
            }
          }
          else if(error.message){
            errorMessage = error.message;
          }        
          else{
              errorMessage = error;
          }     
          if(errorMessage){
            let nodeContainerPlaceholder = document.getElementById("wv-node-" + scope.activeNodeId);
            let errorDiv = document.createElement("div");
            errorDiv.classList.add("alert");
            errorDiv.classList.add("alert-danger");
            errorDiv.classList.add("m-1");
            errorDiv.classList.add("p-1");
            errorDiv.innerHTML = errorMessage;
            nodeContainerPlaceholder.appendChild(errorDiv);
            scope.isOptionsLoading = false;            
        }                 
      });
  }
}

function LoadOptionsTemplate(scope){
  scope.isOptionsLoading = true;    
  let responseObject = NodeUtils.GetNodeAndMeta(scope,scope.activeNodeId);
  let errorMessage: string = null;
  if(responseObject){
      let requestConfig = {
          headers: {
              'Content-Type': 'application/json;charset=UTF-8',
              "Access-Control-Allow-Origin": "*",
          }
      };
      let siteRootUrl = scope.store.getState().siteRootUrl;      
      let requestUrl = siteRootUrl + responseObject.meta["options_view_url"] + "&nid=" + responseObject.node["id"] + "&pid=" +responseObject.node["page_id"];
      let recordId = scope.store.getState().recordId;
      if(recordId){
        requestUrl += "&recId="+recordId;
      }      
      let requestBody = responseObject.node["options"];
      axios.post(requestUrl,requestBody,requestConfig)
      .then(function (response) {
          let nodeOptionsStack = document.getElementById("wv-node-options-stack");
          let nodeDiv = document.createElement("div");
          nodeDiv.id = "node-options-" + scope.activeNodeId;
          nodeDiv.innerHTML = response.data;
          nodeOptionsStack.appendChild(nodeDiv);
          runScripts(nodeDiv);
          var customEvent = new Event("WvPbManager_Options_Loaded");
          var payload = new WvPbEventPayload();
          payload.node = responseObject.node;
          payload.component_name = responseObject.node["component_name"];
          customEvent["payload"] = payload;
          document.dispatchEvent(customEvent)   
          //console.log(customEvent);  

          scope.setOptionsModalState(true);
          scope.isOptionsLoading = false;  
      })        
      .catch(function (error) {
        if(error.response){
            if(error.response.data){
                errorMessage = error.response.data;
            }
            else{
                errorMessage = error.response.statusText;
            }
          }
          else if(error.message){
            errorMessage = error.message;
          }        
          else{
              errorMessage = error;
          }     
          if(errorMessage){
            let nodeContainerPlaceholder = document.getElementById("wv-node-" + scope.activeNodeId);
            let errorDiv = document.createElement("div");
            errorDiv.classList.add("alert");
            errorDiv.classList.add("alert-danger");
            errorDiv.classList.add("m-1");
            errorDiv.classList.add("p-1");
            errorDiv.innerHTML = errorMessage;
            nodeContainerPlaceholder.appendChild(errorDiv);
            scope.isOptionsLoading = false;            
        }            
      });
  }
}

@Component({
    tag: 'wv-pb-inspector'
  })

  export class WvPbInspector {
    @Prop({ context: 'store' }) store: Store;
  
    @State() activeNodeId:string;
    @State() isHelpLoading:boolean = false;
    @State() isOptionsLoading:boolean = false;

    removeNode:Action;
    setOptionsModalState:Action;
    setHelpModalState:Action;

    componentWillLoad() {
      let scope = this;
      //Connect store
      scope.store.mapStateToProps(this, (state) => {
          return { 
              activeNodeId:state.activeNodeId
          };
      });     
       
      scope.store.mapDispatchToProps(this, {
        removeNode:action.removeNode,
        setOptionsModalState:action.setOptionsModalState,
        setHelpModalState:action.setHelpModalState
      });      
    }  

    deleteNodeHandler(event:UIEvent){
      event.preventDefault();
      event.stopPropagation();
      RemoveNode(this);
    }

    showOptionsModalHandler(event:UIEvent){
      event.preventDefault();
      event.stopPropagation();
      //Check if help template is already loaded
      let nodeOptionsTemplate = document.getElementById("node-options-" + this.activeNodeId);      
      if(nodeOptionsTemplate){
        this.setOptionsModalState(true);
      }
      else{
        LoadOptionsTemplate(this);
      }      

    }

    showHelpModalHandler(event:UIEvent){
      event.preventDefault();
      event.stopPropagation();
      //Check if help template is already loaded
      let nodeHelpTemplate = document.getElementById("node-help-" + this.activeNodeId);
      if(nodeHelpTemplate){
        this.setHelpModalState(true);
      }
      else{
        LoadHelpTemplate(this);
      }
    }


    render() {
      let scope = this;
      return([
        <div class="header">
          <div class="title">Inspector</div>
            <div class="action pr-1">
              <RenderAction scope={scope}/>
            </div>                    
        </div>,
        <div class="body">
          <RenderComponentCard scope={scope}/>
        </div>
      ])
    }

  }