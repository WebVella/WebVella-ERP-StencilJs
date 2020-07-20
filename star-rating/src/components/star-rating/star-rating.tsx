import { Component, Prop,State, h } from '@stencil/core';

@Component({
  tag: 'star-rating'
})
export class StarRating {
  @Prop() rating: number = 0;
  @Prop() maxValue: number = 5;
  @Prop() onClass: string = 'fas fa-star';  
  @Prop() offClass: string = 'far fa-star';  
  @Prop() hoverClass: string = '';  
  @Prop() name: string = 'name';  
  @Prop() titleCsv: string = '';  

  @State() currentRating: number = 0;
  @State() hoverRating: number = 0;
  @State() starCounter: Array<boolean> = new Array<boolean>();
  @State() titleArray: Array<string> = new Array<string>();


  componentWillLoad() {
    this.firstRun();
  }

  firstRun() {
    let scope = this;
    scope.currentRating = scope.rating;
    scope.starCounter = new Array<boolean>(scope.maxValue).fill(true);
    if(scope.titleCsv && scope.titleCsv !== ''){
      scope.titleArray = scope.titleCsv.split(",");
    }
  }

  iconName(starNumber: number): string {
    let scope = this;
    let iconClass= "";
    const threshold = scope.currentRating - starNumber;
    
    if (threshold >= 0) 
    { 
      iconClass =  scope.onClass;
    }
    else { 
      iconClass = scope.offClass;
    };
    if(scope.hoverRating > 0){
      const threshold2 = scope.hoverRating - starNumber;
      if (threshold2 >= 0) 
      { 
        iconClass = scope.hoverClass;
      }
    }
    return iconClass;
  }   

  updateRating(rating: number) {
    this.currentRating = rating;
  }

  updateHoverRating(rating: number) {
    this.hoverRating = rating;
  }

  getTitle(index: number) {
    let scope = this;
    if(scope.titleArray.length >= (index+1)){
      return scope.titleArray[index];
    }
    else{
      return "";
    }
  }  

  render() {
    let scope = this;
    return (
      <span class="rating">
        {
          scope.starCounter.map(function(_,currentIndex) {
              return(
                <i title={"" + scope.getTitle(currentIndex)}
                  key={"star-" + currentIndex} class={scope.iconName(currentIndex + 1) + " "}
                  onClick={(_) => scope.updateRating(currentIndex + 1)} style={{cursor:"pointer"}}
                  onMouseEnter={(_) => scope.updateHoverRating(currentIndex + 1)} onMouseLeave={(_) => scope.updateHoverRating(0)}></i>
              )
          })
        }
        <input type="hidden" name={scope.name} value={scope.currentRating}></input>
      </span>
    );
  }
}
