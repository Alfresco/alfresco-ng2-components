import { NgModule } from '@angular/core';

// ADF modules
import { ContentModule } from '@alfresco/adf-content-services';
import { ProcessModule } from '@alfresco/adf-process-services';
import { CoreModule } from '@alfresco/adf-core';

export function modules() {
  return [
      CoreModule,
      ContentModule,
      ProcessModule
  ];
}

@NgModule({
  imports: modules(),
  exports: modules()
})
export class AdfModule {}
