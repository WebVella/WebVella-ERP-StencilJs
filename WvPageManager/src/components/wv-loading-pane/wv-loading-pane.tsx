import { Component} from '@stencil/core';

@Component({
  tag: 'wv-loading-pane'
})

export class WvLoadingPane {
    render() {
      return (
        <div class="p-2"><i class="fa fa-spin fa-spinner go-blue"></i> Loading...</div>
      );
    }
  }