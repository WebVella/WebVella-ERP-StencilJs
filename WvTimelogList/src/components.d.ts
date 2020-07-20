/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface WvAddTimelog {}
  interface WvTimelog {
    'post': Object;
  }
  interface WvTimelogList {
    'currentUser': string;
    'isBillable': boolean;
    'isDebug': string;
    'records': string;
    'relatedRecords': string;
    'siteRootUrl': string;
  }
}

declare global {


  interface HTMLWvAddTimelogElement extends Components.WvAddTimelog, HTMLStencilElement {}
  var HTMLWvAddTimelogElement: {
    prototype: HTMLWvAddTimelogElement;
    new (): HTMLWvAddTimelogElement;
  };

  interface HTMLWvTimelogElement extends Components.WvTimelog, HTMLStencilElement {}
  var HTMLWvTimelogElement: {
    prototype: HTMLWvTimelogElement;
    new (): HTMLWvTimelogElement;
  };

  interface HTMLWvTimelogListElement extends Components.WvTimelogList, HTMLStencilElement {}
  var HTMLWvTimelogListElement: {
    prototype: HTMLWvTimelogListElement;
    new (): HTMLWvTimelogListElement;
  };
  interface HTMLElementTagNameMap {
    'wv-add-timelog': HTMLWvAddTimelogElement;
    'wv-timelog': HTMLWvTimelogElement;
    'wv-timelog-list': HTMLWvTimelogListElement;
  }
}

declare namespace LocalJSX {
  interface WvAddTimelog {}
  interface WvTimelog {
    'post'?: Object;
  }
  interface WvTimelogList {
    'currentUser'?: string;
    'isBillable'?: boolean;
    'isDebug'?: string;
    'records'?: string;
    'relatedRecords'?: string;
    'siteRootUrl'?: string;
  }

  interface IntrinsicElements {
    'wv-add-timelog': WvAddTimelog;
    'wv-timelog': WvTimelog;
    'wv-timelog-list': WvTimelogList;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'wv-add-timelog': LocalJSX.WvAddTimelog & JSXBase.HTMLAttributes<HTMLWvAddTimelogElement>;
      'wv-timelog': LocalJSX.WvTimelog & JSXBase.HTMLAttributes<HTMLWvTimelogElement>;
      'wv-timelog-list': LocalJSX.WvTimelogList & JSXBase.HTMLAttributes<HTMLWvTimelogListElement>;
    }
  }
}


