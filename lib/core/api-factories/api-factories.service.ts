import { AboutApi, NodesApi } from '@alfresco/js-api';
import { Injectable } from '@angular/core';

/// <reference types="./api" />

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ApiFactories {
    interface ApiNames {
      about: AboutApi;
      nodes: NodesApi;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApiFactoriesService {
  registry: ApiFactories.ApiNames;

  constructor() {
    this.registry = {
      about: new AboutApi(),
      nodes: new NodesApi()
    };
  }

  get<T extends keyof ApiFactories.ApiNames>(type: T): ApiFactories.ApiNames[T] {
    return this.registry[type] as ApiFactories.ApiNames[T];
  }

}
