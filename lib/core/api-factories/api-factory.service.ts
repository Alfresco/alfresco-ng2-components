import { Inject, Injectable } from '@angular/core';
import { ApiClientFactory, API_CLIENT_FACTORY_TOKEN } from '../api/api-client.factory';
import { Constructor, Dictionary } from '../api/types';

@Injectable({
  providedIn: 'root'
})
export class ApiFactoryService {

    private instances: Dictionary<any> = {};

    constructor(@Inject(API_CLIENT_FACTORY_TOKEN) private apiCreateFactory: ApiClientFactory) { }

    get<T>(apiClass: Constructor<T>): T {
        return  this.instances[apiClass.name] as T ?? this.instantiateApi(apiClass);
    }

    private instantiateApi<T>(apiClass: Constructor<T>): T {
        console.log(`%c DEBUG:IM HERE -> init ${apiClass.name}`, 'color: orange');
        this.instances[apiClass.name] = this.apiCreateFactory.create(apiClass);
        return this.instances[apiClass.name];
    };

}
