import { Component,Prop,Event, EventEmitter } from '@stencil/core';

@Component({
    tag: 'wv-sitemap-subarea'
  })

  export class WvSitemapSubarea {
    
    @Prop() area: Object;
    @Prop() areasCount: Number;
    @Event() showNextArea: EventEmitter;
    @Event() showPrevArea: EventEmitter;
    @Event() removeActiveArea: EventEmitter;

    showNextAreaHandler(e){
        e.preventDefault();
        this.showNextArea.emit();
    }

    showPrevAreaHandler(e){
        e.preventDefault();
        this.showPrevArea.emit();
    }

    removeActiveAreaHandler(e){
        e.preventDefault();
        this.removeActiveArea.emit();
    }    

    render() {
      /// INIT
      let areaNodes = [...this.area["nodes"]];
      let nodesWithoutGroup = areaNodes.filter(node => !node["group_name"]);
      let nodesWithGroup = areaNodes.filter(node => node["group_name"]);

      //TODO: Nodes that has group name but there is no such group in the area should not exist or it should be a bug

      /// Render nodes without groups

      let renderLrenderNodesWithoutGroupLabel = null;
      if(nodesWithGroup.length > 0){
        renderLrenderNodesWithoutGroupLabel = (
            <div class="group-label" title="other">Other</div>
        )}
      let renderNodesWithoutGroup = null;
      if(nodesWithoutGroup.length > 0){
        renderNodesWithoutGroup = (
            <div class="sitemap-group mb-0">
                {renderLrenderNodesWithoutGroupLabel}
                <div class="nodes">
                    <div class="row">
                        {nodesWithoutGroup.map((node) => (
                            <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                            <wv-sitemap-node node={node}></wv-sitemap-node>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
      }

      /// Render nodes with groups
      let renderNodesWithGroup = null;
      if(nodesWithGroup.length > 0){
        renderNodesWithGroup = (
            <div class="row">
                {this.area["groups"].map((group) => {
                    let groupNodes = nodesWithGroup.filter(node => node["group_name"] === group["name"]);
                    if(groupNodes.length > 0){
                        return (
                        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
                            <div class="sitemap-group">
                                <div class="group-label" title={group["label"]}>{group["label"]}</div>
                                <div class="nodes">
                                    {groupNodes.map((node) => (
                                        <wv-sitemap-node node={node}></wv-sitemap-node>
                                    ))}
                                </div>
                            </div>
                        </div>
                        )
                    }
                })}
            </div>
        );
      }

      /// Render prev next buttons
      let prevNextButtons = null;
      if(this.areasCount > 1) {
        prevNextButtons = ([
                <a onClick={(e) => this.showPrevAreaHandler(e)} class="btn btn-white"><span class="ti-arrow-left"></span> <span class="d-none d-lg-inline">prev</span></a>,                    
                <a onClick={(e) => this.showNextAreaHandler(e)} class="btn btn-white"><span class="ti-arrow-right"></span> <span class="d-none d-lg-inline">next</span></a>        
        ])}


      /// Render component
      return (
        <div class="subarea p-3" style={{borderColor:this.area["color"]}}>
            <a onClick={(e) => this.removeActiveAreaHandler(e)} class="btn btn-sm btn-close"><span class="ti-close"></span></a>
            <div class="header">
                <div class="row no-gutters">
                    <div class="col-9">
                            <div class="title"  style={{color:this.area["color"]}}>
                                <span class="icon"><span class={this.area["icon_class"]}></span></span>
                                <span class="label">{this.area["label"]}</span>
                            </div>
                            <div class="description">{this.area["description"]}</div>
                    </div>
                    <div class="col-3 text-right pr-5">
                        <div class="btn-group btn-group-sm">
                            {prevNextButtons}
                        </div>
                    </div>
                </div>
            </div>
            {renderNodesWithGroup}
            {renderNodesWithoutGroup}            
        </div>
      )
    }
  }
  