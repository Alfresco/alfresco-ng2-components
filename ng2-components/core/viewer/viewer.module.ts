/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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
import { MaterialModule } from '../material.module';
import { TRANSLATION_PROVIDER } from '../services';
import { ToolbarModule } from '../toolbar';

import { PipeModule } from '../pipes';
import { ImgViewerComponent } from './components/imgViewer.component';
import { MediaPlayerComponent } from './components/mediaPlayer.component';
import { PdfViewerComponent } from './components/pdfViewer.component';
import { TxtViewerComponent } from './components/txtViewer.component';
import { UnknownFormatComponent } from './components/unknown-format/unknown-format.component';
import { ViewerMoreActionsComponent } from './components/viewer-more-actions.component';
import { ViewerOpenWithComponent } from './components/viewer-open-with.component';
import { ViewerSidebarComponent } from './components/viewer-sidebar.component';
import { ViewerToolbarComponent } from './components/viewer-toolbar.component';
import { ViewerComponent } from './components/viewer.component';
import { ViewerExtensionDirective } from './directives/viewer-extension.directive';
import { RenderingQueueServices } from './services/rendering-queue.services';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
        ToolbarModule,
        PipeModule
    ],
    declarations: [
        ViewerComponent,
        ImgViewerComponent,
        TxtViewerComponent,
        MediaPlayerComponent,
        PdfViewerComponent,
        ViewerExtensionDirective,
        UnknownFormatComponent,
        ViewerToolbarComponent,
        ViewerSidebarComponent,
        ViewerOpenWithComponent,
        ViewerMoreActionsComponent
    ],
    providers: [
        RenderingQueueServices,
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'ng2-alfresco-viewer',
                source: 'assets/ng2-alfresco-viewer'
            }
        }
    ],
    exports: [
        ViewerComponent,
        ImgViewerComponent,
        TxtViewerComponent,
        MediaPlayerComponent,
        PdfViewerComponent,
        ViewerExtensionDirective,
        UnknownFormatComponent,
        ViewerToolbarComponent,
        ViewerSidebarComponent,
        ViewerOpenWithComponent,
        ViewerMoreActionsComponent
    ]
})
export class ViewerModule {
}
