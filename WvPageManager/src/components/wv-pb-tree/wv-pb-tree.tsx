import { Component, Prop,State, h } from '@stencil/core';
import '@stencil/redux';//fixing undefined error
import { Store } from '@stencil/redux';
import _ from 'lodash';

function GetRootNodes(pageNodes: Array<Object>) : Array<Object>{
    let rootNodes : Array<Object> = new Array<Object>();
    _.forEach(pageNodes,function(node){
        if(!node["parent_id"]){
            rootNodes.push(node);
        }
    });   
    return _.sortBy(rootNodes,['weight']);
}

@Component({
    tag: 'wv-pb-tree'
  })

  export class WvPbNodeContainer {
    @Prop({ context: 'store' }) store: Store;
  
    @State() pageNodeChangeIndex: number = 1;

    componentWillLoad() {
      let scope = this;
      //Connect store
      scope.store.mapStateToProps(this, (state) => {
          return { 
              pageNodeChangeIndex:state.pageNodeChangeIndex
          };
      });      
    }  

    render() {
        let rootNodes = GetRootNodes(this.store.getState().pageNodes);
       return([
        <div class="header">
            <div class="title">Page Body</div>
            {/* <div class="action">
                <button type="button" class="btn btn-link btn-sm">
                    <i class="fa-search"></i>
                </button>
            </div>           */}
        </div>,
        <div class="body">
            {rootNodes.map(function(node){
                return(
                 <wv-pb-tree-node key={node["id"]} level={0} node={node}></wv-pb-tree-node>
                )
            })}
        </div>
      ])
    }

  }