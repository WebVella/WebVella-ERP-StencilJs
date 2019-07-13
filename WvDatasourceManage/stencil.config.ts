import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'wv-datasource-manage',
  enableCache:false,
  hashFileNames:false,
  outputTargets:[
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
