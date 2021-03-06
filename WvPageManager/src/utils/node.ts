import _ from 'lodash';
import axios from 'axios';
import runScripts from './run-scripts';
import WvPbEventPayload from "../models/WvPbEventPayload";

function LoadNodeDesignHtmlFromServerToStack(newNode,oldMeta,scope){
    if(typeof newNode["options"] !== 'object'){
        if(!newNode["options"]){
            newNode["options"] = {};
          }
          else{
            newNode["options"] = JSON.parse(newNode["options"]);
          }
     
    }  

    let requestConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
    };
    let siteRootUrl = scope.store.getState().siteRootUrl;    
    let requestUrl = siteRootUrl + oldMeta.meta["design_view_url"] + "&nid=" + newNode["id"] + "&pid=" + newNode["page_id"];
    let recordId = scope.store.getState().recordId;
    if(recordId){
      requestUrl += "&recId="+recordId;
    }    
    let requestBody = newNode["options"];
    axios.post(requestUrl,requestBody,requestConfig)
    .then(function (response) {
       
        //Move it children to stack
        let updatedNodeHtmlEl = document.getElementById("node-design-" + newNode["id"]);
        let nodeIds = new Array<string>();
        var childNodes = updatedNodeHtmlEl.querySelectorAll("[data-node-id]");
        _.forEach(childNodes, function(childNode){
        nodeIds.push(childNode.getAttribute("data-node-id"));
        })
        _.forEach(nodeIds,function(nodeId){
        NodeUtils.MoveNodeToStack(nodeId);
        });
        
        //remove the previous html
        updatedNodeHtmlEl.remove();
        //Load and execute
        let nodeDiv = document.createElement("div");
        nodeDiv.id = "node-design-" + newNode["id"];
        nodeDiv.classList.add("wv-pb-node");
        nodeDiv.innerHTML = response.data;
        let nodeDesignStack = document.getElementById("wv-node-design-stack");
        nodeDesignStack.appendChild(nodeDiv);
        runScripts(nodeDiv);

        //Update the node in store
        scope.updateNodeOptions(newNode);

        //Schedule reload for all children and the current node
        window.setTimeout(function(){
            nodeIds.push(newNode["id"]);
            scope.addReloadNodeIds(nodeIds);
            var customEvent = new Event("WvPbManager_Design_Loaded");
            var payload = new WvPbEventPayload();
            payload.node = newNode;
            payload.component_name = oldMeta.node["component_name"];
            customEvent["payload"] = payload;
            document.dispatchEvent(customEvent) 
        },10);    

    })        
    .catch(function (error) {
            if(error.response){
                if(error.response.data){
                    console.log(error.response.data);
                }
                else{
                    console.log(error.response.statusText);
                }
            }
            else if(error.message){
                console.log(error.message);
            }        
            else{
                console.log(error);
            }
    });

}

export default class NodeUtils {
    static MoveNodeToStack(nodeId) {
        //console.log("starting to stack " + nodeId);
        if(!nodeId){
            console.error("node id not defined MoveNodeToStack " + nodeId);
            return false;
        }
        let nodeDesignTemplate = document.getElementById("node-design-" + nodeId);
        let nodeDesignStack = document.getElementById("wv-node-design-stack");
        if(nodeDesignTemplate && nodeDesignTemplate.parentElement.id === "wv-node-" + nodeId && nodeDesignStack){
            window.setTimeout(function(){ // trying to fix the empty node after append
                nodeDesignStack.appendChild(nodeDesignTemplate);
             },5);
            //console.log("success to stack " + nodeId);
            return true;
        }     
        if(nodeDesignTemplate && nodeDesignTemplate.parentElement.id === "wv-node-design-stack" && nodeDesignStack){
            //Already in stack
            return true;
        }             
        if(!nodeDesignStack){
            console.error("stack is missing ");    
        }
        else{
            console.error("error to-stack " + nodeId);
        }
        //console.log("node not in found in placeholder " + nodeId);
        return false;
    }
    static GetNodeFromStack(nodeId) {
        //console.log("starting from stack " + nodeId);
        if(!nodeId){
            console.error("node id not defined GetNodeFromStack " + nodeId);
            return false;
        }
        let nodeDesignTemplate = document.getElementById("node-design-" + nodeId);
        let nodeContainerPlaceholder = document.getElementById("wv-node-" + nodeId);
        if(nodeDesignTemplate && nodeDesignTemplate.parentElement.id === "wv-node-design-stack" && nodeContainerPlaceholder){
            window.setTimeout(function(){ // trying to fix the empty node after append
                nodeContainerPlaceholder.appendChild(nodeDesignTemplate);
            },5);
            //console.log("success from stack " + nodeId);
            return true;

        }  
        if(nodeDesignTemplate && nodeDesignTemplate.parentElement.id === "wv-node-" + nodeId){
            console.log("no need from stack " + nodeId);
            return true; //node is already in place
        }
        if(!nodeContainerPlaceholder){
            //Sometimes it is possible to execute get before the parent node has finished loading
            return true;
        }
        //Normal situation on initial load
        return false;
    }    
    static GetNodeFromServerToStack(node,oldMeta,scope){
        LoadNodeDesignHtmlFromServerToStack(node,oldMeta,scope);
    }
    static GetNodeAndMeta(scope,nodeId){
        let returnObj = {
            node:null,
            meta:null
          }
          let pageNodes = scope.store.getState().pageNodes;
          let library = scope.store.getState().library;
          if(nodeId){
              //Find the active node
              let activeNodeIndex = _.findIndex(pageNodes,function(x) { return x["id"] == nodeId});
        
              if(activeNodeIndex == -1){
                console.error("Node with id " + nodeId + " not found in pageNodes");
                return;           
              }
              else{
                returnObj.node = {...pageNodes[activeNodeIndex]};
                //Set Meta from library
                let libObjIndex = _.findIndex(library,function(x) { return x["name"] == returnObj.node["component_name"]});
                if(libObjIndex == -1){
                    console.error("Component name " + returnObj.node["component_name"] + " not found in library");
                    return;
                }        
                else{
                  returnObj.meta = library[libObjIndex];
                }        
              }
           }  
           return returnObj;
    }    
    static GetActiveNodeAndMeta(scope){
        let returnObj = {
            node:null,
            meta:null
          }
          let pageNodes = scope.store.getState().pageNodes;
          let library = scope.store.getState().library;
          let activeNodeId = scope.store.getState().activeNodeId;
          if(activeNodeId){
              //Find the active node
              let activeNodeIndex = _.findIndex(pageNodes,function(x) { return x["id"] == activeNodeId});
        
              if(activeNodeIndex == -1){
                console.error("Node with id " + activeNodeId + " not found in pageNodes");
                return;           
              }
              else{
                returnObj.node = {...pageNodes[activeNodeIndex]};
                //Set Meta from library
                let libObjIndex = _.findIndex(library,function(x) { return x["name"] == returnObj.node["component_name"]});
                if(libObjIndex == -1){
                    console.error("Component name " + returnObj.node["component_name"] + " not found in library");
                    return;
                }        
                else{
                  returnObj.meta = library[libObjIndex];
                }        
              }
           }  
           return returnObj;
    }
    static GetChildNodes(parentId:string = null,
            containerId:string = null,
            allNodes:Array<Object> = new Array<Object>(),
            result:Array<string> = new Array<string>(),
            applyContainerId:boolean = true) {
                
        let childNodes = _.filter(allNodes,function(record){ 
                return record["parent_id"] === parentId && (!applyContainerId || record["container_id"] === containerId);
        })
        _.forEach(childNodes,function(childNode){
            result.push(childNode["id"]);
            NodeUtils.GetChildNodes(childNode["id"],"",allNodes,result,false);
        });
    }    
}