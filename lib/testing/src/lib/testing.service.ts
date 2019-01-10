import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  constructor() { }

  print() {
      /* tslint:disable */
      console.log('it works');
  }
}
