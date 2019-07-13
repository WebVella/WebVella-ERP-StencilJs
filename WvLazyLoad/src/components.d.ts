/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface WvLazyload {
    'componentName': string;
    'entityId': string;
    'nodeId': string;
    'nodeOptions': string;
    'pageId': string;
    'recordId': string;
    'siteRootUrl': string;
  }
}

declare global {


  interface HTMLWvLazyloadElement extends Components.WvLazyload, HTMLStencilElement {}
  var HTMLWvLazyloadElement: {
    prototype: HTMLWvLazyloadElement;
    new (): HTMLWvLazyloadElement;
  };
  interface HTMLElementTagNameMap {
    'wv-lazyload': HTMLWvLazyloadElement;
  }
}

declare namespace LocalJSX {
  interface WvLazyload extends JSXBase.HTMLAttributes<HTMLWvLazyloadElement> {
    'componentName'?: string;
    'entityId'?: string;
    'nodeId'?: string;
    'nodeOptions'?: string;
    'pageId'?: string;
    'recordId'?: string;
    'siteRootUrl'?: string;
  }

  interface IntrinsicElements {
    'wv-lazyload': WvLazyload;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


