import { Component,Prop } from '@stencil/core';

@Component({
    tag: 'wv-sitemap-node'
  })

  export class WvSitemapNode {
    
    @Prop() node: Object;
   
    render() {
      return (
              <div class="nav-node shadow-sm shadow-hover" title={this.node["label"]}>
                  <span class="icon"><span class={this.node["icon_class"]}></span></span>
                  <span class="label">{this.node["label"]}</span>
                  <a href={this.node["url"]}><em></em></a>
              </div>
      )
    }
  }
  