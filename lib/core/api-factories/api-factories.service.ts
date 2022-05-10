import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiFactoriesService {
  registry: ApiFactories.ApiNames;

  get<T extends keyof ApiFactories.ApiNames>(apiName: T): ApiFactories.ApiNames[T] {
    return this.registry[apiName] as ApiFactories.ApiNames[T];
  }

}
