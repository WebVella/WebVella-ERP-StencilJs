import { Component,Prop, State, h } from '@stencil/core';
import '@stencil/redux';//fixing undefined error
import { Store,Action } from '@stencil/redux';
import moment from 'moment';
import axios from 'axios';
import * as action from '../../store/actions';


@Component({
  tag: 'wv-timelog'
})
export class WvPost {
  @Prop({ context: 'store' }) store: Store;
  @Prop() post: Object = new Object();

  @State() isReplyBoxVisible: boolean = false;
  @State() isReplyBtnDisabled: boolean = true;
  @State() reloadPostIndex: number = 1;

  
  removeTimelog:Action;

  componentWillLoad() {
    this.store.mapStateToProps(this, (state : any) => {
      return { 
        reloadPostIndex:state.reloadPostIndex,
      };
    });    
    this.store.mapDispatchToProps(this, {
      removeTimelog:action.removeTimelog
    });   
  }

  DeleteLinkHandler(event:UIEvent){
    event.preventDefault();
    let scope = this;
    let storeState = scope.store.getState();
    let requestConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
      }
    };   
    let siteRoot = storeState.siteRootUrl;
    let requestUrl = siteRoot + "/api/v3.0/p/project/pc-timelog-list/delete"; 
    let requestBody = new Object();      
    requestBody["id"] = scope.post["id"];

    axios.post(requestUrl,requestBody,requestConfig)
    .then(function () {
      let actionPayload = {
        timelogId:scope.post["id"]
      }
      scope.removeTimelog(actionPayload);
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

  render() {
    let scope = this;
    let storeState = scope.store.getState();
    let userImagePath = "/webvella-erp-web/assets/avatar.png";
    let userName = "system";
    let hrTime = moment(scope.post["created_on"]).fromNow();
    let timeString = moment(scope.post["created_on"]).format('DD MMM YYYY HH:mm'); 
    let logString = moment(scope.post["logged_on"]).format('DD MMM YYYY'); 
    let subject = scope.post["subject"];
    let body = scope.post["body"];
    let authorId = "";
    let currentUser = storeState.currentUser;
    let currentUserId = "";
    if(currentUser){
      currentUserId = currentUser["id"];
    }
    if(scope.post["$user_1n_timelog"] && scope.post["$user_1n_timelog"][0]["image"]){
      userImagePath = "/fs" +scope.post["$user_1n_timelog"][0]["image"];
    }
    if(scope.post["$user_1n_timelog"] && scope.post["$user_1n_timelog"][0]["username"]){
      userName = scope.post["$user_1n_timelog"][0]["username"];
    }
    if(scope.post["$user_1n_timelog"] && scope.post["$user_1n_timelog"][0]["id"]){
      authorId = scope.post["$user_1n_timelog"][0]["id"];
    }            
    let billableString = "nonbillable";
    if(scope.post["is_billable"] || scope.post["is_billable"] === "true"){
      billableString = "billable";
    }

    subject = "logged <strong>" + scope.post["minutes"] + " " + billableString + "</strong> minutes on <strong>" + logString + "</strong>";

    if(storeState.isDebug){
      userImagePath = "http://localhost:2202"+ userImagePath;
    }    
    
    return (
      <div class="post">
        <div class="header">
          <div class="avatar">
            <img src={userImagePath} />
          </div>
          <div class="meta">
            <div class="title"><span class="username">{userName}</span> <span innerHTML={subject}></span></div>
            <div class="title-aux">
              <span title={timeString}>{hrTime}</span>
              <span class="actions">
                <button type="button" onClick={(e) => {if(window.confirm('Are you sure?')) scope.DeleteLinkHandler(e)} } class={"btn btn-link btn-sm go-red " + (authorId == currentUserId ? "" : "d-none")}>Delete</button>
              </span>
            </div>
          </div>
        </div>
        <div class="body" innerHTML={body}></div>
      </div>
    );
  }
}
