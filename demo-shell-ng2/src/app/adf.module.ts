import { NgModule } from '@angular/core';

// ADF modules
import { CoreModule } from 'ng2-alfresco-core';
import { DataTableModule } from 'ng2-alfresco-datatable';
import { ViewerModule } from 'ng2-alfresco-viewer';
import { LoginModule } from 'ng2-alfresco-login';
import { SearchModule } from 'ng2-alfresco-search';
import { UserInfoModule } from 'ng2-alfresco-userinfo';
import { ActivitiTaskListModule } from 'ng2-activiti-tasklist';
import { DiagramsModule } from 'ng2-activiti-diagrams';
import { AnalyticsModule } from 'ng2-activiti-analytics';

import { DocumentListModule, SocialModule, TagModule, UploadModule, WebScriptModule } from '@adf/content-services';
import { FormModule, ProcessListModule } from '@adf/process-services';

export function modules() {
  return [
    // ADF modules
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
    ActivitiTaskListModule,
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
