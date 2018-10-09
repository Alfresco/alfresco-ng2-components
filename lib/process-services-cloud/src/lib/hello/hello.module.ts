import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelloComponent } from './hello.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [HelloComponent],
  exports: [HelloComponent]
})
export class HelloModule { }
