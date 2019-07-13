import { Component, Prop,State, Listen, Method } from '@stencil/core';

@Component({
    tag: 'wv-sitemap-explorer'
  })

  export class WvSitemapExplorer {

    @Prop() sitemap: string;
    @State() activeArea: Object;
    @State() sitemapObj: Object;
    @State() isVisible: Boolean;

    componentWillLoad() {
      this.sitemapObj = null;
      if(this.sitemap){
        this.sitemapObj = JSON.parse(this.sitemap);
      }
      this.activeArea = null;
      this.isVisible = false;
    }


    @Method()
    show() {
      this.isVisible = true;
    }

    @Method()
    hide() {
      this.isVisible = false;
      this.activeArea = null;
    }


    @Listen("showPrevArea")
    showPrevAreaHandler(){
      if(this.activeArea && this.sitemapObj["areas"].length > 1){
        let currentAreaIndex = this.sitemapObj["areas"].findIndex(area => area["name"] == this.activeArea["name"]);
        //if !exitst
        if(currentAreaIndex === -1){
          console.error("Trying to switch to area that is not found in the current sitemap areas array");
        }
        //if first - show last
        if(currentAreaIndex === 0){
            this.activeArea = {...this.sitemapObj["areas"][this.sitemapObj["areas"].length - 1]}
        }
        else{
          this.activeArea = {...this.sitemapObj["areas"][currentAreaIndex - 1]}
        }
      }
    }

    @Listen("showNextArea")
    showNextAreaHandler(){
      if(this.activeArea && this.sitemapObj["areas"].length > 1){
        let currentAreaIndex = this.sitemapObj["areas"].findIndex(area => area["name"] == this.activeArea["name"]);
        //if !exitst
        if(currentAreaIndex === -1){
          console.error("Trying to switch to area that is not found in the current sitemap areas array");
        }
        //if last - show first
        if(currentAreaIndex + 1 === this.sitemapObj["areas"].length){
            this.activeArea = {...this.sitemapObj["areas"][0]}
        }
        else{
          this.activeArea = {...this.sitemapObj["areas"][currentAreaIndex+1]}
        }
      }
    }

    @Listen("removeActiveArea")
    removeActiveAreaHandler(){
      this.activeArea = null;
    }

    @Listen("setActiveArea")
    setActiveAreaHandler(event: CustomEvent){
      // console.log("set area event dispatched ");
      // console.log(event.detail);
      if(event.detail){
        this.activeArea = {...event.detail};
      }
    }    


    render() {
     if(this.isVisible && this.sitemapObj){
      if(!this.activeArea){
        return (
          <div class="wv-sitemap-explorer pt-3 pb-3 pl-2 pr-2">
            <wv-sitemap-area sitemap={this.sitemapObj}></wv-sitemap-area>
          </div>
        );
      }
      else{
        return(
          <div class="wv-sitemap-explorer pt-3 pb-3 pl-2 pr-2">
            <wv-sitemap-subarea area={this.activeArea} areasCount={this.sitemapObj["areas"].length}></wv-sitemap-subarea>
          </div>
        )
      }
    }
    else{
      return null
    }
  }
}
  