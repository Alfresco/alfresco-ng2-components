/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { DownloadPromptDialogComponent } from './components/download-prompt-dialog/download-prompt-dialog.component';
import { ImgViewerComponent } from './components/img-viewer/img-viewer.component';
import { MediaPlayerComponent } from './components/media-player/media-player.component';
import { PdfPasswordDialogComponent } from './components/pdf-viewer-password-dialog/pdf-viewer-password-dialog';
import { PdfThumbComponent } from './components/pdf-viewer-thumb/pdf-viewer-thumb.component';
import { PdfThumbListComponent } from './components/pdf-viewer-thumbnails/pdf-viewer-thumbnails.component';
import { PdfViewerComponent } from './components/pdf-viewer/pdf-viewer.component';
import { TxtViewerComponent } from './components/txt-viewer/txt-viewer.component';
import { UnknownFormatComponent } from './components/unknown-format/unknown-format.component';
import { ViewerMoreActionsComponent } from './components/viewer-more-actions.component';
import { ViewerOpenWithComponent } from './components/viewer-open-with.component';
import { ViewerRenderComponent } from './components/viewer-render/viewer-render.component';
import { ViewerSidebarComponent } from './components/viewer-sidebar.component';
import { ViewerToolbarActionsComponent } from './components/viewer-toolbar-actions.component';
import { ViewerToolbarCustomActionsComponent } from './components/viewer-toolbar-custom-actions.component';
import { ViewerToolbarComponent } from './components/viewer-toolbar.component';
import { ViewerComponent } from './components/viewer.component';
import { ViewerExtensionDirective } from './directives/viewer-extension.directive';

export const VIEWER_DIRECTIVES = [
    PdfPasswordDialogComponent,
    ViewerRenderComponent,
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
    ViewerToolbarActionsComponent,
    ViewerComponent,
    ViewerToolbarCustomActionsComponent,
    DownloadPromptDialogComponent
] as const;

/** @deprecated use `...VIEWER_DIRECTIVES` or import standalone directives */
@NgModule({
    imports: [...VIEWER_DIRECTIVES],
    exports: [...VIEWER_DIRECTIVES]
})
export class ViewerModule {}
