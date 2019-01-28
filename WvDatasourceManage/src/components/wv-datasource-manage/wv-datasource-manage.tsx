import { Component,Prop } from '@stencil/core';
import { configureStore } from '../../store/index';
import WvDsManageStore from '../../models/WvDsManageStore';
import { Store,Action } from '@stencil/redux';
import * as action from '../../store/actions';

function setDatasourceHandler(scope){
  let payload = {
    datasourceId: scope.datasourceId,
    pageDatasourceId: scope.pageDatasourceId,
    pageDatasourceName: scope.pageDatasourceName,
    pageDatasourceParams: JSON.parse(scope.pageDatasourceParams)
  }    
  scope.setDatasource(payload);
}


@Component({
  tag: 'wv-datasource-manage'
})
export class WvDatasourceManage {
  @Prop({ context: 'store' }) store: Store;
  @Prop() show: boolean = false;
  @Prop() datasourceId: string = null;
  @Prop() pageDatasourceId: string = null;
  @Prop() pageDatasourceName: string = null;
  @Prop() pageDatasourceParams: string = null;
  @Prop() apiRootUrl: string = "";

  setDatasource:Action;

  componentWillLoad() {
      //Init Store
      var initStore = new WvDsManageStore();
      initStore.apiRootUrl = this.apiRootUrl;
      initStore.datasourceId = this.datasourceId;
      initStore.pageDatasourceId = this.pageDatasourceId;
      initStore.pageDatasourceName = this.pageDatasourceName;
      initStore.pageDatasourceParams = JSON.parse(this.pageDatasourceParams);
      this.store.setStore(configureStore(initStore));

    //Connect to Store
    // this.store.mapStateToProps(this, (state : WvDsManageStore) => {
    //   return { 
    //   };
    // });      
    this.store.mapDispatchToProps(this, {
      setDatasource:action.setDatasource
    });      
  }

  componentWillUpdate(){
    setDatasourceHandler(this);
  }

 
  
  render() {
    if(this.show){
      return <wv-datasource-param-form></wv-datasource-param-form>;
    }    
    else{
      return null;
    }
    
  }
}
