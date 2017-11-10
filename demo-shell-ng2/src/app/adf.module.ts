import { NgModule } from '@angular/core';

import { CoreModule } from 'ng2-alfresco-core';
import { DocumentListModule, SearchModule, SocialModule, TagModule, UploadModule, WebScriptModule } from '@adf/content-services';
import { AnalyticsModule, DiagramsModule, FormModule, ProcessListModule, TaskListModule } from '@adf/process-services';
import { DataTableModule, LoginModule, UserInfoModule, ViewerModule  } from '@adf/core';

export function modules() {
  return [
    CoreModule,
    DataTableModule,
    DocumentListModule,
    LoginModule,
    SearchModule,
    SocialModule,
    TagModule,
    UploadModule,
    UserInfoModule,
    ViewerModule,
    WebScriptModule,
    FormModule,
    TaskListModule,
    ProcessListModule,
    DiagramsModule,
    AnalyticsModule
  ];
}

@NgModule({
  imports: modules(),
  exports: modules()
})
export class AdfModule {}
