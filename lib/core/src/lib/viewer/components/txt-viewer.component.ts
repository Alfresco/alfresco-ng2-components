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

import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, ViewEncapsulation, SimpleChanges } from '@angular/core';
import { AppConfigService } from '../../app-config/app-config.service';

@Component({
    selector: 'adf-txt-viewer',
    templateUrl: './txt-viewer.component.html',
    styleUrls: ['./txt-viewer.component.scss'],
    host: { class: 'adf-txt-viewer' },
    encapsulation: ViewEncapsulation.None
})
export class TxtViewerComponent implements OnChanges {

    @Input()
    urlFile: any;

    @Input()
    blobFile: Blob;

    content: string | ArrayBuffer;

    constructor(private http: HttpClient, private appConfigService: AppConfigService) {
    }

    ngOnChanges(changes: SimpleChanges): Promise<void> {

        const blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            return this.readBlob(blobFile.currentValue);
        }

        const urlFile = changes['urlFile'];
        if (urlFile && urlFile.currentValue) {
            return this.getUrlContent(urlFile.currentValue);
        }

        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }

        return Promise.resolve();
    }

    private getUrlContent(url: string): Promise<void> {
        const withCredentialsMode = this.appConfigService.get<boolean>('auth.withCredentials', false);

        return new Promise((resolve, reject) => {
            this.http.get(url, { responseType: 'text', withCredentials: withCredentialsMode }).subscribe((res) => {
                this.content = res;
                resolve();
            }, (event) => {
                reject(event);
            });
        });
    }

    private readBlob(blob: Blob): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                this.content = reader.result;
                resolve();
            };

            reader.onerror = (error: any) => {
                reject(error);
            };

            reader.readAsText(blob);
        });
    }
}
