/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface WvRecurrenceTemplate {
    'changeTypeOptions': string;
    'endTypeOptions': string;
    'periodTypeOptions': string;
    'recurrenceTemplate': string;
    'templateDefault': string;
    'typeOptions': string;
  }
}

declare global {


  interface HTMLWvRecurrenceTemplateElement extends Components.WvRecurrenceTemplate, HTMLStencilElement {}
  var HTMLWvRecurrenceTemplateElement: {
    prototype: HTMLWvRecurrenceTemplateElement;
    new (): HTMLWvRecurrenceTemplateElement;
  };
  interface HTMLElementTagNameMap {
    'wv-recurrence-template': HTMLWvRecurrenceTemplateElement;
  }
}

declare namespace LocalJSX {
  interface WvRecurrenceTemplate {
    'changeTypeOptions'?: string;
    'endTypeOptions'?: string;
    'periodTypeOptions'?: string;
    'recurrenceTemplate'?: string;
    'templateDefault'?: string;
    'typeOptions'?: string;
  }

  interface IntrinsicElements {
    'wv-recurrence-template': WvRecurrenceTemplate;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'wv-recurrence-template': LocalJSX.WvRecurrenceTemplate & JSXBase.HTMLAttributes<HTMLWvRecurrenceTemplateElement>;
    }
  }
}


