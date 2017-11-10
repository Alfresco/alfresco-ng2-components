import { NgModule } from '@angular/core';

import {
    DocumentListModule,
    SearchModule,
    SocialModule,
    TagModule,
    UploadModule,
    WebScriptModule
} from '@adf/content-services';

import {
    AnalyticsModule,
    DiagramsModule,
    FormModule,
    ProcessListModule,
    TaskListModule
} from '@adf/process-services';

import {
    CoreModule
} from '@adf/core';

export function modules() {
    return [
        CoreModule,
        DocumentListModule,
        SearchModule,
        SocialModule,
        TagModule,
        UploadModule,
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
export class AdfModule {
}
