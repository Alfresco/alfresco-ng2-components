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

import { NgModule } from '@angular/core';
import { CoreModule } from 'ng2-alfresco-core';

import { MaterialModule } from './src/material.module';

export { ViewerComponent } from './src/components/viewer.component';
import { ImgViewerComponent } from './src/components/imgViewer.component';
import { MediaPlayerComponent } from './src/components/mediaPlayer.component';
import { NotSupportedFormatComponent } from './src/components/notSupportedFormat.component';
import { PdfViewerComponent } from './src/components/pdfViewer.component';
import { TxtViewerComponent } from './src/components/txtViewer.component';
import { PdfViewComponent } from './src/components/viewer-dialog/pdf-view/pdf-view.component';
import { ViewerDialogComponent } from './src/components/viewer-dialog/viewer-dialog.component';
import { ViewerComponent } from './src/components/viewer.component';

import { UnknownFormatComponent } from './src/components/unknown-format/unknown-format.component';

import { ExtensionViewerDirective } from './src/directives/extension-viewer.directive';

import { RenderingQueueServices } from './src/services/rendering-queue.services';
import { ViewerService } from './src/services/viewer.service';

export { ViewerDialogComponent } from './src/components/viewer-dialog/viewer-dialog.component';
export { ViewerDialogSettings } from './src/components/viewer-dialog/viewer-dialog.settings';
export { ViewerService } from './src/services/viewer.service';

export const VIEWER_DIRECTIVES: any[] = [
    ViewerComponent,
    ImgViewerComponent,
    TxtViewerComponent,
    MediaPlayerComponent,
    NotSupportedFormatComponent,
    PdfViewerComponent,
    ExtensionViewerDirective,
    ViewerDialogComponent,
    PdfViewComponent
];

@NgModule({
    imports: [
        CoreModule,
        MaterialModule
    ],
    declarations: [
        ...VIEWER_DIRECTIVES,
        UnknownFormatComponent
    ],
    providers: [
        RenderingQueueServices,
        ViewerService
    ],
    exports: [
        MaterialModule,
        ...VIEWER_DIRECTIVES
    ],
    entryComponents: [
        ViewerDialogComponent
    ]
})
export class ViewerModule {}
