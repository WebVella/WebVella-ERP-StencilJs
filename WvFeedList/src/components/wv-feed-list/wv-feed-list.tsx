import { Component,Prop,State, h } from '@stencil/core';
import { configureStore } from '../../store/index';
import '@stencil/redux';//fixing undefined error
import { Store } from '@stencil/redux';
import _ from 'lodash';
import WvStore from '../../models/WvStore';

@Component({
  tag: 'wv-feed-list'
})
export class WvPostList {
  @Prop({ context: 'store' }) store: Store;
  @Prop() records: string = "{}";
  @Prop() isDebug: string = "false";

  @State() reloadPostIndex: number = 1;

  componentWillLoad() {
    var initStore = new WvStore();
    initStore.records = JSON.parse(this.records);
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
        {
          Object.keys(recordsList).map(function(group){
            return(
              <div>
                <div class="group">{group}</div>
              {
                recordsList[group].map(function(record){
                  return(
                    <wv-feed key={record["id"]} record={record}></wv-feed>
                  )
                })
              }
              </div>
            )
          })
        }
        <div class={"alert alert-info " + (recordsList.length === 0 ? "" : "d-none")}>No feeds found</div>
      </div>
    );
  }
}
