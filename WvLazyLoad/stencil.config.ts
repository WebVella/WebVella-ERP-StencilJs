import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'wv-lazyload',
  outputTargets:[
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
