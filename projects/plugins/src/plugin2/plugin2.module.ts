import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Plugin2Component } from './plugin2.component';
import { SharedModule } from 'shared';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [Plugin2Component],
  entryComponents: [Plugin2Component]
})
export class Plugin2Module {
  static entry = Plugin2Component;
}
