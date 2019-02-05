import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'wv-recurrence-template',
  outputTargets:[
    { type: 'dist' },
    { type: 'docs' },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ],
  nodeResolve: {
    browser: true
  }    
};
