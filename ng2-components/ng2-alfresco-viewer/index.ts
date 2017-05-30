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

/**
 * ng2-alfresco-viewer, provide components to view files.
 *
 * Components provided:
 *           <alfresco-viewer [urlFile]="'localTestFile.pdf'">
 *              <div class="mdl-spinner mdl-js-spinner is-active"></div>
 *          </alfresco-viewer>
 */

import { NgModule, ModuleWithProviders } from '@angular/core';
import { CoreModule } from 'ng2-alfresco-core';

import { ViewerComponent } from './src/components/viewer.component';
import { RenderingQueueServices } from './src/services/rendering-queue.services';
import { ImgViewerComponent } from './src/components/imgViewer.component';
import { MediaPlayerComponent } from './src/components/mediaPlayer.component';
import { NotSupportedFormat } from './src/components/notSupportedFormat.component';
import { PdfViewerComponent } from './src/components/pdfViewer.component';
import { TxtViewerComponent } from './src/components/txtViewer.component';
import { ExtensionViewerDirective } from './src/directives/extension-viewer.directive';

export * from './src/components/viewer.component';
export * from './src/services/rendering-queue.services';
export * from './src/components/imgViewer.component';
export * from './src/components/mediaPlayer.component';
export * from './src/components/notSupportedFormat.component';
export * from './src/components/pdfViewer.component';
export * from './src/components/txtViewer.component';

export const VIEWER_DIRECTIVES: any[] = [
    ViewerComponent,
    ImgViewerComponent,
    TxtViewerComponent,
    MediaPlayerComponent,
    NotSupportedFormat,
    PdfViewerComponent,
    ExtensionViewerDirective
];

export const VIEWER_PROVIDERS: any[] = [
    RenderingQueueServices
];

@NgModule({
    imports: [
        CoreModule
    ],
    declarations: [
        ...VIEWER_DIRECTIVES
    ],
    providers: [
        ...VIEWER_PROVIDERS
    ],
    exports: [
        ...VIEWER_DIRECTIVES
    ]
})
export class ViewerModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ViewerModule,
            providers: [
                ...VIEWER_PROVIDERS
            ]
        };
    }
}
