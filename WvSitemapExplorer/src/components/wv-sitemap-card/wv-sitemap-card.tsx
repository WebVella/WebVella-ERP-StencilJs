import { Component,Prop,Event, EventEmitter } from '@stencil/core';

@Component({
    tag: 'wv-sitemap-card'
  })

  export class WvSitemapCard {
    
    @Prop() area: Object;
    @Event() setActiveArea: EventEmitter;

    setActiveAreaHandler(e){
      let scope = this;
      e.preventDefault();
      scope.setActiveArea.emit(scope.area);
  }    

    render() {
      return (
              <div class="sitemap-card shadow-sm shadow-hover" onClick={(e) => this.setActiveAreaHandler(e)}>
                <div class="icon"><span class={this.area["icon_class"]}></span></div>
                <div class="label">{this.area["label"]}</div>
                <hr style={{borderColor:this.area["color"]}}/>
                <div class="description">{this.area["description"]}</div>
                <div class="state-icon">
                  <span class="ti-plus"></span>
                </div>
              </div>
      )
    }
  }
  