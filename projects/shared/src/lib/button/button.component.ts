import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'button[sharedBtn]',
  template: '<ng-content></ng-content>',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {}
