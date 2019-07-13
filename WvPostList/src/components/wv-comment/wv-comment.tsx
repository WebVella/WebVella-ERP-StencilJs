import { Component,Prop, h } from '@stencil/core';
import '@stencil/redux';//fixing undefined error
import { Store,Action } from '@stencil/redux';
import moment from 'moment';
import axios from 'axios';
import * as action from '../../store/actions';

@Component({
  tag: 'wv-comment'
})
export class WvComment {
  @Prop({ context: 'store' }) store: Store;
  @Prop() comment: Object = new Object();

  removeComment:Action;

  componentWillLoad() {
    this.store.mapDispatchToProps(this, {
      removeComment:action.removeComment
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
    let requestUrl = siteRoot + "/api/v3.0/p/project/pc-post-list/delete"; 
    let requestBody = new Object();      
    requestBody["id"] = scope.comment["id"];
    axios.post(requestUrl,requestBody,requestConfig)
    .then(function () {
      let actionPayload = {
        parentId:scope.comment["parent_id"],
        commentId:scope.comment["id"]
      }
      scope.removeComment(actionPayload);
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

    let userImagePath = "/assets/avatar.png";
    let userName = "system";
    let hrTime = moment(scope.comment["created_on"]).fromNow();
    let timeString = moment(scope.comment["created_on"]).format('YYYY MM DD HH:mm'); 
    let body = scope.comment["body"];
    let authorId = "";
    let currentUser = storeState.currentUser;
    let currentUserId = "";
    if(currentUser){
      currentUserId = currentUser["id"];
    }

    if(scope.comment["$user_1n_comment"] && scope.comment["$user_1n_comment"][0]["image"]){
      userImagePath = "/fs" +scope.comment["$user_1n_comment"][0]["image"];
    }
    if(scope.comment["$user_1n_comment"] && scope.comment["$user_1n_comment"][0]["username"]){
      userName = scope.comment["$user_1n_comment"][0]["username"];
    }
    if(scope.comment["$user_1n_comment"] && scope.comment["$user_1n_comment"][0]["id"]){
      authorId = scope.comment["$user_1n_comment"][0]["id"];
    }


    if(storeState.isDebug){
      userImagePath = "http://localhost:2202"+ userImagePath;
    }      
    return (
        <li class="comment">
            <div class="avatar">
                <img src={userImagePath} />
            </div>
            <div class="meta">
                <div class="header">
                    <div class="title"><span class="username">{userName}</span></div>
                    <div class="title-aux">
                      <span title={timeString}>{hrTime}</span>
                      <span class="actions">
                        <button type="button" onClick={(e) => {if(window.confirm('Are you sure?')) scope.DeleteLinkHandler(e)} } class={"btn btn-link btn-sm go-red " + (authorId == currentUserId ? "" : "d-none")}>Delete</button>
                      </span>                      
                    </div>
                </div>
                <div class="body" innerHTML={body}></div>
            </div>
        </li>
        );
  }
}
