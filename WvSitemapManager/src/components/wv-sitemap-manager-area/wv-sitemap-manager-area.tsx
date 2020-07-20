import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import _ from "lodash";
@Component({
    tag: 'wv-sitemap-manager-area',
    
  })

  export class WvSitemapManagerArea {
    @Prop() area: Object;
    @Event() wvSitemapManagerAreaManageEvent:EventEmitter;
    @Event() wvSitemapManagerAreaDeleteEvent:EventEmitter;
    @Event() wvSitemapManagerNodeManageEvent:EventEmitter;
    @Event() wvSitemapManagerNodeDeleteEvent:EventEmitter;    

    manageArea(){
        this.wvSitemapManagerAreaManageEvent.emit(this.area);
    }

    deleteArea(event){
        if(confirm("Are you sure?")){
            this.wvSitemapManagerAreaDeleteEvent.emit(this.area["id"]);            
        }else{
            event.preventDefault();
        }
    }

    createNode(){
        var submitObj = {
            node: null,
            areaId:this.area["id"],
            area:this.area
        }
        this.wvSitemapManagerNodeManageEvent.emit(submitObj);
    }

    manageNode(node){
        var submitObj = {
            node: node,
            areaId:this.area["id"],
            area:this.area
        }        
        this.wvSitemapManagerNodeManageEvent.emit(submitObj);
    }

    deleteNode(event,node){
        if(confirm("Are you sure?")){
            this.wvSitemapManagerNodeDeleteEvent.emit(node["id"]);            
        }else{
            event.preventDefault();
        }
    }

      render() {
        let scope = this;
        var areaCmpt = this;
        var areaColor = "#999";
        if(this.area["color"]){
            areaColor = this.area["color"];
        }
        var areaIconClass = "far fa-question-circle";
        if(this.area["icon_class"]){
            areaIconClass = this.area["icon_class"];
        }
        return(
            <div class="sitemap-area mb-3">
                <div class="area-header">
                    <span class={"icon " + areaIconClass} style={{backgroundColor:areaColor}}></span>
                    <div class="label">({this.area["weight"]}) {this.area["label"]}</div>
                    <div class="btn-group btn-group-sm action">
                        <button type="button" class="btn btn-link" onClick={(e) => this.deleteArea(e)}><span class="fa fa-trash-alt go-red"></span> delete</button>
                        <button type="button" class="btn btn-link" onClick={()=> this.manageArea()}><span class="fa fa-cog"></span> config</button>
                    </div>
                 </div>
                 <div class={"area-body " + (this.area["nodes"].length > 0 ? "" : "d-none")}>
                    <button type="button" class="btn btn-white btn-sm" onClick={() => this.createNode()}><span class="fa fa-plus"></span> add area node</button>
                    <table class="table table-bordered table-sm mb-0 sitemap-nodes mt-3">
                        <thead>
                            <tr>
                                <th style={{width:"40px"}}>w.</th>
                                <th style={{width:"40px"}}>icon</th>
                                <th style={{width:"200px"}}>name</th>
                                <th style={{width:"auto"}}>label</th>
                                <th style={{width:"200px"}}>group</th>
                                <th style={{width:"200px"}}>parent</th>
                                <th style={{width:"100px"}}>type</th>
                                <th style={{width:"160px"}}>action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.area["nodes"].map(function(node) { 
                                var typeString = "";          
                                let parentLabel = "";      
                                if(node["parent_id"]){
                                    let parentIndex = _.findIndex(scope.area["nodes"],(o) => o["id"] === node["parent_id"]);
                                    if(parentIndex > -1){
                                        parentLabel = scope.area["nodes"][parentIndex]["label"];
                                    }
                                }
                                switch(node["type"]){
                                    case 1:
                                        typeString = "entity list";   
                                        break;
                                    case 2:
                                        typeString = "application"; 
                                        break;
                                    case 3:
                                        typeString = "url"; 
                                        break;
                                    case 4:
                                        typeString = "site"; 
                                        break;                                                                                                                        
                                    default:
                                        break;
                                }
                                return (
                                <tr>
                                    <td>
                                        {node["weight"]}
                                    </td>
                                    <td>
                                        <span class={"icon " + node["icon_class"]}></span>
                                    </td>
                                    <td>
                                        {node["name"]}
                                    </td>
                                    <td>
                                        {node["label"]}
                                    </td>            
                                    <td>
                                        {node["group_name"]}
                                    </td>                
                                    <td>
                                        {parentLabel}
                                    </td>                                                              
                                    <td>
                                        {typeString}
                                    </td>     
                                    <td>
                                        <div class="btn-group btn-group-sm action">
                                            <button type="button" class="btn btn-link" onClick={(e) => areaCmpt.deleteNode(e,node)}><span class="fa fa-trash-alt go-red"></span> delete</button>
                                            <button type="button" class="btn btn-link" onClick={() => areaCmpt.manageNode(node)}><span class="fa fa-cog"></span> config</button>
                                        </div>                                        
                                    </td>                   
                                </tr>
                                )
                            }
                            )} 
                
                        </tbody>
                    </table>
                 </div>
                 <div class={"area-body " + (this.area["nodes"].length > 0 ? "d-none" : "")}>
                        <button type="button" class="btn btn-white btn-sm" onClick={() => this.createNode()}><span class="fa fa-plus"></span> add area node</button>
                        <div class="alert alert-info mt-3">No nodes in this area.</div>
                 </div>            
            </div>
        )        
      }

  }