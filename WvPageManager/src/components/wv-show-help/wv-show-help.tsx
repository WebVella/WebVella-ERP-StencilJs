import { Component,Prop,State,Watch } from '@stencil/core';
import { Store } from '@stencil/redux';
import WvPbStore from '../../models/WvPbStore';

@Component({
    tag: 'wv-show-help'
  })

  export class WvCreateModal {
    @Prop({ context: 'store' }) store: Store;
    @Prop() nodeId: string = "";
    @State() isHelpModalVisible:boolean = false;

    componentWillLoad() {
      this.store.mapStateToProps(this, (state : WvPbStore) => {
          return { 
            isHelpModalVisible:state.isHelpModalVisible,
          };
      });        
       //Move help in modal       
       let nodeHelpTemplate = document.getElementById("node-help-" + this.nodeId);
       let helpModalPlaceholder = document.getElementById("modal-component-help-body");
       if(nodeHelpTemplate){
        helpModalPlaceholder.appendChild(nodeHelpTemplate);
        }       
    }

    @Watch("isHelpModalVisible")
    helpModalVisibilityHandler(newValue: boolean, oldValue: boolean){
      if(!newValue && oldValue){
        //Move help in help stack       
        let nodeHelpStack = document.getElementById("wv-node-help-stack");
        let nodeHelpTemplate = document.getElementById("node-help-" + this.nodeId);
        if(nodeHelpTemplate){
          nodeHelpStack.appendChild(nodeHelpTemplate);
        }  
      }
    }

    render() {
        return null;
    }
  }  