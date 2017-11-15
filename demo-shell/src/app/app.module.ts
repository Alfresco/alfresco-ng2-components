import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { Editor3DModule } from 'ng2-3d-editor';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

import { AppConfigService, TRANSLATION_PROVIDER } from '@alfresco/core';
import { AppComponent } from './app.component';
import { AdfModule } from './adf.module';
import { MaterialModule } from './material.module';
import { LoginComponent } from './components/login/login.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { HomeComponent } from './components/home/home.component';
import { SearchBarComponent } from './components/search/search-bar.component';
import { SearchResultComponent } from './components/search/search-result.component';
import { AboutComponent } from './components/about/about.component';
import { FormComponent } from './components/form/form.component';
import { FormListComponent } from './components/form/form-list.component';
import { CustomSourcesComponent } from './components/files/custom-sources.component';

import { ActivitiComponent } from './components/activiti/activiti.component';
import { ActivitiTaskAttachmentsComponent } from './components/activiti/activiti-task-attachments.component';
import { ActivitiProcessAttachmentsComponent } from './components/activiti/activiti-process-attachments.component';
import { ActivitiShowDiagramComponent } from './components/activiti/activiti-show-diagram.component';
import { FormViewerComponent } from './components/activiti/form-viewer.component';
import { FormNodeViewerComponent } from './components/activiti/form-node-viewer.component';
import { ActivitiAppsViewComponent } from './components/activiti/apps-view.component';
import { DataTableComponent } from './components/datatable/datatable.component';
import { FilesComponent } from './components/files/files.component';
import { FileViewComponent } from './components/file-view/file-view.component';
import { WebscriptComponent } from './components/webscript/webscript.component';
import { TagComponent } from './components/tag/tag.component';
import { SocialComponent } from './components/social/social.component';
import { VersionManagerDialogAdapterComponent } from './components/files/version-manager-dialog-adapter.component';

import { ThemePickerModule } from './components/theme-picker/theme-picker';
import { DebugAppConfigService } from './services/debug-app-config.service';

import { routing } from './app.routes';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        ReactiveFormsModule,
        TranslateModule,
        BrowserModule,
        routing,
        FormsModule,
        AdfModule,
        MaterialModule,
        ThemePickerModule,
        FlexLayoutModule,
        //Editor3DModule,
        ChartsModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        SettingsComponent,
        AppLayoutComponent,
        HomeComponent,
        SearchBarComponent,
        SearchResultComponent,
        AboutComponent,
        ActivitiComponent,
        ActivitiTaskAttachmentsComponent,
        ActivitiProcessAttachmentsComponent,
        ActivitiShowDiagramComponent,
        FormViewerComponent,
        FormNodeViewerComponent,
        ActivitiAppsViewComponent,
        DataTableComponent,
        FilesComponent,
        FileViewComponent,
        FormComponent,
        FormListComponent,
        WebscriptComponent,
        TagComponent,
        SocialComponent,
        CustomSourcesComponent,
        VersionManagerDialogAdapterComponent
    ],
    providers: [
        TranslateService,
        { provide: AppConfigService, useClass: DebugAppConfigService },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'resources'
            }
        }
    ],
    entryComponents: [
        VersionManagerDialogAdapterComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
