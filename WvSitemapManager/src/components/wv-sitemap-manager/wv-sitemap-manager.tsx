import { Component, Prop,State, Listen } from '@stencil/core';

@Component({
    tag: 'wv-sitemap-manager',
    
  })

  export class WvSitemapManager {
    @Prop() initData: string;
    @Prop() appId: string;
    @Prop() apiRoot: string;
    @State() sitemapObj: Object = null;
    @State() nodePageDict: Object = null;
    @State() isAreaModalVisible: Boolean = false;
    @State() managedArea: Object = null;
    @State() isNodeModalVisible: Boolean = false;
    @State() managedNodeObj: Object = {areaId:null,node:null};    
    @State() apiResponse: Object = {message: "",errors: [],success:true};
    @State() nodeAuxData: Object = null;

    componentWillLoad() {
        if(this.initData){
          var initDataObj = JSON.parse(this.initData);
          this.sitemapObj = initDataObj["sitemap"];
          this.nodePageDict = initDataObj["node_page_dict"];
        }
      }

      createArea(){
        this.isAreaModalVisible = true;
        this.managedArea = null;       
      }

      //Area Listeners
      @Listen("wvSitemapManagerAreaManageEvent")
      areaManageEventHandler(event:CustomEvent){
        this.isAreaModalVisible = true;
        this.managedArea = {...event.detail};       
      }

      @Listen("wvSitemapManagerAreaModalCloseEvent")
      areaModalClose(){
        this.isAreaModalVisible = false;
        this.managedArea = null;       
        this.apiResponse = {message: "",errors: [],success:true};
      }      
      
      @Listen("wvSitemapManagerAreaSubmittedEvent")
      areaSubmittedEventHandler(event:CustomEvent){
        this.apiResponse = {message: "",errors: [],success:true};
        let submittedArea = event.detail;
        let apiUrl = this.apiRoot + "sitemap/area";
        if(submittedArea != null && submittedArea["id"]){
          apiUrl+="/" + submittedArea["id"];
        }
        apiUrl+="?appId=" + this.appId;
        
        let thisEl = this;
        fetch(apiUrl,
            {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip',
                'Accept': 'application/json',
              }),
              body: JSON.stringify(submittedArea)
            }          
          )
          .then(
            function(response){
              response.json().then(function(data) {
                let responseData = data;
                if(response.status !== 200 || responseData == null || !responseData["success"]){
                  thisEl.apiResponse = {...responseData}
                  thisEl.managedArea = {...submittedArea};
                  return;               
                }
                //Success
                thisEl.sitemapObj = {...responseData.object["sitemap"]};
                thisEl.nodePageDict = {...responseData.object["node_page_dict"]};
                thisEl.areaModalClose(); 
              });                             
            }
          )
          .catch(function(err) {
            var responseError = {
              success:false,
              message:err
            };
            thisEl.apiResponse = {...responseError}
            thisEl.managedArea = {...submittedArea};
          });          
      }      
     
      @Listen("wvSitemapManagerAreaDeleteEvent")
      areaDeleteEventHandler(event:CustomEvent){
        this.apiResponse = {message: "",errors: [],success:true};
        let areaId = event.detail;
        let apiUrl = this.apiRoot + "sitemap/area/" + areaId + "/delete" +"?appId=" + this.appId;
        let thisEl = this;
        fetch(apiUrl,
          {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Accept-Encoding': 'gzip',
              'Accept': 'application/json',
            })
          }          
        )
        .then(
          function(response){
            response.json().then(function(data) {
              let responseData = data;
              if(response.status !== 200 || responseData == null || !responseData["success"]){
                alert(responseData.message);
                return;               
              }
              //Success
              thisEl.sitemapObj = {...responseData.object["sitemap"]};
              thisEl.nodePageDict = {...responseData.object["node_page_dict"]};
              thisEl.areaModalClose(); 
            });                             
          }
        )
        .catch(function(err) {
          alert(err.message);
        });          
      }


      //Node Listeners
      @Listen("wvSitemapManagerNodeManageEvent")
      nodeManageEventHandler(event:CustomEvent){
        this.isNodeModalVisible = true;
        this.managedNodeObj= {...event.detail};    
      }

      @Listen("wvSitemapManagerNodeModalCloseEvent")
      nodeModalCloseEventHandler(){
        this.isNodeModalVisible = false;
        this.managedNodeObj = {areaId:null,node:null};       
        this.apiResponse = {message: "",errors: [],success:true};
      }         

      @Listen("wvSitemapManagerNodeSubmittedEvent")
      nodeSubmittedEventHandler(event:CustomEvent){
        this.apiResponse = {message: "",errors: [],success:true};
        let submittedNode = event.detail.node;
        let areaId = event.detail.areaId;
        let apiUrl = this.apiRoot + "sitemap/node";
        if(submittedNode != null && submittedNode["id"] != null){
          apiUrl+="/" + submittedNode["id"];
        }
        apiUrl+="?appId=" + this.appId + "&areaId=" + areaId;
        
        let thisEl = this;
        fetch(apiUrl,
            {
              method: 'POST',
              headers: new Headers({
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip',
                'Accept': 'application/json',
              }),
              body: JSON.stringify(submittedNode)
            }          
          )
          .then(
            function(response){
              response.json().then(function(data) {
                let responseData = data;
                if(response.status !== 200 || responseData == null || !responseData["success"]){
                  thisEl.apiResponse = {...responseData}
                  thisEl.managedNodeObj = {...event.detail};
                  return;               
                }
                //Success
                thisEl.sitemapObj = {...responseData.object["sitemap"]};
                thisEl.nodePageDict = {...responseData.object["node_page_dict"]};
                thisEl.nodeModalCloseEventHandler(); 
                thisEl.nodeAuxDataUpdateEventHandler(null);
              });                             
            }
          )
          .catch(function(err) {
            var responseError = {
              success:false,
              message:err
            };
            thisEl.apiResponse = {...responseError};
            thisEl.managedNodeObj = {...event.detail};
          });          
      }    

      @Listen("wvSitemapManagerNodeDeleteEvent")
      nodeDeleteEventHandler(event:CustomEvent){
        this.apiResponse = {message: "",errors: [],success:true};
        let nodeId = event.detail;
        let apiUrl = this.apiRoot + "sitemap/node/" + nodeId + "/delete" +"?appId=" + this.appId;
        let thisEl = this;
        fetch(apiUrl,
          {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Accept-Encoding': 'gzip',
              'Accept': 'application/json',
            })
          }          
        )
        .then(
          function(response){
            response.json().then(function(data) {
              let responseData = data;
              if(response.status !== 200 || responseData == null || !responseData["success"]){
                alert(responseData.message);
                return;               
              }
              //Success
              thisEl.sitemapObj = {...responseData.object["sitemap"]};
              thisEl.nodePageDict = {...responseData.object["node_page_dict"]};
              thisEl.nodeModalCloseEventHandler(); 
            });                             
          }
        )
        .catch(function(err) {
          alert(err.message);
        });          
      }      

      @Listen("wvSitemapManagerNodeAuxDataUpdateEvent")
      nodeAuxDataUpdateEventHandler(event:CustomEvent){
        if(event != null){
          var newNodeAuxData = {
            allEntities:event.detail.allEntities,
            nodeTypes:event.detail.nodeTypes,
            allPages:event.detail.allPages,
            nodePageDict:event.detail.nodePageDict
          }

          this.nodeAuxData = {...newNodeAuxData};
          this.managedNodeObj = {...event.detail["selectedNodeObj"]}
        }
        else{
          this.nodeAuxData = null;
          this.managedNodeObj = null;
        }
      }         

      render() {
        return(
            <div id="sitemap-manager">
                <div class="btn-group btn-group-sm mb-2">
                  <button type="button" class="btn btn-white" onClick={() => this.createArea()}><span class="fa fa-plus go-green"></span> add area</button>
                </div>
                {this.sitemapObj["areas"].map((area) => (
                    <wv-sitemap-manager-area area={area}></wv-sitemap-manager-area>
                ))}         
                {this.isAreaModalVisible ? (<wv-sitemap-area-modal submitResponse={this.apiResponse} area={this.managedArea}></wv-sitemap-area-modal>) : null}
                {this.isNodeModalVisible ? (<wv-sitemap-node-modal nodePageDict={this.nodePageDict} nodeAuxData={this.nodeAuxData} appId={this.appId} submitResponse={this.apiResponse} nodeObj={this.managedNodeObj} apiRoot={this.apiRoot}></wv-sitemap-node-modal>) : null}
                
            </div>
        )        
      }

  }