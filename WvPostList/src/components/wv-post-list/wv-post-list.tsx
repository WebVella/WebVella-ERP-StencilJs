import { Component,Prop,State, h } from '@stencil/core';
import { configureStore } from '../../store/index';
import '@stencil/redux';//fixing undefined error
import { Store } from '@stencil/redux';
import _ from 'lodash';
import WvPostListStore from '../../models/WvPostListStore';

@Component({
  tag: 'wv-post-list'
})
export class WvPostList {
  @Prop({ context: 'store' }) store: Store;
  @Prop() posts: string = "[]";
  @Prop() currentUser: string = "{}";
  @Prop() isDebug: string = "false";
  @Prop() relatedRecordId: string = null;
  @Prop() relatedRecords: string = null;
  @Prop() siteRootUrl: string = null;

  @State() reloadPostIndex: number = 1;

  componentWillLoad() {
    var initStore = new WvPostListStore();
    initStore.posts = JSON.parse(this.posts);
    initStore.currentUser = JSON.parse(this.currentUser);
    initStore.relatedRecordId = this.relatedRecordId;
    initStore.relatedRecords = this.relatedRecords;
    initStore.siteRootUrl = this.siteRootUrl;
    initStore.reloadPostIndex = 1;


    //Init Editor
    let config = new Object() as any;
    config.language = "en";
    config.skin = 'moono-lisa';
    config.autoGrow_minHeight = 160;
    config.autoGrow_maxHeight = 600;
    config.autoGrow_bottomSpace = 10;
    config.autoGrow_onStartup = true;
    config.allowedContent = true;
    config.autoParagraph = false;
    config.toolbarLocation = 'top';
    let extraPluginsArray = ['divarea'];
    let removePluginsArray = [];

    extraPluginsArray.push("panel");
    extraPluginsArray.push("autogrow");
    config.toolbar = 'full';
    config.toolbar_full = [
      { name: 'basicstyles', items: ['Bold', 'Italic'] },
      { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
      { name: 'indent', items: ['Indent', 'Outdent'] },
      { name: 'links', items: ['Link', 'Unlink'] },
      { name: 'pasting', items: ['PasteText', 'PasteFromWord'] },
    ];
    removePluginsArray.push("uploadimage");
    removePluginsArray.push("uploadfile");    
    if (extraPluginsArray.length > 0) {
      config.extraPlugins = _.join(extraPluginsArray, ",");
    }
  
    if (removePluginsArray.length > 0) {
      config.removePlugins = _.join(removePluginsArray, ",");
    }
    initStore.editorConfig = config;


    if(this.isDebug.toLowerCase() === "true"){
      initStore.isDebug = true;
    }
    else{
      initStore.isDebug = false;
    }

    this.store.setStore(configureStore(initStore));

    this.store.mapStateToProps(this, (state : any) => {
      return { 
        reloadPostIndex:state.reloadPostIndex
      };
    });   
  }

  render() {
    let scope = this;
    let storeState = scope.store.getState();
    let postList = storeState.posts;
    return (
      <div class="pc-post-list">
        {
          postList.map(function(post){
            return(
              <wv-post key={post["id"]} post={post}></wv-post>
            )
          })
        }
        <wv-add-post></wv-add-post>
      </div>
    );
  }
}
