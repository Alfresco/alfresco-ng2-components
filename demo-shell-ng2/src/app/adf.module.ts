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
    PipeModule,
    DirectiveModule,
    CardViewModule,
    CollapsableModule,
    ContextMenuModule,
    InfoDrawerModule,
    LanguageMenuModule,
    LoginModule,
    PaginationModule,
    HostSettingsModule,
    ToolbarModule,
    DialogModule,
    DataTableModule,
    UserInfoModule,
    ViewerModule,
    DataColumnModule
} from '@adf/core';

import { AlfrescoSettingsService, PageTitleService, StorageService, TranslateLoaderService, TranslationService, LogService, UserPreferencesService } from '@adf/core';

export function modules() {
    return [
        PipeModule,
        DirectiveModule,
        DataColumnModule,
        CardViewModule,
        CollapsableModule,
        ContextMenuModule,
        InfoDrawerModule,
        LanguageMenuModule,
        PaginationModule,
        HostSettingsModule,
        ToolbarModule,
        ViewerModule,
        DialogModule,
        DataTableModule,
        LoginModule,
        UserInfoModule,
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
    exports: modules(),
    providers: [
        AlfrescoSettingsService,
        PageTitleService,
        StorageService,
        TranslateLoaderService,
        TranslationService,
        LogService,
        UserPreferencesService
    ]
})
export class AdfModule {
}
