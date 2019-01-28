import { Component,Prop,State,Watch } from '@stencil/core';
import { Store } from '@stencil/redux';
import WvPbStore from '../../models/WvPbStore';

@Component({
    tag: 'wv-show-options'
  })

  export class WvCreateModal {
    @Prop({ context: 'store' }) store: Store;
    @Prop() nodeId: string = "";
    @State() isOptionsModalVisible:boolean = false;

    componentWillLoad() {
      this.store.mapStateToProps(this, (state : WvPbStore) => {
          return { 
            isOptionsModalVisible:state.isOptionsModalVisible,
          };
      });        
       //Move Options in modal       
       let nodeOptionsTemplate = document.getElementById("node-options-" + this.nodeId);
       let OptionsModalPlaceholder = document.getElementById("modal-component-options-body");
       if(nodeOptionsTemplate){
        OptionsModalPlaceholder.appendChild(nodeOptionsTemplate);
        }       
    }

    @Watch("isOptionsModalVisible")
    optionsModalVisibilityHandler(newValue: boolean, oldValue: boolean){
      if(!newValue && oldValue){
        //Move Options in Options stack       
        let nodeOptionsStack = document.getElementById("wv-node-options-stack");
        let nodeOptionsTemplate = document.getElementById("node-options-" + this.nodeId);
        if(nodeOptionsTemplate){
          nodeOptionsStack.appendChild(nodeOptionsTemplate);
        }  
      }
    }

    render() {
        return null;
    }
  }  