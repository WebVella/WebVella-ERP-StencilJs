import { Component,Prop,State,Watch,Element } from '@stencil/core';
import { Store  } from '@stencil/redux';
import _ from 'lodash';
@Component({
  tag: 'wv-datasource-step2'
})
export class WvDatasourceStep2 {
  @Element() el!: HTMLStencilElement;
  @Prop({ context: 'store' }) store: Store;
  @State() datasourceId: string = null;
  @State() libraryVersion: number = 0;
  @State() isParamInfoVisible = false;

  componentWillLoad(){
    //Connect store
    this.store.mapStateToProps(this, (state) => {
      return { 
        datasourceId:state.datasourceId,
        libraryVersion:state.libraryVersion
      };
    });  

    // this.store.mapDispatchToProps(this, {
    //   setDatasourceId:action.setDatasourceId
    // });    

  }

  @Watch("libraryVersion")
  libraryVersionUpdate(){
    //Force unknow reason does not rerender on store change
    this.el.forceUpdate();
  }

  showParamInfo(e: UIEvent){
      e.preventDefault;
      this.isParamInfoVisible = !this.isParamInfoVisible;
  }

  render() {
      let scope = this;
      let library = scope.store.getState().library;
      if(library.length === 0){
        return null;
      }
      let pageDatasourceId = scope.store.getState().pageDatasourceId;
      let pageDatasourceName = scope.store.getState().pageDatasourceName;
      let pageDatasourceParams = scope.store.getState().pageDatasourceParams;
      let datasource = _.find(library,(x) => x["id"] ===  scope.datasourceId);
      let iconClass = "fa fa-fw fa-database go-purple";
      if(datasource["type"] === 1){
          iconClass = "fa fa-fw fa-code go-pink";
      }     
      //Init default pageDatasourceName if needed
      if(!pageDatasourceName){
        pageDatasourceName = datasource["name"];
      }


      return (
      <div>
          <div class="shadow-sm mb-3 card icon-card">
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
          <input type="hidden" name="page_datasource_id" value={pageDatasourceId}/>
          <input type="hidden" name="datasource_id" value={datasource["id"]}/>
          <div class="form-group erp-field text">
              <label class="control-label label-stacked">Page data property name:</label>     
              <input type="text" name="page_datasource_name" value={pageDatasourceName} class="form-control form-control-sm"/>
          </div>          
          <h3>Parameters <small>(<a href="#" onClick={(e)=> scope.showParamInfo(e)}>{scope.isParamInfoVisible ? "hide info" : "show info"}</a>)</small></h3>         
          <div class={scope.isParamInfoVisible ? "" : "d-none"}>
            <p>As parameter value you can submit <span class="go-teal">string</span>, <span class="go-teal">number</span>, "<span class="go-teal">true</span>", "<span class="go-teal">false</span>" or a reference to a datasource by using <span class="go-teal">{'{'}{'{'}datasourceName ?? default{'}'}{'}'}</span> eg. <span class="go-teal">{'{'}{'{'}RequestQuery.returnUrl ?? /{'}'}{'}'}</span></p>

          </div>     
          {
            datasource["parameters"].map(function(parameter){
              let pageDataSourceValue = null;
              let paramIndex = _.findIndex(pageDatasourceParams,(x)=>x["name"]===parameter["name"]);
              if(paramIndex > -1){
                pageDataSourceValue = pageDatasourceParams[paramIndex]["value"];
              }
              return(
                <div class="form-group datasource-param">
                  <div class="input-group input-group-sm">
                    <div class="input-group-prepend">
                      <div class="input-group-text name">{parameter["name"]}</div>                
                    </div>
                    <div class="input-group-prepend">
                      <div class="input-group-text go-teal type">{parameter["type"]}</div>                
                    </div>                
                    <input type="text" name={"@_" + parameter["name"]} value={pageDataSourceValue} placeholder="use default" class="form-control value"/>
                    <div class="input-group-append">
                      <div class="input-group-text default"> <span class="go-gray">??</span> {parameter["value"]}</div>                
                    </div>                                    
                  </div>
              </div>
              )
            })            
          }
          {
            datasource["parameters"].length === 0
            ? (<div class="alert alert-info">This datasource has no parameters</div>)
            : (null)
          }
      </div>
    );
    
  }
}
