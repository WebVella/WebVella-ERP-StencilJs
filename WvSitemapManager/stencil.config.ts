import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'wv-sitemap-manager',
  outputTargets:[
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};
