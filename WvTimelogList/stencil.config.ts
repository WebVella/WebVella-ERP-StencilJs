import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'wv-timelog-list',
  outputTargets:[
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    }
  ],
  
};
