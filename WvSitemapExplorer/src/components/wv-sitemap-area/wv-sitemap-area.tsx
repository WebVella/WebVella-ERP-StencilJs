import { Component,Prop } from '@stencil/core';

@Component({
    tag: 'wv-sitemap-area'
  })

  export class WvSitemapArea {
    
    @Prop() sitemap: Object;

   
    render() {

      if(this.sitemap["areas"].length > 0){
        return (
          <div class="row no-gutters">
            {this.sitemap["areas"].map((area) => (
              <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 p-2">
                <wv-sitemap-card area={area}></wv-sitemap-card>
              </div>
            ))}
          </div>
        )
      }
      else{
        return(
          <div class="alert alert-info">This sitemap does not have any areas</div>
        )
      }
    }
  }
  