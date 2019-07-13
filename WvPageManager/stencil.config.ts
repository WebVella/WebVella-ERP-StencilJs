import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'wv-pb-manager',
  outputTargets:[
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
