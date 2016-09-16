
import {describe, expect, it, inject} from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { UserInfoComponent } from '../src/userinfo.component';

describe('Basic Example test ng2-alfresco-userinfo', () => {
  it('Test hello world', inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
    return tcb
      .createAsync(UserInfoComponent)
      .then((fixture) => {
        let element = fixture.nativeElement;
        expect(element.querySelector('h1')).toBeDefined();
        expect(element.getElementsByTagName('h1')[0].innerHTML).toEqual('Hello World Angular 2 ng2-alfresco-userinfo');
      });
  }));
});
