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
import { SimpleChange }    from '@angular/core';
import { ContentService } from 'ng2-alfresco-core';
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
    blobFile: any;

    content: string;

    constructor(private http: Http, private contentService: ContentService) {
    }

    ngOnChanges(changes: SimpleChange) {
        let blobFile = changes['blobFile'];
        if (blobFile && blobFile.currentValue) {
            this.urlFile = this.contentService.createTrustedUrl(this.blobFile);
        }
        if (!this.urlFile && !this.blobFile) {
            throw new Error('Attribute urlFile or blobFile is required');
        }

        return new Promise((resolve, reject) => {
            this.getUrlContent(resolve, reject);
        });
    }

    private getUrlContent(resolve, reject): void {
        this.http.get(this.urlFile, new RequestOptions({
            responseType: ResponseContentType.Text
        })).toPromise().then(
            (res: Response) => {
                this.content =  res.text();
                resolve();
            }, (event) => {
                reject(event);
            });
    }
}
