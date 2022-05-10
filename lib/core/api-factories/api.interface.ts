/// <reference types="./api" />

import { AboutApi, NodesApi } from '@alfresco/js-api';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ApiFactories {
    interface ApiNames {
      about: AboutApi;
      nodes: NodesApi;
    }
  }
}
