/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ExtensionsModule } from '@alfresco/adf-extensions';

import { MaterialModule } from '../material.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { PipeModule } from '../pipes/pipe.module';
import { ImgViewerComponent } from './components/img-viewer.component';
import { MediaPlayerComponent } from './components/media-player.component';
import { PdfViewerComponent } from './components/pdf-viewer.component';
import { PdfPasswordDialogComponent } from './components/pdf-viewer-password-dialog';
import { PdfThumbComponent } from './components/pdf-viewer-thumb.component';
import { PdfThumbListComponent } from './components/pdf-viewer-thumbnails.component';
import { TxtViewerComponent } from './components/txt-viewer.component';
import { UnknownFormatComponent } from './components/unknown-format/unknown-format.component';
import { ViewerMoreActionsComponent } from './components/viewer-more-actions.component';
import { ViewerOpenWithComponent } from './components/viewer-open-with.component';
import { ViewerSidebarComponent } from './components/viewer-sidebar.component';
import { ViewerToolbarComponent } from './components/viewer-toolbar.component';
import { ViewerComponent } from './components/viewer.component';
import { ViewerExtensionDirective } from './directives/viewer-extension.directive';
import { ViewerToolbarActionsComponent } from './components/viewer-toolbar-actions.component';
import { DirectiveModule } from '../directives/directive.module';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        ToolbarModule,
        PipeModule,
        FlexLayoutModule,
        DirectiveModule,
        A11yModule,
        ExtensionsModule
    ],
    declarations: [
        PdfPasswordDialogComponent,
        ViewerComponent,
        ImgViewerComponent,
        TxtViewerComponent,
        MediaPlayerComponent,
        PdfViewerComponent,
        PdfThumbComponent,
        PdfThumbListComponent,
        ViewerExtensionDirective,
        UnknownFormatComponent,
        ViewerToolbarComponent,
        ViewerSidebarComponent,
        ViewerOpenWithComponent,
        ViewerMoreActionsComponent,
        ViewerToolbarActionsComponent
    ],
    exports: [
        ViewerComponent,
        ImgViewerComponent,
        TxtViewerComponent,
        MediaPlayerComponent,
        PdfViewerComponent,
        PdfPasswordDialogComponent,
        PdfThumbComponent,
        PdfThumbListComponent,
        ViewerExtensionDirective,
        UnknownFormatComponent,
        ViewerToolbarComponent,
        ViewerSidebarComponent,
        ViewerOpenWithComponent,
        ViewerMoreActionsComponent,
        ViewerToolbarActionsComponent
    ]
})
export class ViewerModule {
}
