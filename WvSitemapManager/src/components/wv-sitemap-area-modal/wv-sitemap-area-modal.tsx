import { Component, Prop,State, Event, EventEmitter, h } from '@stencil/core';
import _ from "lodash";

function InitIconSelect(scope){
  let selectId = "#modal-area-icon-class-select";
  //Hack as the default on Change is not triggering
  (window as any).$(selectId).on('select2:select', function (event) {
    scope.modalArea["icon_class"] = event.target.value;
 });   

 var wvIconOptions = [];
 _.forEach((window as any).WvFontAwesomeIcons,function(rec){
   wvIconOptions.push({id:rec.class,text:rec.class,name:rec.name});
 }); 

  (window as any).$(selectId).select2({
  data:wvIconOptions,
  theme: 'bootstrap4',
  //language: "bg",
  placeholder: 'not-selected',
  allowClear: true,
  closeOnSelect: true,
  width: 'element',
  escapeMarkup: function (markup) {
    return markup;
  },
  templateResult: function (state) {
          if(!state){
              return null
          }
    var $state = (window as any).$(
      '<div class="erp-ta-icon-result"><div class="icon-wrapper"><i class="icon fa-fw ' + state.id + '"/></div><div class="meta"><div class="title">' + state.id + '</div><div class="entity go-gray">' + state.name + '</div></div>'
    );
    return $state;
  }

  });
}

@Component({
    tag: 'wv-sitemap-area-modal'
    
  })

  export class WvSitemapAreaModal {
    @Prop() area: Object = null;
    @Prop() submitResponse: Object = {message:"",errors:[]};    
    @Event() wvSitemapManagerAreaModalCloseEvent:EventEmitter;
    @Event() wvSitemapManagerAreaSubmittedEvent:EventEmitter;
    @State() modalArea: Object = null;

    componentWillLoad(){
      var backdropId = "wv-sitemap-manager-area-modal-backdrop";
      var backdropDomEl = document.getElementById(backdropId);
      if(!backdropDomEl){
        var backdropEl = document.createElement('div');
        backdropEl.className = "modal-backdrop show";
        backdropEl.id = backdropId;
        document.body.appendChild(backdropEl);
        this.modalArea = {...this.area};
        delete this.modalArea["nodes"];        
      }      
    }

    componentDidLoad(){
      let scope = this;
      window.setTimeout(function(){
       InitIconSelect(scope);
      },100)
  }

    componentDidUnload(){
      var backdropId = "wv-sitemap-manager-area-modal-backdrop";
      var backdropDomEl = document.getElementById(backdropId);  
      if(backdropDomEl){
        backdropDomEl.remove();
      }                
      (window as any).$('#modal-area-icon-class-select').select2('destroy');
    }

    closeModal(){
      this.wvSitemapManagerAreaModalCloseEvent.emit(); 
    }

    handleSubmit(e) {
      e.preventDefault()
      this.wvSitemapManagerAreaSubmittedEvent.emit(this.modalArea); 
    }
  
    handleChange(event) {
      let propertyName = event.target.getAttribute('name');
      this.modalArea[propertyName] = event.target.value;
    }

    handleCheckboxChange(event) {
      let propertyName = event.target.getAttribute('name');
      let isChecked = event.target.checked;
      this.modalArea[propertyName] = isChecked;
    }

    render() {
      let modalTitle = "Manage area";
      if(!this.area){
        modalTitle = "Create area";
      }
        return(
          <div class="modal d-block">
            <div class="modal-dialog modal-xl">
              <div class="modal-content">
                <form onSubmit={(e)=> this.handleSubmit(e)}>
                  <div class="modal-header">
                    <h5 class="modal-title">{modalTitle}</h5>
                  </div>
                  <div class="modal-body">
                      <div class={"alert alert-danger " + (this.submitResponse["success"] ? "d-none" : "")}>{this.submitResponse["message"]}</div>
                      <div class="row">
                        <div class="col col-sm-6">
                          <div class="form-group wv-field">
                            <label class="control-label">Name</label>
                            <input class="form-control" name="name" value={this.modalArea["name"]} onInput={(event) => this.handleChange(event)}/>
                          </div>
                        </div>
                        <div class="col col-sm-6">
                          <div class="form-group wv-field">
                            <label class="control-label">Label</label>
                            <input class="form-control" name="label" value={this.modalArea["label"]} onInput={(event) => this.handleChange(event)}/>
                          </div>
                        </div>                              
                      </div>
                      <div class="row">
                        <div class="col col-sm-12">
                          <div class="form-group wv-field">
                            <label class="control-label">Description</label>
                            <textarea class="form-control" style={{height:"60px"}} name="description" onInput={(event) => this.handleChange(event)}>{this.modalArea["description"]}</textarea>
                          </div>
                        </div>
                      </div>         
                      <div class="row">
                        <div class="col col-sm-6">
                          <div class="form-group wv-field">
                            <label class="control-label">Weight</label>
                            <input type="number" step={1} min={1} class="form-control" name="weight" value={this.modalArea["weight"]} onInput={(event) => this.handleChange(event)}/>
                          </div>
                        </div>
                        <div class="col col-sm-6">
                          <div class="form-group wv-field">
                            <label class="control-label">Group names</label>
                              <div class="form-control-plaintext">
                                <div class="form-check">
                                  <label class="form-check-label"><input class="form-check-input" type="checkbox" name="show_group_names" value="true" checked={this.modalArea["show_group_names"]} onChange={(event) => this.handleCheckboxChange(event)}/> group names are visible</label>
                                </div>                            
                              </div>      
                          </div>
                        </div>                              
                      </div>        
                      <div class="row">
                        <div class="col col-sm-6">
                          <div class="form-group wv-field">
                            <label class="control-label">Color</label>
                            <input class="form-control" name="color" value={this.modalArea["color"]} onInput={(event) => this.handleChange(event)}/>
                          </div>
                        </div>
                        <div class="col col-sm-6">
                          <div class="form-group wv-field form">
                            <label class="control-label">Icon Class</label>
                            <select id="modal-area-icon-class-select" class="form-control" name="icon_class" onChange={(event) => this.handleChange(event)}>
                                  {
                                      this.modalArea["icon_class"] ?(
                                          <option value={this.modalArea["icon_class"]}>{this.modalArea["icon_class"]}</option>
                                      ):null
                                  }
                              </select>                            
                          </div>
                        </div>                              
                      </div>        
                      <div class="alert alert-info">Label and Description translations, and access are currently not managable</div>
                  </div>
                  <div class="modal-footer">
                    <button type="submit" class={"btn btn-green btn-sm " + (this.area == null ? "" :"d-none")}><span class="fa fa-plus"></span> Create area</button>
                    <button type="submit" class={"btn btn-blue btn-sm " + (this.area != null ? "" :"d-none")}><span class="far fa-save"></span> Save area</button>
                    <button type="button" class="btn btn-white btn-sm ml-1" onClick={() => this.closeModal()}>Close</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )        
      }

  }

  
    // createArea(e,areaObj){
    //     e.preventDefault();

    //     fetch('http://localhost:2202/api/v3.0/p/admin/sitemap/area',
    //         {
    //           method: 'POST',
    //           headers: new Headers({
    //             'Content-Type': 'application/json',
    //             'Accept-Encoding': 'gzip',
    //             'Accept': 'application/json',
    //           }),
    //           body: JSON.stringify(areaObj)
    //         }          
    //       )
    //       .then(
    //         function(response){
    //           if(response.status !== 200){
    //             console.log('Looks like there was a problem. Status Code: ' + response.status);
    //             return;               
    //           }
    //           // Examine the text in the response
    //           response.json().then(function(data) {
    //             console.log(data);
    //           });             
    //         }
    //       )
    //       .catch(function(err) {
    //         console.log('Fetch Error :-S', err);
    //       });          
    //   }
