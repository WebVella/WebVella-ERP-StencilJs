import { Component,Prop,State, h } from '@stencil/core';
import '@stencil/redux';//fixing undefined error
import { Store,Action } from '@stencil/redux';
import * as action from '../../store/actions';
import WvPbStore from '../../models/WvPbStore';
import _ from 'lodash';
import axios from 'axios';
import WvPbEventPayload from "../../models/WvPbEventPayload";

function AddNewComponent(scope,component){
    let requestBody = scope.store.getState().createdNode;
    requestBody["component_name"] = component["name"];
    requestBody["options"] = JSON.stringify(requestBody["options"]);
    let requestConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
      }
    }; 
    let siteRoot = scope.store.getState().siteRootUrl;
    let requestUrl = siteRoot + "/api/v3.0/page/" + requestBody["page_id"] + "/node/create"; 
    let recordId = scope.store.getState().recordId;
    if(recordId){
      requestUrl += "?recId="+recordId;
    }
  
    axios.post(requestUrl,requestBody,requestConfig)
    .then(function (response) {
 
      scope.addNode(response.data);
      //Add for reload
      window.setTimeout(function(){
        scope.addReloadNodeIds(response.data["id"]);

        var customEvent = new Event("WvPbManager_Node_Added");
        var payload = new WvPbEventPayload();
        payload.original_event = event;
        payload.node = requestBody;
        payload.component_name = requestBody["component_name"];
        customEvent["payload"] = payload; 
        document.dispatchEvent(customEvent)
        //console.info("dispatch",customEvent);
      },10);      

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

function RecalculateComponentList(scope){
  let library = scope.store.getState().library;
  let filteredLibrary = [];
  if(scope.filterString){
    filteredLibrary = _.filter(library,function(x) { 
        let state =  x["label"].toLowerCase().includes(scope.filterString.toLowerCase());
        if(!state){
          state = x["library"].toLowerCase().includes(scope.filterString.toLowerCase());
        }
        if(!state){
          state = x["description"].toLowerCase().includes(scope.filterString.toLowerCase());
        }          
        return state;
      });
  }
  else{
    filteredLibrary = library;
  }
  if(!filteredLibrary){
    filteredLibrary = [];
  }       

  //Apply sort
  switch(scope.sort){
    case "usage":
      filteredLibrary = _.orderBy(filteredLibrary, ['usage_counter'],['desc']);
      break;
    case "alpha":
      filteredLibrary = _.orderBy(filteredLibrary, ['label'],['asc']);
      break;              
    default:
      filteredLibrary = _.orderBy(filteredLibrary, ['last_used_on'],['desc']);
      break;
  }
  //Apply paging
  let startIndex = (scope.page-1)*scope.pageSize;
  let endIndex = startIndex+scope.pageSize;
  let filterTotal =  filteredLibrary.length;
  if(endIndex > filterTotal){
    endIndex = filterTotal;
  }
  
  scope.total = filterTotal;
  scope.pageCount = scope.total / scope.pageSize;
  scope.componentList = _.slice(filteredLibrary,startIndex,endIndex);
}

@Component({
    tag: 'wv-create-modal'
  })

  export class WvCreateModal {
    @Prop({ context: 'store' }) store: Store;
    @State() filterString: string;
    @State() isCreateModalVisible:boolean = false;
    @State() page:number = 1;
    @State() pageSize:number = 24;
    @State() sort:string = "recent";
    @State() componentList: Array<Object> = new Array<Object>();
    @State() total:number = 0;
    @State() pageCount: number = 0;
    private focused = false;

    setNodeCreation:Action;
    addNode:Action;
    addReloadNodeIds:Action;

    componentWillLoad() {
        let scope = this;
        //Connect to Store
        scope.store.mapStateToProps(scope, (state : WvPbStore) => {
            return { 
               isCreateModalVisible:state.isCreateModalVisible,
            };
        });           
        
        scope.store.mapDispatchToProps(scope, {
            setNodeCreation:action.setNodeCreation,
            addNode:action.addNode,
            addReloadNodeIds:action.addReloadNodeIds
        });
        //Reinit
        document.body.className = document.body.className.replace(" modal-open","").replace("modal-open","");
        document.body.style.paddingRight = null;
        let backdrop = document.getElementById("wv-pb-backdrop");
        if(backdrop){
          backdrop.parentNode.removeChild(backdrop);        
        }          
    }

    cancelNodeCreateHandler(event:UIEvent){
      event.preventDefault();
      event.stopPropagation();    
      this.filterString = "";
      this.setNodeCreation(null);
    }    

    filterChangeHandler(event){
      event.preventDefault();
      event.stopPropagation();    
      this.filterString = event.target.value;  
      this.page = 1;
    }

    selectComponent(event:UIEvent, component: Object){
      event.preventDefault();
      event.stopPropagation();       
      AddNewComponent(this,component);
      this.filterString = "";
    }

    changeSort(ev,sort){
      ev.preventDefault();
      this.sort = sort;
      this.page = 1;
    }

    changePage(ev,page){
      ev.preventDefault();
      if(page > 0){
        this.page = page;
      }
    }


    render() {
        let scope = this;
        RecalculateComponentList(scope);
        let showModal = scope.isCreateModalVisible;
        if(!showModal){
            scope.focused = false;
            scope.filterString = "";
            this.page = 1;
            this.sort = "recent";
            return null;
        }
        if(!scope.focused){
          window.setTimeout(function(){
            let inputEl = document.getElementById("wv-pb-select-component-input");
            if(inputEl){ //fixing error when the element is no longer available
              inputEl.focus();
              scope.focused = true;
            }
          },10);   
        }

        let rowArray = [0,1,2,3];
        let pageArray = [];
        for(let i = 1; i < scope.pageCount + 1 ; i++){
          pageArray.push(i);
        }
        return(
            <div class="modal show d-block" style={{paddingRight:"17px"}}>
              <div class="modal-dialog modal-full">
                <div class="modal-content">
                  <div class="modal-header d-none">
                    <h5 class="modal-title">Select component</h5>
                    <button type="button" class="close" onClick={(e) => scope.cancelNodeCreateHandler(e)}>
                      <span aria-hidden="true">&times;</span>
                    </button>              
                  </div>
                  <div class="modal-body">
                    <nav class="navbar navbar-expand-lg navbar-light mb-3 go-bkg-blue-gray-light">
                      <div class="flex-grow-1">
                        <ul class="nav nav-pills">
                          <li class="nav-item">
                            <a class={"nav-link "+ (scope.sort === "recent" ? "active" : "")} href="#" onClick={(e)=> scope.changeSort(e,"recent")}>Recent</a>
                          </li>
                          <li class="nav-item">
                            <a class={"nav-link "+ (scope.sort === "usage" ? "active" : "")} href="#" onClick={(e)=> scope.changeSort(e,"usage")}>Most Used</a>
                          </li>
                          <li class="nav-item">
                            <a class={"nav-link "+ (scope.sort === "alpha" ? "active" : "")} href="#" onClick={(e)=> scope.changeSort(e,"alpha")}>Alphabetical</a>
                          </li>
                        </ul>
                      </div>                    
                      <div class="form-inline">
                        <input class="form-control form-control-sm" placeholder="component name" onInput={(e)=> scope.filterChangeHandler(e)} id="wv-pb-select-component-input"/>
                      </div>
                    </nav>                  
                      {
                        scope.componentList.map(function(record,index){
                          record = record;//To remove not used error
                          return(
                            <div class="row">
                            {
                              rowArray.map(function(subIndex){
                                  let compIndex = index + subIndex;

                                  if(compIndex < scope.componentList.length && index%4 === 0){
                                    let component = scope.componentList[compIndex];
                                    let iconClass = "fa fa-file";
                                    if(component["icon_class"]){
                                        iconClass = component["icon_class"];
                                    }                    
                                    return(
                                      <div class="col-6 col-lg-3" key={component["name"]}>
                                        <div class="shadow-sm mb-4 card icon-card clickable" onClick={(e) => scope.selectComponent(e,component)}>
                                          <div class="card-body p-1">
                                          <div class="icon-card-body">
                                            <i class={"icon " + iconClass}></i>
                                            <div class="meta">
                                              <div class="title">{component["label"]}</div>
                                              <div class="description">{component["description"]}</div>
                                              <div class="library">{component["library"]}</div>
                                            </div>
                                          </div>                              
                                          </div>
                                        </div>
                                      </div>
                                    )
                                }
                              })
                            }
                            </div>
                            )
                          })                         
                        }

                        <nav aria-label="Page navigation example">
                          <ul class="pagination justify-content-center">
                            <li class={"page-item " + (scope.page > 1 ? "" : "disabled")}>
                              <a class="page-link" href="#" onClick={(e)=> scope.changePage(e,scope.page-1)}>Previous</a>
                            </li>
                            {
                              pageArray.map(function(pageNum){
                                return(
                                  <li class={"page-item " + (scope.page === pageNum ? "active" : "")}><a class="page-link" href="#" onClick={(e)=> scope.changePage(e,pageNum)}>{pageNum}</a></li>
                                )
                              })
                            }
                           

                            <li class={"page-item " + (scope.page >= scope.pageCount ? "disabled" : "")}>
                              <a class="page-link" href="#" onClick={(e)=> scope.changePage(e,scope.page+1)}>Next</a>
                            </li>
                          </ul>
                        </nav>                        
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-white btn-sm" onClick={(e) => scope.cancelNodeCreateHandler(e)}>Cancel</button>
                  </div>            
                </div>
              </div>
            </div>
          )
    }
  }  