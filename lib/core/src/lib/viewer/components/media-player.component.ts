/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { Track } from '../models/viewer.model';
import { UrlService } from '../../common/services/url.service';

@Component({
    selector: 'adf-media-player',
    templateUrl: './media-player.component.html',
    styleUrls: ['./media-player.component.scss'],
    host: {class: 'adf-media-player'},
    encapsulation: ViewEncapsulation.None
})
export class MediaPlayerComponent implements OnChanges {

    @Input()
    urlFile: string;

    @Input()
    blobFile: Blob;

    @Input()
    mimeType: string;

    @Input()
    fileName: string;

    /** media subtitles for the media player*/
    @Input()
    tracks: Track[] = [];

    @Output()
    error = new EventEmitter<any>();

    constructor(private urlService: UrlService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        const blobFile = changes['blobFile'];

        if (blobFile && blobFile.currentValue) {
            this.urlFile = this.urlService.createTrustedUrl(this.blobFile);
            return;
        }

        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    }

    onMediaPlayerError(event: any) {
        this.error.emit(event);
    }
}
