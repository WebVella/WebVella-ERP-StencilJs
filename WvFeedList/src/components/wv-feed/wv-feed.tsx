import { Component,Prop, State } from '@stencil/core';
import { Store } from '@stencil/redux';
import moment from 'moment';

@Component({
  tag: 'wv-feed'
})
export class WvPost {
  @Prop({ context: 'store' }) store: Store;
  @Prop() record: Object = new Object();

  @State() reloadPostIndex: number = 1;

  componentWillLoad() {
    this.store.mapStateToProps(this, (state : any) => {
      return { 
        reloadPostIndex:state.reloadPostIndex
      };
    });    
    this.store.mapDispatchToProps(this, {
      //removePost:action.removePost
    });   
  }

  render() {
    let scope = this;
    let storeState = scope.store.getState();
    let userImagePath = "/assets/avatar.png";
    let userName = "system";
    let hrTime = moment(scope.record["created_on"]).fromNow();
    let timeString = moment(scope.record["created_on"]).format('YYYY MM DD HH:mm'); 
    let subject = scope.record["subject"];
    let body = scope.record["body"];

    if(scope.record["$user_1n_feed_item"] && scope.record["$user_1n_feed_item"][0]["image"]){
      userImagePath = "/fs" + scope.record["$user_1n_feed_item"][0]["image"];
    }
    if(scope.record["$user_1n_feed_item"] && scope.record["$user_1n_feed_item"][0]["username"]){
      userName = scope.record["$user_1n_feed_item"][0]["username"];
    }


    if(storeState.isDebug){
      userImagePath = "http://localhost:2202"+ userImagePath;
    }    
    
    let icon = "";
    switch(scope.record["type"]){
      case "system":
        icon = "<i class='mr-1 fa fa-cog go-teal'></i>";
        break;
      case "task":
        icon = "<i class='mr-1 fas fa-user-cog go-teal'></i>";
        break;
      case "case":
        icon = "<i class='mr-1 fa fa-file go-teal'></i>";
        break;
      case "timelog":
        icon = "<i class='mr-1 far fa-clock go-teal'></i>";      
        break;
      case "comment":
        icon = "<i class='mr-1 far fa-comment go-teal'></i>";      
        break;                                
      default:
        break;
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
              <span innerHTML={icon}></span> <span title={timeString}>{hrTime}</span>
            </div>
          </div>
        </div>
        <div class="body" innerHTML={body}></div>
      </div>
    );
  }
}
