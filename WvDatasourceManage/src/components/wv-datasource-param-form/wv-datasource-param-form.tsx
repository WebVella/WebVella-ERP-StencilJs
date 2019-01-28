import { Component,Prop,State,Element,Watch } from '@stencil/core';
import { Store,Action } from '@stencil/redux';
import * as action from '../../store/actions';
import axios from 'axios';


@Component({
  tag: 'wv-datasource-param-form'
})
export class WvDatasourceParamForm {
  @Element() el!: HTMLStencilElement;
  @Prop({ context: 'store' }) store: Store;
  @State() datasourceId: string = null;

  setLibrary:Action;

  componentWillLoad(){
    let scope = this;
    //Connect store
    this.store.mapStateToProps(this, (state) => {
      return { 
        datasourceId:state.datasourceId
      };
    });  

    this.store.mapDispatchToProps(this, {
      setLibrary:action.setLibrary
    });        
    if(!this.store.getState().library || this.store.getState().library.length === 0){
      let apiUrl = this.store.getState().apiRootUrl;
      let requestConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
        }
      };    
      axios.get(apiUrl,requestConfig)
        .then(function(response){
          scope.setLibrary(response.data);
        })
        .catch(function(error){
          console.log(error);
          alert("Error occurred check console");
        })
    }
  }

  @Watch("datasourceId")
  libraryVersionUpdate(){
    //Force unknow reason does not rerender on store change
    this.el.forceUpdate();
  }

  render() {
    if(!this.datasourceId){
      return <wv-datasource-step1></wv-datasource-step1>;
    }
    else{
      return <wv-datasource-step2></wv-datasource-step2>;
    }
   
  }
}
