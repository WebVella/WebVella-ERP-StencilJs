import { Component,Prop,State } from '@stencil/core';
import { configureStore } from '../../store/index';
import { Store } from '@stencil/redux';
import _ from 'lodash';
import WvTimeLogListStore from '../../models/WvTimeLogListStore';

@Component({
  tag: 'wv-timelog-list'
})
export class WvPostList {
  @Prop({ context: 'store' }) store: Store;
  @Prop() records: string = "[]";
  @Prop() currentUser: string = "{}";
  @Prop() isDebug: string = "false";
  @Prop() relatedRecords: string = null;
  @Prop() siteRootUrl: string = null;
  @Prop() isBillable: boolean = true;

  @State() reloadPostIndex: number = 1;

  componentWillLoad() {
    var initStore = new WvTimeLogListStore();
    initStore.records = JSON.parse(this.records);
    initStore.currentUser = JSON.parse(this.currentUser);
    initStore.relatedRecords = this.relatedRecords;
    initStore.siteRootUrl = this.siteRootUrl;
    initStore.isBillable = this.isBillable;
    initStore.reloadPostIndex = 1;

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
    let recordsList = storeState.records;
    return (
      <div class="pc-post-list">
        <wv-add-timelog></wv-add-timelog>
        {
          recordsList.map(function(post){
            return(
              <wv-timelog key={post["id"]} post={post}></wv-timelog>
            )
          })
        }
      </div>
    );
  }
}
