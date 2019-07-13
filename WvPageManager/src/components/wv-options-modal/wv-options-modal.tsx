import { Component,Prop,State, h } from '@stencil/core';
import '@stencil/redux';//fixing undefined error
import { Store,Action } from '@stencil/redux';
import * as action from '../../store/actions';
import WvPbStore from '../../models/WvPbStore';
import _ from 'lodash';
import axios from 'axios';
import WvPbEventPayload from "../../models/WvPbEventPayload";
import NodeUtils from "../../utils/node";

function getSelectValues(select) {
  var result = [];
  var options = select && select.options;
  var opt;

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }
  return result;
}


@Component({
    tag: 'wv-options-modal'
  })

  export class WvCreateModal {
    @Prop({ context: 'store' }) store: Store;
    @State() isOptionsModalVisible:boolean = false;
    @State() isSaveLoading:boolean = false;

    setOptionsModalState:Action;
    updateNodeOptions:Action;
    addReloadNodeIds:Action;


    componentWillLoad() {
        //Connect to Store
        this.store.mapStateToProps(this, (state : WvPbStore) => {
            return { 
              isOptionsModalVisible:state.isOptionsModalVisible,
            };
        });        
        
        this.store.mapDispatchToProps(this, {
          setOptionsModalState:action.setOptionsModalState,
          updateNodeOptions:action.updateNodeOptions,
          addReloadNodeIds:action.addReloadNodeIds
      });           
    }

    cancelOptionsModalHandler(event:UIEvent){
        event.preventDefault();
        event.stopPropagation();    
        this.setOptionsModalState(false);
      }    

    saveOptionsModalHandler(event:UIEvent){
        let scope = this;
        scope.isSaveLoading = true;
        event.preventDefault();
        let options = {};
        let inputElements = document.querySelectorAll('#modal-component-options .modal-body input, #modal-component-options .modal-body textarea, #modal-component-options .modal-body select');
        if(inputElements && inputElements.length > 0){
          _.forEach(inputElements,function(inputElement){
              let inputName = inputElement.name;
              // Textbox input like
              if(!inputElement.type || inputElement.type === "text" || inputElement.type === "number" 
                   ||  inputElement.type === "email" ||  inputElement.type === "color" || inputElement.type === "textarea" 
                   || inputElement.type === "hidden"){
                if(!inputName){return true;} //continue with next el
               
                switch(inputElement.type){
                  case "number":
                    var fieldValue = Number(inputElement.value);
                    if(isNaN(fieldValue)){
                      fieldValue = null;
                    }
                    options[inputName] = fieldValue;
                    break;
                  default:
                    options[inputName] = inputElement.value;
                    break;
                }
              }            
              else if(inputElement.type === "checkbox"){
                //The ERP checkbox field is working with hidden input so we need to check for this case
                let isErpCheckbox = false; 
                if(inputElement.classList.contains("form-check-input")){
                  isErpCheckbox = true;
                }   
                if(!inputName && !isErpCheckbox){return true;} //continue with next el
                let value = false;
                if(!isErpCheckbox){
                  if(inputElement.checked){
                    value = true;
                  }                
                  options[inputName] = value;
                }
                else{
                  //get hidden input - data-source-id / id
                  let checkboxId = inputElement.id;
                  let dummyHiddenInput = document.querySelector('#modal-component-options .modal-body input[data-source-id="' + checkboxId +'"]');
                  let customDummyElement = dummyHiddenInput as any;
                  value = customDummyElement.value;
                  let fieldName = inputElement.getAttribute("data-field-name");
                  options[fieldName] = value;
                }
              }   
              else if(inputElement.tagName.toLowerCase() === "select"){
                if(inputElement.multiple){
                  options[inputName] = getSelectValues(inputElement);
                }
                else{
                  options[inputName] = inputElement.value;
                }
              }
          })
        }
        let componentObject = NodeUtils.GetActiveNodeAndMeta(scope);
        let requestConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                "Access-Control-Allow-Origin": "*",
            }
          };
        let siteUrl = scope.store.getState().siteRootUrl;    
        let requestUrl = siteUrl + "/api/v3.0/page/" + componentObject.node["page_id"] + "/node/"+ componentObject.node["id"] + "/options/update";
        let recordId = scope.store.getState().recordId;
        if(recordId){
          requestUrl += "?recId="+recordId;
        }        
        let requestBody = options;
        axios.post(requestUrl,requestBody,requestConfig)
          .then(function (response) {
            var customEvent = new Event("WvPbManager_Options_Changed");
            var payload = new WvPbEventPayload();
            payload.original_event = event;
            payload.node = componentObject.node;
            payload.component_name = componentObject.node["component_name"];
            customEvent["payload"] = payload; 
            document.dispatchEvent(customEvent)
            //console.info("dispatch",customEvent);

            var updatedNodeIndex =  _.findIndex(response.data,function(record){ return record.id === componentObject.node["id"]})
            if(updatedNodeIndex > -1){
              //Get and load the new template to stack
              NodeUtils.GetNodeFromServerToStack(response.data[updatedNodeIndex],componentObject,scope);

          
            }
            else{
              alert("Error: Node not found in returned results")
            }
            scope.isSaveLoading = false;
            scope.setOptionsModalState(false);
          })
          .catch(function (error) {
              scope.isSaveLoading = false;
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
  


    render() {
        let scope = this;
        let showModal = scope.isOptionsModalVisible;
        let activeNodeId = scope.store.getState().activeNodeId;
        if(!showModal){
            return null;
        }
        var nodeMeta = NodeUtils.GetNodeAndMeta(scope,activeNodeId);
        var nameArray = nodeMeta.node["component_name"].split(".");
        var componentName = nameArray[nameArray.length -1];
        return(
            <div class="modal show d-block" style={{paddingRight:"17px"}} id="modal-component-options">
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <span class="title"><span class="go-teal">{componentName}</span> options</span>
                    <span class="aside">wv-{activeNodeId}</span>            
                  </div>
                  <div class="modal-body" id="modal-component-options-body">
                     <wv-show-options nodeId={activeNodeId}></wv-show-options>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary btn-sm" onClick={(e) => scope.saveOptionsModalHandler(e)} disabled={scope.isSaveLoading}><i class={scope.isSaveLoading ? "fa fa-spin fa-spinner" : "fa fa-save"}></i> Save Options</button>                  
                    <button type="button" class="btn btn-white btn-sm" onClick={(e) => scope.cancelOptionsModalHandler(e)}>Close</button>
                  </div>            
                </div>
              </div>
            </div>
          )
    }
  }  