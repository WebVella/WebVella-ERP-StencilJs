/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface WvAddPost {}
  interface WvComment {
    'comment': Object;
  }
  interface WvPost {
    'post': Object;
  }
  interface WvPostList {
    'currentUser': string;
    'isDebug': string;
    'posts': string;
    'relatedRecordId': string;
    'relatedRecords': string;
    'siteRootUrl': string;
  }
}

declare global {


  interface HTMLWvAddPostElement extends Components.WvAddPost, HTMLStencilElement {}
  var HTMLWvAddPostElement: {
    prototype: HTMLWvAddPostElement;
    new (): HTMLWvAddPostElement;
  };

  interface HTMLWvCommentElement extends Components.WvComment, HTMLStencilElement {}
  var HTMLWvCommentElement: {
    prototype: HTMLWvCommentElement;
    new (): HTMLWvCommentElement;
  };

  interface HTMLWvPostElement extends Components.WvPost, HTMLStencilElement {}
  var HTMLWvPostElement: {
    prototype: HTMLWvPostElement;
    new (): HTMLWvPostElement;
  };

  interface HTMLWvPostListElement extends Components.WvPostList, HTMLStencilElement {}
  var HTMLWvPostListElement: {
    prototype: HTMLWvPostListElement;
    new (): HTMLWvPostListElement;
  };
  interface HTMLElementTagNameMap {
    'wv-add-post': HTMLWvAddPostElement;
    'wv-comment': HTMLWvCommentElement;
    'wv-post': HTMLWvPostElement;
    'wv-post-list': HTMLWvPostListElement;
  }
}

declare namespace LocalJSX {
  interface WvAddPost {}
  interface WvComment {
    'comment'?: Object;
  }
  interface WvPost {
    'post'?: Object;
  }
  interface WvPostList {
    'currentUser'?: string;
    'isDebug'?: string;
    'posts'?: string;
    'relatedRecordId'?: string;
    'relatedRecords'?: string;
    'siteRootUrl'?: string;
  }

  interface IntrinsicElements {
    'wv-add-post': WvAddPost;
    'wv-comment': WvComment;
    'wv-post': WvPost;
    'wv-post-list': WvPostList;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'wv-add-post': LocalJSX.WvAddPost & JSXBase.HTMLAttributes<HTMLWvAddPostElement>;
      'wv-comment': LocalJSX.WvComment & JSXBase.HTMLAttributes<HTMLWvCommentElement>;
      'wv-post': LocalJSX.WvPost & JSXBase.HTMLAttributes<HTMLWvPostElement>;
      'wv-post-list': LocalJSX.WvPostList & JSXBase.HTMLAttributes<HTMLWvPostListElement>;
    }
  }
}


