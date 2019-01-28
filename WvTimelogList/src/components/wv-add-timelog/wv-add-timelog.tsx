import { Component,Prop,State } from '@stencil/core';
import { Store,Action } from '@stencil/redux';
import axios from 'axios';
import * as action from '../../store/actions';
import moment from 'moment';


function SubmitReplyForm(scope){
  let storeState = scope.store.getState();
  let requestConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  }; 
  let siteRoot = storeState.siteRootUrl;
  let requestUrl = siteRoot + "/api/v3.0/p/project/pc-timelog-list/create"; 
  let requestBody = new Object();
  requestBody["minutes"] = scope.minutes;
  requestBody["loggedOn"] = scope.loggedOn;
  requestBody["body"] = scope.taskBody;
  requestBody["isBillable"] = scope.isBillable;
  requestBody["relatedRecords"] = storeState.relatedRecords;

  axios.post(requestUrl,requestBody,requestConfig)
  .then(function (response) {
      let actionPayload = {
        timelog:response.data.object
      }
      scope.addTimelog(actionPayload);
      scope.minutes = null;
      scope.isBillable = true;
      scope.taskBody = "";
      document.getElementById('wv-timelog-minutes').focus();
      (document.getElementById('wv-timelog-minutes') as any).value='';
      document.getElementById('wv-timelog-minutes').blur();

      document.getElementById('wv-timelog-body').focus();
      (document.getElementById('wv-timelog-body') as any).value='';
      document.getElementById('wv-timelog-body').blur();
  
      scope.isReplyBtnDisabled = true;
      scope.isReplyBoxVisible = false;
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

@Component({
  tag: 'wv-add-timelog'
})
export class WvAddNew {
  @Prop({ context: 'store' }) store: Store;

  @State() isReplyBoxVisible: boolean =  false;
  @State() isReplyBtnDisabled: boolean = true;
  @State() minutes: number = null;
  @State() isBillable:boolean = true;
  @State() taskBody:string = "";
  @State() loggedOn: string = null;
  @State() datePickr:Object = null;


  addTimelog:Action;

  componentWillLoad() {
    this.store.mapDispatchToProps(this, {
      addTimelog:action.addTimelog
    });   
    this.loggedOn = moment().toISOString();
    this.isBillable = this.store.getState().isBillable;
  }

  componentDidLoad(){
    let scope = this;
    let getFormEl = document.getElementById("form-timelog-add");
    if(getFormEl){
      getFormEl.addEventListener('keydown', function(ev){
        if (ev.keyCode == 13 && ev.ctrlKey && !scope.isReplyBtnDisabled) {
          //Blur both inputs so values can be set
          document.getElementById("wv-timelog-minutes").blur();
          document.getElementById("wv-timelog-body").blur();
          SubmitReplyForm(scope);
        }
      });      
      getFormEl.addEventListener('submit', function(ev){
          ev.preventDefault();
          SubmitReplyForm(scope);
      });                      
    }    
    window.setTimeout(function(){
      let flatPickrServerDateTimeFormat = "Z";//"Y-m-dTH:i:S";
      //From the server dates will be received yyyy-MM-ddTHH:mm:ss.fff
      let flatPickrUiDateTimeFormat = "d M Y";
      scope.datePickr = (window as any).flatpickr("#wv-timelog-add-datetime", { time_24hr: true, dateFormat: flatPickrServerDateTimeFormat, enableTime: false, altInput: true, altFormat: flatPickrUiDateTimeFormat });
    },100);
  }

  ReplyLinkHandler(event: UIEvent){
    event.preventDefault();
    let scope = this;
    if(scope.isReplyBoxVisible){
      scope.isReplyBoxVisible= false;
    }    
    else{
      scope.isReplyBoxVisible= true;
    }
  }

  minutesChange(ev){
    var parsed = parseInt(ev.target.value);
    if(!isNaN(parsed) && parsed > 0){
      this.minutes = parsed;
      this.isReplyBtnDisabled = false;
    }
    else{
      this.minutes = null;
      this.isReplyBtnDisabled = true;
    }
  }

  bodyChange(ev){
    this.taskBody = ev.target.value;
  }  

  loggedOnChange(ev){
    this.loggedOn = ev.target.value;
  }    

  billableChange(event){
    event.preventDefault();
    event.stopPropagation();
    let scope = this;
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;    
    scope.isBillable = value;
  }  

  render() {
    let scope = this;
    let storeState = scope.store.getState();

      let currentUserImagePath = "/assets/avatar.png";
      let currentUserName = "anonymous";
      let currentUser = storeState.currentUser;
      if(currentUser){
        if(currentUser["image"]){
          currentUserImagePath = "/fs" + currentUser["image"];
        }
        currentUserName = currentUser["username"];
      }    
      if(storeState.isDebug){
        currentUserImagePath = "http://localhost:2202"+ currentUserImagePath;
      }   
      return (
        <div>
          <div class={"mb-4 " + (scope.isReplyBoxVisible ? "d-none" : "")}>
            <button type="button" class="btn btn-sm btn-white" onClick={(e)=>scope.ReplyLinkHandler(e)}>Add time</button>
          </div>
          <div class={"post add-new mb-4 mt-0 " + (scope.isReplyBoxVisible ? "" : "d-none")}>
              <div class="header">
                <div class="avatar">
                  <img src={currentUserImagePath} />
                </div>
                <div class="meta">
                  <div class="title"><span class="username">{currentUserName}</span></div>
                </div>
              </div>
              <div class="body">
                <form name="PcPostListSaveForm" id="form-timelog-add">
                    <div class="row">
                    <div class="col-4">
                        <div class="form-group">
                          <div class="input-group input-group-sm">
                            <span class="input-group-prepend">
                              <span class="input-group-text"><i class="far fa-calendar-alt"></i></span>
                            </span>
                            <input class="form-control" id="wv-timelog-add-datetime" name="logged_on" value={scope.loggedOn} onChange={(e) => scope.loggedOnChange(e)}/>
                          </div>    
                        </div>               
                      </div>                    
                      <div class="col-4">
                        <div class="form-group">
                          <div class="input-group input-group-sm">
                            <input class="form-control" id="wv-timelog-minutes" name="minutes" value={scope.minutes} onChange={(e) => scope.minutesChange(e)}/>
                            <span class="input-group-append">
                              <span class="input-group-text">minutes</span>
                            </span>
                          </div>    
                        </div>               
                      </div>
                      <div class="col-4">
                        <div class="form-group form-check">
                          <label  class="form-check-label">
                            <input type="checkbox" class="form-check-input" value="true" checked={scope.isBillable} onChange={(e) => scope.billableChange(e)}/>
                            is billable
                          </label>
                        </div>
                      </div>

                  </div>
                  <div class="form-group erp-field">
                    <textarea class="form-control" id="wv-timelog-body" onChange={(e) => scope.bodyChange(e)}>{scope.taskBody}</textarea>
                  </div>
                  <div class="wv-field-html-toolbar mt-2">
                    <div class="content">
                      <button type="submit" class="btn btn-sm btn-primary" disabled={scope.isReplyBtnDisabled}>Submit</button>
                      <button type="button" class="btn btn-sm btn-link" onClick={(e) => scope.ReplyLinkHandler(e)}>Cancel</button>
                    </div>
                    <div class={"note "}>Ctrl+Enter to submit</div>
                  </div>
                </form>
              </div>
          </div>
        </div>        
      );      

  }
}
