import {
  Component,
  Prop,
  State,
  Event,
  EventEmitter
} from '@stencil/core';

@Component({
  tag: 'wv-sitemap-node-modal'
})

export class WvSitemapNodeModal {
  @Prop() nodeObj: Object = {areaId:null,node:null};
  @Prop() nodePageDict: Object = null;  
  @Prop() apiRoot: string;
  @Prop() appId: string;
  @Prop() nodeAuxData: Object;
  @Prop() submitResponse: Object = {message: "",errors: [],success:true};
  @Event() wvSitemapManagerNodeModalCloseEvent: EventEmitter;
  @Event() wvSitemapManagerNodeSubmittedEvent: EventEmitter;
  @Event() wvSitemapManagerNodeAuxDataUpdateEvent: EventEmitter;
  @State() modalNodeObj: Object = {areaId:null,node:{},node_pages:[]};

  componentWillLoad(){
        var backdropId = "wv-sitemap-manager-area-modal-backdrop";
        var backdropDomEl = document.getElementById(backdropId);
        if(!backdropDomEl){
            var backdropEl = document.createElement('div');
            backdropEl.className = "modal-backdrop show";
            backdropEl.id = backdropId;
            document.body.appendChild(backdropEl);
        }
        if(this.nodeAuxData == null){
            this.LoadData();
        }

        if(this.nodeObj["node"]){
            this.modalNodeObj["node"] = {...this.nodeObj["node"]};
            if(!this.modalNodeObj["node"]["pages"]){
                this.modalNodeObj["node"]["pages"] = [];
            }
        }
        else{
            this.modalNodeObj["node"] = {pages:[]};
        }          
        this.modalNodeObj["areaId"] = this.nodeObj["areaId"];
        if(this.nodeObj["node"] && this.nodePageDict && this.nodePageDict[this.nodeObj["node"]["id"]]){
            this.modalNodeObj["node_pages"] = this.nodePageDict[this.nodeObj["node"]["id"]];
            this.modalNodeObj["node_pages"].forEach(element => {
                this.modalNodeObj["node"]["pages"].push(element["value"]);
            });            
        }           
   }
  
  componentDidUnload(){
    var backdropId = "wv-sitemap-manager-area-modal-backdrop";
    var backdropDomEl = document.getElementById(backdropId);  
    if(backdropDomEl){
      backdropDomEl.remove();
    }                
  }
  
  LoadData(){
        let apiUrl = this.apiRoot + "sitemap/node/get-aux-info" + "?appId=" + this.appId;
        let thisEl = this;
        fetch(apiUrl,
            {
              method: 'GET',
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
                  if(responseData != null){
                      alert(responseData["message"]);
                  }
                  else{
                      alert("Error: " +  response.status + " - " +  response.statusText);
                  }
                  return;               
                }
                //Success
                var dataAuxObj = {};
                dataAuxObj["allEntities"] = responseData["object"]["all_entities"];
                dataAuxObj["nodeTypes"] = responseData["object"]["node_types"];    
                dataAuxObj["allPages"] = responseData["object"]["all_pages"];  
                dataAuxObj["nodePageDict"] = responseData["object"]["node_page_dict"];  
                dataAuxObj["selectedNodeObj"] = thisEl.nodeObj;
                thisEl.wvSitemapManagerNodeAuxDataUpdateEvent.emit(dataAuxObj);
              });                             
            }
          )
          .catch(function(err) {
            alert(err.message);
          });           
    }

  closeModal() {
    this.wvSitemapManagerNodeModalCloseEvent.emit();
  }

  handleSubmit(e) {
    e.preventDefault();
    this.wvSitemapManagerNodeSubmittedEvent.emit(this.modalNodeObj);
  }

  handleChange(event) {
    let propertyName = event.target.getAttribute('name');
    this.modalNodeObj["node"][propertyName] = event.target.value;
  }

  handleCheckboxChange(event) {
    let propertyName = event.target.getAttribute('name');
    let isChecked = event.target.checked;
    this.modalNodeObj["node"][propertyName] = isChecked;
  }

  handleSelectChange(event) {
    let propertyName = event.target.getAttribute('name');
    let newObj = {...this.modalNodeObj};//in order to raise the watch afterwords
    newObj["node"][propertyName] = [];
    for(var i = 0; i < event.target.options.length; i++){
        var option = event.target.options[i];
        if(option.selected){
            newObj["node"][propertyName].push(String(option.value));
        }        
    }

    if(!newObj["node"][propertyName] || newObj["node"][propertyName].length === 0){
        newObj["node"][propertyName] = null;
    }
    else if(newObj["node"][propertyName].length == 1 && propertyName != "pages"){
        newObj["node"][propertyName] = newObj["node"][propertyName][0];        
    }    

    this.modalNodeObj = newObj;
  }  

  render(){
    let modalTitle = "Manage node";
    if(!this.nodeObj["node"]){
      modalTitle = "Create node";
    }    
    if(this.nodeAuxData == null){
        return(
            <div class="modal d-block">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header"><h5 class="modal-title">{modalTitle}</h5></div>
                        <div class="modal-body" style={{minHeight:"300px"}}>
                            <i class="fas fa-spinner fa-spin go-blue"></i> Loading data ...
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    
    if(!this.modalNodeObj["node"]["type"]){
        this.modalNodeObj["node"]["type"] = String(this.nodeAuxData["nodeTypes"][0]["value"]);
    }    

    if(!this.modalNodeObj["node"]["entity_id"]){
        this.modalNodeObj["node"]["entity_id"] = String(this.nodeAuxData["allEntities"][0]["value"]);
    } 
        
    //Generate available page options
    var allPagesPlusNode = [];
    var addedPages = [];
    this.modalNodeObj["node_pages"].forEach(element => {
        allPagesPlusNode.push(element);
        addedPages.push(element["value"]);
    });
    this.nodeAuxData["allPages"].forEach(element => {
        if(addedPages.length == 0 || (addedPages.length > 0 && addedPages.indexOf(element["page_id"]) === -1)){
            if(!element["node_id"] || element["node_id"] === this.modalNodeObj["node"]["id"]){
                var selectOption = {
                    value: element["page_id"],
                    label:element["page_name"]
                }
                allPagesPlusNode.push(selectOption);
            }
        }
    });

    return(
        <div class="modal d-block">
            <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <form onSubmit={(e)=> this.handleSubmit(e)}>
                <div class="modal-header">
                    <h5 class="modal-title">{modalTitle}</h5>
                </div>
                <div class="modal-body">
                    <div class={"alert alert-danger " + (this.submitResponse["success"] ? "d-none" : "")}>{this.submitResponse["message"]}</div>
                    <div class="row">
                        <div class="col col-sm-6">
                        <div class="form-group erp-field">
                            <label class="control-label">Name</label>
                            <input class="form-control" name="name" value={this.modalNodeObj["node"]["name"]} onInput={(event) => this.handleChange(event)}/>
                        </div>
                        </div>
                        <div class="col col-sm-6">
                        <div class="form-group erp-field">
                            <label class="control-label">Label</label>
                            <input class="form-control" name="label" value={this.modalNodeObj["node"]["label"]} onInput={(event) => this.handleChange(event)}/>
                        </div>
                        </div>                              
                    </div>
                    <div class="row">
                        <div class="col col-sm-6">
                            <div class="form-group erp-field">
                                <label class="control-label">Icon Class</label>
                                <input class="form-control" name="icon_class" value={this.modalNodeObj["node"]["icon_class"]} onInput={(event) => this.handleChange(event)}/>
                            </div>
                        </div>
                        <div class="col col-sm-6">
                                <div class="form-group erp-field">
                                <label class="control-label">Weight</label>
                                <input type="number" step={1} min={1} class="form-control" name="weight" value={this.modalNodeObj["node"]["weight"]} onInput={(event) => this.handleChange(event)}/>
                            </div>
                        </div>                           
                    </div>                            
                    <div class="row">
                        <div class="col col-sm-6">
                            <div class="form-group erp-field">
                                <label class="control-label">Type</label>
                                <select class="form-control" name="type" onChange={(event) => this.handleSelectChange(event)}>
                                    {this.nodeAuxData["nodeTypes"].map(function(type) { 
                                        return(
                                            <option value={type["value"]} selected={type.value === String(this.modalNodeObj["node"]["type"])}>{type["label"]}</option>
                                        )
                                    }.bind(this))}
                                </select>    
                            </div>
                        </div>                        
                        {String(this.modalNodeObj["node"]["type"]) === "1"
                            ? (
                                    <div class="col col-sm-6">
                                        <div class="form-group erp-field">
                                            <label class="control-label">Entity</label>
                                            <select class="form-control" name="entity_id" onChange={(event) => this.handleSelectChange(event)}>
                                                {this.nodeAuxData["allEntities"].map(function(type) { 
                                                    return(
                                                        <option value={type["value"]} selected={type.value === String(this.modalNodeObj["node"]["entity_id"])}>{type["label"]}</option>
                                                    )
                                                }.bind(this))}
                                            </select>    
                                        </div>
                                    </div>
                            )
                            : null
                        }           
                        {String(this.modalNodeObj["node"]["type"]) === "2"
                            ? (
                                    <div class="col col-sm-6">
                                        <div class="form-group erp-field">
                                            <label class="control-label">App Pages without nodes</label>
                                            <select class="form-control" multiple name="pages" onChange={(event) => this.handleSelectChange(event)}>
                                                {allPagesPlusNode.map(function(type) { 
                                                    let nodeSelected = false;
                                                    if(this.modalNodeObj["node"]["pages"] && this.modalNodeObj["node"]["pages"].length > 0 && this.modalNodeObj["node"]["pages"].indexOf(type.value) > -1){
                                                        nodeSelected = true;
                                                    }
                                                    return(
                                                        <option value={type["value"]} selected={nodeSelected}>{type["label"]}</option>
                                                    )
                                                }.bind(this))}
                                            </select>    
                                        </div>
                                    </div>
                            )
                            : null
                        }                                                        
                        {String(this.modalNodeObj["node"]["type"]) === "3"
                            ? (
                                    <div class="col col-sm-6">
                                        <div class="form-group erp-field">
                                            <label class="control-label">Url</label>
                                            <input class="form-control" name="url" value={this.modalNodeObj["node"]["url"]} onInput={(event) => this.handleChange(event)}/>
                                        </div>
                                    </div>
                            )
                            : null
                        }       
                    </div>                
                    <div class="alert alert-info">Label and Description translations, and access are currently not managable</div>
                </div>

                {this.nodeAuxData == null 
                    ? (null)
                    :(                
                    <div class="modal-footer">
                        <div>
                            <button type="submit" class={"btn btn-green btn-sm " + (this.modalNodeObj["node"] == null ? "" :"d-none")}><span class="ti-plus"></span> Create node</button>
                            <button type="submit" class={"btn btn-blue btn-sm " + (this.modalNodeObj["node"] != null ? "" :"d-none")}><span class="ti-save"></span> Save node</button>
                            <button type="button" class="btn btn-white btn-sm ml-1" onClick={() => this.closeModal()}>Close</button>
                        </div>
                    </div>
                    )}
                </form>
            </div>
            </div>
        </div>
    )
  }
}
