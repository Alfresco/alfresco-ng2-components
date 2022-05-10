/// <reference types="./api" />

import { QueriesApi } from '@alfresco/js-api';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ApiFactories {
    interface ApiNames {
      queries: QueriesApi;
    }
  }
}
