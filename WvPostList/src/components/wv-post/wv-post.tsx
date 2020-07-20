import { Component,Prop, State, h } from '@stencil/core';
import '@stencil/redux';//fixing undefined error
import { Store,Action } from '@stencil/redux';
import moment from 'moment';
import axios from 'axios';
import * as action from '../../store/actions';


function RenderPostFooter(props){
  let scope = props.scope;
  let storeState = scope.store.getState();

  if(!scope.post["nodes"]){
    scope.post["nodes"] = new Array<Object>();
  }
  let currentUserImagePath = "/_content/WebVella.Erp.Web/assets/avatar.png";
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
  return(
    <div class="footer">
      <ul class="comment-list">
        {
          scope.post["nodes"].map(function(comment){
            return(
              <wv-comment key={comment["id"]} comment={comment}></wv-comment>
            );
          })
        }
        <li class={"comment add-new " + (scope.isReplyBoxVisible ? "" : "d-none")}>
          <div class="avatar">
            <img src={currentUserImagePath} />
          </div>
          <div class="meta">
            <div class="header">
              <div class="title"><span class="username">{currentUserName}</span></div>
            </div>
            <div class="body">
              <form name="PcPostListSaveForm" id={"form-" + storeState.relatedRecordId + "-" + scope.post["id"]}>
                <textarea id={"reply-"+ storeState.relatedRecordId + "-" + scope.post["id"]}></textarea>
                <div class="wv-field-html-toolbar">
                  <div class="content">
                    <button type="submit" class="btn btn-sm btn-primary" disabled={scope.isReplyBtnDisabled}>Submit</button>
                    <button type="button" class="btn btn-sm btn-link"  onClick={(e) => scope.ReplyLinkHandler(e)}>Cancel</button>
                  </div>
                  <div class="note">Ctrl+Enter to submit</div>
                </div>
              </form>
            </div>
          </div>
        </li>          
      </ul>
    </div>
  );

}

function SubmitReplyForm(scope){
  let storeState = scope.store.getState();
  let editorContent = (scope.ckEditor as any).getData();
  let requestConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
  }; 
  let siteRoot = storeState.siteRootUrl;
  let requestUrl = siteRoot + "/api/v3.0/p/project/pc-post-list/create"; 
  let requestBody = new Object();
  requestBody["relatedRecordId"] = storeState.relatedRecordId;
  requestBody["relatedRecords"] = storeState.relatedRecords;
  requestBody["body"] = editorContent;
  requestBody["parentId"] = scope.post["id"];
  axios.post(requestUrl,requestBody,requestConfig)
  .then(function (response) {
      let actionPayload = {
        comment:response.data.object
      }
      scope.addComment(actionPayload);
      if(scope.ckEditor){
        (scope.ckEditor as any).setData("");
      }
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
  tag: 'wv-post'
})
export class WvPost {
  @Prop({ context: 'store' }) store: Store;
  @Prop() post: Object = new Object();

  @State() isReplyBoxVisible: boolean = false;
  @State() isReplyBtnDisabled: boolean = true;
  @State() ckEditor: Object = null;
  @State() reloadPostIndex: number = 1;

  removePost:Action;
  addComment:Action;
  

  componentWillLoad() {
    this.store.mapStateToProps(this, (state : any) => {
      return { 
        reloadPostIndex:state.reloadPostIndex,
      };
    });    
    this.store.mapDispatchToProps(this, {
      removePost:action.removePost,
      addComment:action.addComment
    });   
  }

  ReplyLinkHandler(event: UIEvent){
    event.preventDefault();
    let scope = this;
    if(scope.isReplyBoxVisible){
      scope.isReplyBoxVisible= false;
    }
    else if(!scope.ckEditor){
      let storeState = scope.store.getState();      
      scope.ckEditor = (window as any).CKEDITOR.replace('reply-' + storeState.relatedRecordId + "-" + scope.post["id"], storeState.editorConfig);
      (scope.ckEditor as any).on('instanceReady', function(){
        scope.isReplyBoxVisible= true;
        window.setTimeout(function(){
          (scope.ckEditor as any).focus();
          let getFormEl = document.getElementById("form-" + storeState.relatedRecordId + "-" + scope.post["id"]);
          if(getFormEl){
            getFormEl.addEventListener('keyup', function(ev){
              if (!(ev.keyCode == 13 && ev.ctrlKey)) {
                var editorContent = (scope.ckEditor as any).getData();
                if (editorContent) {
                  scope.isReplyBtnDisabled = false;
                }
                else{
                  scope.isReplyBtnDisabled = true;
                }
              }
            });  
            getFormEl.addEventListener('keydown', function(ev){
              if (ev.keyCode == 13 && ev.ctrlKey && !scope.isReplyBtnDisabled) {
                SubmitReplyForm(scope);
              }
            });
            getFormEl.addEventListener('submit', function(ev){
              ev.preventDefault();
              SubmitReplyForm(scope);
          });                            
          }
        },100);
      });
    }
    else{
      scope.isReplyBoxVisible= true;
      window.setTimeout(function(){
        (scope.ckEditor as any).focus();
      },100);
    }
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
    requestBody["id"] = scope.post["id"];
    axios.post(requestUrl,requestBody,requestConfig)
    .then(function () {
      let actionPayload = {
        postId:scope.post["id"]
      }
      scope.removePost(actionPayload);
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
    let userImagePath = "/_content/WebVella.Erp.Web/assets/avatar.png";
    let userName = "system";
    let hrTime = moment(scope.post["created_on"]).fromNow();
    let timeString = moment(scope.post["created_on"]).format('YYYY MM DD HH:mm'); 
    let subject = scope.post["subject"];
    let body = scope.post["body"];
    let authorId = "";
    let currentUser = storeState.currentUser;
    let currentUserId = "";
    if(currentUser){
      currentUserId = currentUser["id"];
    }
    if(scope.post["$user_1n_comment"] && scope.post["$user_1n_comment"][0]["image"]){
      userImagePath = "/fs" +scope.post["$user_1n_comment"][0]["image"];
    }
    if(scope.post["$user_1n_comment"] && scope.post["$user_1n_comment"][0]["username"]){
      userName = scope.post["$user_1n_comment"][0]["username"];
    }
    if(scope.post["$user_1n_comment"] && scope.post["$user_1n_comment"][0]["id"]){
      authorId = scope.post["$user_1n_comment"][0]["id"];
    }

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
                <button type="button" onClick={(e) => scope.ReplyLinkHandler(e)} class="btn btn-link btn-sm ">Reply</button>
                <button type="button" onClick={(e) => {if(window.confirm('Are you sure?')) scope.DeleteLinkHandler(e)} } class={"btn btn-link btn-sm go-red " + (authorId == currentUserId ? "" : "d-none")}>Delete</button>
              </span>
            </div>
          </div>
        </div>
        <div class="body" innerHTML={body}></div>
        <RenderPostFooter scope={scope}/>
      </div>
    );
  }
}
