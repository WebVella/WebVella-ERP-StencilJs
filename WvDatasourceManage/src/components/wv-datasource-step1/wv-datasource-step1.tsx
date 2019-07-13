import { Component,Prop,State, h } from '@stencil/core';
import '@stencil/redux';//fixing undefined error
import { Store,Action  } from '@stencil/redux';
import * as action from '../../store/actions';
import _ from 'lodash';
@Component({
  tag: 'wv-datasource-step1'
})
export class WvDatasourceStep1 {
  @Prop({ context: 'store' }) store: Store;
  @State() libraryQueryString: string = null;
  @State() libraryVersion: number = 0;
  setDatasource:Action;

  componentWillLoad(){

    //Connect store
    this.store.mapStateToProps(this, (state) => {
      return { 
        libraryVersion:state.libraryVersion
      };
    });  

    this.store.mapDispatchToProps(this, {
      setDatasource:action.setDatasource
    });    

  }


  filterChangeHandler(event){
    event.preventDefault();
    event.stopPropagation();    
    this.libraryQueryString = event.target.value;  
  }

  selectDatasource(event:UIEvent,datasource: Object){
    event.preventDefault();
    event.stopPropagation();       
    let payload = {
      datasourceId: datasource["id"],
      pageDatasourceId: "",
      pageDatasourceName: "",
      pageDatasourceParams: new Array<Object>()
    }
    this.setDatasource(payload);
  }

  render() {
      let scope = this;
      let library = scope.store.getState().library;
      let filteredLibrary = new Array<Object>();
      if(scope.libraryQueryString){
        filteredLibrary = _.filter(library,function(x) { 
            let state =  x["name"].toLowerCase().includes(scope.libraryQueryString.toLowerCase());
            if(!state){
              state = x["description"].toLowerCase().includes(scope.libraryQueryString.toLowerCase());
            }
            if(!state){
              state = x["entity_name"].toLowerCase().includes(scope.libraryQueryString.toLowerCase());
            }          
            return state;
          });
      }
      else{
        filteredLibrary = library;
      }
      if(!filteredLibrary){
        filteredLibrary = new Array<Object>();
      }      
      window.setTimeout(function(){
        document.getElementById("wv-datasource-select-input").focus();
      },500);

      return (
      <div>
        <div class="input-group input-group-sm mb-3">
          <div class="input-group-prepend"><div class="input-group-text"><i class="fa fa-search"></i></div></div>
          <input class="form-control" value={scope.libraryQueryString} onInput={(e)=> scope.filterChangeHandler(e)} id="wv-datasource-select-input"/>
        </div>
        <div class="row">
        {
            filteredLibrary.map(function(datasource){
              let iconClass = "fa fa-fw fa-database go-purple";
              if(datasource["type"] === 1){
                  iconClass = "fa fa-fw fa-code go-pink";
              }                    
              return(
                <div class="col-4">
                  <div class="shadow-sm mb-4 card icon-card clickable" onClick={(e) => scope.selectDatasource(e,datasource)}>
                    <div class="card-body p-1">
                      <div class="icon-card-body">
                        <i class={"icon " + iconClass}></i>
                        <div class="meta">
                          <div class="title">{datasource["name"]}</div>
                          <div class="description">{datasource["description"]}</div>
                          <div class="library">{datasource["entity_name"]}</div>
                        </div>
                      </div>                    
                    </div>
                  </div>
                </div>
              )
            })
          }         
        </div>
      </div>
    );
    
  }
}
