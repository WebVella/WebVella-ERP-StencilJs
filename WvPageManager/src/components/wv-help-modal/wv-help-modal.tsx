import { Component,Prop,State } from '@stencil/core';
import { Store,Action } from '@stencil/redux';
import * as action from '../../store/actions';
import WvPbStore from '../../models/WvPbStore';
import _ from 'lodash';
// import axios from 'axios';
// import WvPbEventPayload from "../../models/WvPbEventPayload";


@Component({
    tag: 'wv-help-modal'
  })

  export class WvCreateModal {
    @Prop({ context: 'store' }) store: Store;
    @State() isHelpModalVisible:boolean = false;

    setHelpModalState:Action;

    componentWillLoad() {
        //Connect to Store
        this.store.mapStateToProps(this, (state : WvPbStore) => {
            return { 
              isHelpModalVisible:state.isHelpModalVisible,
            };
        });        
        this.store.mapDispatchToProps(this, {
          setHelpModalState:action.setHelpModalState
      });           
    }

    cancelHelpModalHandler(event:UIEvent){
        event.preventDefault();
        event.stopPropagation();    
        this.setHelpModalState(false);
      }    

    render() {
        let scope = this;
        let showModal = scope.isHelpModalVisible;
        if(!showModal){
            return null;
        }
        return(
            <div class="modal show d-block" style={{paddingRight:"17px"}} id="modal-component-help">
              <div class="modal-dialog modal-xl">
                <div class="modal-content">
                  <div class="modal-header">
                    <span class="title">Component help</span>
                    <span class="aside">wv-{scope.store.getState().activeNodeId}</span>            
                  </div>
                  <div class="modal-body" id="modal-component-help-body">
                     <wv-show-help nodeId={scope.store.getState().activeNodeId}></wv-show-help>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-white btn-sm" onClick={(e) => scope.cancelHelpModalHandler(e)}>Close</button>
                  </div>            
                </div>
              </div>
            </div>
          )
    }
  }  