import { Component, Prop,State, h } from '@stencil/core';

@Component({
  tag: 'wv-nps'
})
export class Nps {
  @Prop() rating: number = 0;
  @Prop() name: string = 'name';  
  @Prop() class: string = '';  

  @State() currentRating: number = 0;
  @State() hoverRating: number = 0;
  @State() starCounter: Array<boolean> = new Array<boolean>();

  componentWillLoad() {
    this.firstRun();
  }


  firstRun() {
    let scope = this;
    scope.currentRating = scope.rating;
    scope.starCounter = new Array<boolean>(10).fill(true);
  }

  btnClass(btnNumber: number): string {
    let scope = this;
    let iconClass= "";
    
    if(scope.hoverRating !== btnNumber){
      if (btnNumber == scope.currentRating) 
      { 
        iconClass =  "btn-block btn btn-sm btn-outline-orange go-white go-bkg-orange";
      }
      else { 
        iconClass = "btn btn-sm btn-outline-secondary";
      };
    }
    else{
        iconClass =  "btn btn-sm btn-outline-purple";
    }
    return iconClass;
  }   


  updateRating(rating: number) {
    this.currentRating = rating;
  }

  updateHoverRating(rating: number) {
    this.hoverRating = rating;
  }
 

  render() {
    let scope = this;
    return [
      <table class={"table table-sm table-borderless table-nps " + scope.class}>
        <tbody>
          <tr class="description">
            <td colSpan={2} class="pl-0">Not likely at all</td>
            <td colSpan={6}></td>
            <td colSpan={2} style={{textAlign:"right"}} class="pr-0">Extremely likely</td>
          </tr>
          <tr class="actions">
              {
                scope.starCounter.map(function(_,currentIndex) {
                  return(
                    <td class={ (currentIndex !== 0 ? "pl-2":"pl-0") + " " + (currentIndex !== 9 ? "pr-2":"pl-0")} style={{width:"10%",cursor:"pointer"}} key={"star-" + currentIndex}>
                      <button class={"btn-block " + scope.btnClass(currentIndex + 1)} onClick={(_) => scope.updateRating(currentIndex + 1)} 
                       onMouseEnter={(_) => scope.updateHoverRating(currentIndex + 1)} onMouseLeave={(_) => scope.updateHoverRating(0)} >{currentIndex + 1}</button>
                    </td>
                  )
                })
              }
          </tr>
        </tbody>
      </table>,
      <input type="hidden" name={scope.name} value={scope.currentRating}></input>      
      ];
  }
}
