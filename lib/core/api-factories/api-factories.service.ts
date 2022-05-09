import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiFactoriesService {

  constructor() { }

  get(_apiName: string) {
      return {};
  }
}
