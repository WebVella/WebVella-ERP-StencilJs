import { Component,Prop, State,Element,Watch } from '@stencil/core';
import { Store, Action} from '@stencil/redux';
import _ from 'lodash';
import axios from 'axios';
import runScripts from '../../utils/run-scripts';
import WvPbEventPayload from "../../models/WvPbEventPayload";
import NodeUtils from '../../utils/node';
import WvPbStore from '../../models/WvPbStore';
import * as action from '../../store/actions';

function LoadTemplate(scope){
    let responseObject = NodeUtils.GetNodeAndMeta(scope,scope.nodeId);
    let errorMessage: string = null;
    if(responseObject){
        let requestConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
        };
        let siteRootUrl = scope.store.getState().siteRootUrl;      
        let requestUrl = siteRootUrl + responseObject.meta["design_view_url"] + "&nid=" + responseObject.node["id"] + "&pid=" +responseObject.node["page_id"];
        let recordId = scope.store.getState().recordId;
        if(recordId){
          requestUrl += "&recId="+recordId;
        }        
        let requestBody = responseObject.node["options"];
        scope.isLoading = true;
        axios.post(requestUrl,requestBody,requestConfig)
        .then(function (response) {
            scope.isLoading = false; 
            let nodeContainerPlaceholder = document.getElementById("wv-node-" + scope.nodeId);
            let nodeDiv = document.createElement("div");
            nodeDiv.id = "node-design-" + scope.nodeId;
            nodeDiv.classList.add("wv-pb-node");
            nodeDiv.innerHTML = response.data;
            nodeContainerPlaceholder.appendChild(nodeDiv);
            runScripts(nodeDiv);
            var customEvent = new Event("WvPbManager_Design_Loaded");
            var payload = new WvPbEventPayload();
            payload.node = responseObject.node;
            payload.component_name = responseObject.node["component_name"];
            customEvent["payload"] = payload;
            //console.log(customEvent);
            document.dispatchEvent(customEvent)               
            //console.log("component loaded from server " + scope.nodeId)            
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
                let nodeContainerPlaceholder = document.getElementById("wv-node-" + scope.nodeId);
                let errorDiv = document.createElement("div");
                errorDiv.classList.add("alert");
                errorDiv.classList.add("alert-danger");
                errorDiv.classList.add("m-1");
                errorDiv.classList.add("p-1");
                errorDiv.innerHTML = errorMessage;
                nodeContainerPlaceholder.appendChild(errorDiv);
                scope.isLoading = false;            
            }                
        });
    }
}

@Component({
    tag: 'wv-pb-node'
  })

  export class WvNode {
    @Element() el: HTMLElement;
    @Prop({ context: 'store' }) store: Store;
    @Prop() nodeId:string;

    @State() isLoading: boolean = false;
    @State() reloadNodeIdList:string;

    removeReloadNodeIds:Action;

    componentWillLoad(){
        let scope = this;
        if(!scope.nodeId ){
            return;
        }
        //Connect to Store
        this.store.mapStateToProps(this, (state : WvPbStore) => {
            return { 
                reloadNodeIdList:state.reloadNodeIdList
            };
        });       
        this.store.mapDispatchToProps(this, {
            removeReloadNodeIds:action.removeReloadNodeIds
          });        
        //console.log(">> node load " + scope.nodeId)
    }

    @Watch("reloadNodeIdList")
    nodeIndexUpdateHandler(newValue){
        let scope = this;
        //Check if the current node is in a need of a reaload
        let reloadIndex = _.findIndex(newValue,function(reloadId){return reloadId === scope.nodeId});
        if(reloadIndex > -1){
            //console.log("reload node " + scope.nodeId);
            //Check if this is not a mirror created by draggable. Reason: Draggable will create new element of the dragged one and will trigger new/copy component load
            if(!scope.el.parentElement.classList.contains("gu-mirror")){
                let isMoveSuccess = NodeUtils.GetNodeFromStack(scope.nodeId);
                if(!isMoveSuccess){
                    LoadTemplate(scope);
                }
                if(scope &&  typeof scope.removeReloadNodeIds === "function"){ //Fixing error: TypeError: t.removeReloadNodeIds is not a function
                    scope.removeReloadNodeIds(scope.nodeId);
                }
            }
        }
    }

    render() {
        let scope = this;
        //Check if this is a mirror draggable no need to render anything
        if(this.el.parentElement.classList.contains("gu-mirror")){
            return null;
        }
        if(scope.isLoading){
            return(
                <wv-loading-pane></wv-loading-pane>
            )
        }
  
        return  null;
    }
  }  