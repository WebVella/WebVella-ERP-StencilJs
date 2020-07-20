import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'wv-nps',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
