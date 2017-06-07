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

import { Component, Input } from '@angular/core';
import { SimpleChanges }    from '@angular/core';
import { Http, Response, RequestOptions, ResponseContentType }  from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Component({
    selector: 'txt-viewer',
    templateUrl: './txtViewer.component.html',
    styleUrls: ['./txtViewer.component.css']
})
export class TxtViewerComponent {

    @Input()
    urlFile: any;

    @Input()
    blobFile: Blob;

    content: string;

    constructor(private http: Http) {
    }

    ngOnChanges(changes: SimpleChanges): Promise<any> {

        let blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            return this.readBlob(blobFile.currentValue);
        }

        let urlFile = changes['urlFile'];
        if (urlFile && urlFile.currentValue) {
            return this.getUrlContent(urlFile.currentValue);
        }

        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }
    }

    private getUrlContent(url: string): Promise<any> {
        return new Promise((resolve, reject) => {

            this.http.get(url, new RequestOptions({
                responseType: ResponseContentType.Text
            })).toPromise().then(
                (res: Response) => {
                    this.content = res.text();
                    resolve();
                }, (event) => {
                    reject(event);
                });
        });
    }

    private readBlob(blob: Blob): Promise<any> {
        return new Promise((resolve, reject) => {
            let reader = new FileReader();

            reader.onload = () => {
                this.content = reader.result;
                resolve();
            };

            reader.onerror = (error: ErrorEvent) => {
                reject(error);
            };

            reader.readAsText(blob);
        });
    }
}
