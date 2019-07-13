import { Component,Prop, State, h } from '@stencil/core';
import RecurrenceTemplate from '../../models/RecurrenceTemplate';
import SelectOption from '../../models/SelectOption';

@Component({
  tag: 'wv-recurrence-template'
})

export class WvDatasourceManage {
  @Prop() recurrenceTemplate: string = null;
  @Prop() templateDefault: string = null;
  @Prop() typeOptions: string = null;
  @Prop() endTypeOptions: string = null;
  @Prop() periodTypeOptions: string = null;
  @Prop() changeTypeOptions: string = null;
  @State() recurrence: RecurrenceTemplate = new RecurrenceTemplate();
  @State() typeSelectOptions: Array<Object> = new Array<Object>();
  @State() endTypeSelectOptions: Array<Object> = new Array<Object>();
  @State() periodTypeSelectOptions: Array<Object> = new Array<Object>();
  @State() changeTypeSelectOptions: Array<Object> = new Array<Object>();
  @State() hiddenValue: string = null;
  @State() initialType: number = 0;
  
  componentWillLoad() {
      if(this.recurrenceTemplate){
        this.recurrence = JSON.parse(this.recurrenceTemplate);
      }
      else{
        this.recurrence = JSON.parse(this.templateDefault);
      }
      this.typeSelectOptions = JSON.parse(this.typeOptions);
      this.endTypeSelectOptions = JSON.parse(this.endTypeOptions);
      this.periodTypeSelectOptions = JSON.parse(this.periodTypeOptions);
      this.changeTypeSelectOptions = JSON.parse(this.changeTypeOptions);
      this.initialType = this.recurrence.type;
      
      //Test values follow
      // this.initialType = 1;
      // this.recurrence.type = 7;
      // this.recurrence.repeat_period_type = 4;
      //End test values

      this.hiddenValue = JSON.stringify(this.recurrence);


  }

  valueChangeHandler(ev,fieldName,dataType){
    let scope = this;
    var inputValue = ev.target.value;
    switch(dataType){
      case "number":
      case "int":
        scope.recurrence[fieldName] = parseInt(inputValue);
        break;
      case "date":
        scope.recurrence[fieldName] = inputValue;
        break;        
      case "bool":
        if(ev.target.checked){
          scope.recurrence[fieldName] = true;
        }
        else{
          scope.recurrence[fieldName] = false;
        }
        break;             
      case "string":
        scope.recurrence[fieldName] = inputValue;
        break;
      default:
        break;
    }

    scope.hiddenValue = JSON.stringify(scope.recurrence);

  }

 
  render() {
      let scope = this;
      return (
        <div>
          <input type="hidden" value={scope.hiddenValue} name="recurrence_template"/>

          <div class="form-group erp-field label-horizontal row no-gutters form">
            <label class="col-12 col-sm-auto col-form-label label-horizontal pr-0 pr-sm-2">Repeat:</label>
            <div class="col">
              <select class="form-control form-control-sm" onChange={(e)=> scope.valueChangeHandler(e,"type","int")}>
                {
                  scope.typeSelectOptions.map(function(option: SelectOption,index){
                    return(
                      <option key={index} value={option.value} selected={option.value == scope.recurrence.type.toString()}>{option.label}</option>
                    );
                  })
                }
              </select>
            </div>
          </div>

          <div class={"mt-3 " + (scope.recurrence.type === 7 ? "" : "d-none" )}>
                <hr class="divider mt-2 mb-2"/>
                  <div class="form-group erp-field label-horizontal row no-gutters form">
                    <label class="col-12 col-sm-auto col-form-label label-horizontal pr-0 pr-sm-2">Repeat every:</label>
                    <div class="col">
                      <div class="input-group">
                        <input class="form-control flex-grow-0" style={{"width":"80px"}} value={scope.recurrence.interval}  onChange={(e)=> scope.valueChangeHandler(e,"interval","int")}></input>
                        <span class="input-group-prepend input-group-append" ><span class="input-group-text p-0" style={{"width":"5px"}}></span></span>
                        <select class="form-control form-control-sm  flex-grow-0" style={{"width":"100px"}} onChange={(e)=> scope.valueChangeHandler(e,"repeat_period_type","int")}>
                          {
                            scope.periodTypeSelectOptions.map(function(option: SelectOption,index){
                              return(
                                <option key={index} value={option.value} selected={option.value == scope.recurrence.repeat_period_type.toString()}>{option.label}</option>
                              );
                            })
                          }
                        </select>
                      </div>
                    </div>
                  </div>                

                  <div class={"form-group erp-field label-horizontal row no-gutters form mt-3 " + (scope.recurrence.repeat_period_type === 4 ? "" : "d-none")}>
                    <label class="col-12 col-sm-auto col-form-label label-horizontal pr-0 pr-sm-2"></label>
                    <div class="col">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="Monday" value="true" checked={scope.recurrence.allow_monday} onChange={(e)=> scope.valueChangeHandler(e,"allow_monday","bool")}/>
                        <label class="form-check-label" htmlFor="Monday">Monday</label>
                      </div>  
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="Tuesday" value="true" checked={scope.recurrence.allow_tuesday} onChange={(e)=> scope.valueChangeHandler(e,"allow_tuesday","bool")}/>
                        <label class="form-check-label" htmlFor="Tuesday">Tuesday</label>
                      </div>   
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="Wednesday" value="true" checked={scope.recurrence.allow_wednesday} onChange={(e)=> scope.valueChangeHandler(e,"allow_wednesday","bool")}/>
                        <label class="form-check-label" htmlFor="Wednesday">Wednesday</label>
                      </div>   
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="Thursday" value="true" checked={scope.recurrence.allow_thursday} onChange={(e)=> scope.valueChangeHandler(e,"allow_thursday","bool")}/>
                        <label class="form-check-label" htmlFor="Thursday">Thursday</label>
                      </div>   
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="Friday" value="true" checked={scope.recurrence.allow_friday} onChange={(e)=> scope.valueChangeHandler(e,"allow_friday","bool")}/>
                        <label class="form-check-label" htmlFor="Friday">Friday</label>
                      </div>   
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="Saturday" value="true" checked={scope.recurrence.allow_saturday} onChange={(e)=> scope.valueChangeHandler(e,"allow_saturday","bool")}/>
                        <label class="form-check-label" htmlFor="Saturday">Saturday</label>
                      </div>   
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="Sunday" value="true" checked={scope.recurrence.allow_sunday} onChange={(e)=> scope.valueChangeHandler(e,"allow_sunday","bool")}/>
                        <label class="form-check-label" htmlFor="Sunday">Sunday</label>
                      </div>                                                                                                                                      
                    </div>                  
                  </div>                  
                  <div class={"form-group erp-field label-horizontal row no-gutters form mt-3 " + (scope.recurrence.repeat_period_type === 5 ? "" : "d-none")}>
                    <label class="col-12 col-sm-auto col-form-label label-horizontal pr-0 pr-sm-2"></label>
                    <div class="col">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="monthPeriodOptions" id="sameDate" value="0" checked={scope.recurrence.repeat_month_type === 0} onChange={(e)=> scope.valueChangeHandler(e,"repeat_month_type","int")}/>
                        <label class="form-check-label" htmlFor="sameDate">same date</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="monthPeriodOptions" id="sameWeekDay" value="1" checked={scope.recurrence.repeat_month_type === 1} onChange={(e)=> scope.valueChangeHandler(e,"repeat_month_type","int")}/>
                        <label class="form-check-label" htmlFor="sameWeekDay">same week day</label>
                      </div>
                    </div>
                  </div>


                <hr class="divider mt-2 mb-2"/>
          </div>
              
          <div class={"mt-3 " + (scope.initialType === 0 ? "d-none" : "" )}>
            <div class="form-group erp-field label-horizontal row no-gutters form">
              <label class="col-12 col-sm-auto col-form-label label-horizontal pr-0 pr-sm-2">Apply to:</label>
              <div class="col">
                <select class="form-control form-control-sm" onChange={(e)=> scope.valueChangeHandler(e,"recurrence_change_type","int")}>
                  {
                    scope.changeTypeSelectOptions.map(function(option: SelectOption,index){
                      return(
                        <option key={index} value={option.value} selected={option.value == scope.recurrence.recurrence_change_type.toString()}>{option.label}</option>
                      );
                    })
                  }
                </select>
              </div>
            </div>                
          </div>

        </div>
      );
   
  }
}
