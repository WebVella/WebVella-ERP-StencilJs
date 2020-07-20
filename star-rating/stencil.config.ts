import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'star-rating',
  outputTargets: [
    {
      type: 'www',
      serviceWorker: null // disable service workers
    }
  ]
};
