import { NgModule } from '@angular/core';

// ADF modules
import { ContentModule } from '@alfresco/adf-content-services';
import { ProcessModule } from '@alfresco/adf-process-services';
import { ProcessCloudModule } from '@alfresco/adf-process-services-cloud';
import { CoreModule } from '@alfresco/adf-core';

export function modules() {
  return [
      CoreModule,
      ContentModule,
      ProcessModule,
      ProcessCloudModule
  ];
}

@NgModule({
  imports: modules(),
  exports: modules()
})
export class AdfModule {}
