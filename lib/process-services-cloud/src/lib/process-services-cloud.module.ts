import { NgModule } from '@angular/core';
import { HelloModule } from './hello/hello.module';

@NgModule({
  imports: [
    HelloModule
  ],
  declarations: [],
  exports: [HelloModule]
})
export class ProcessServicesCloudModule { }
