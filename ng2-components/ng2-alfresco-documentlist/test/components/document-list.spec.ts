/**
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

import {Observable} from 'rxjs/Observable';
import {DocumentList} from '../../src/components/document-list';
import {ContentColumnModel} from '../../src/models/content-column.model';

describe('document-list', () => {

    it('should setup default columns', () => {
        let list: DocumentList = new DocumentList(null);
        list.ngAfterContentInit();
        expect(list.columns.length).not.toBe(0);
    });

    it('should use custom columns instead of default ones', () => {
        let list: DocumentList = new DocumentList(null);
        let column: ContentColumnModel = {
            title: 'title',
            source: 'source',
            cssClass: 'css'
        };
        list.columns.push(column);

        list.ngAfterContentInit();
        expect(list.columns.length).toBe(1);
        expect(list.columns[0]).toBe(column);
    });

    it('should setup default root for breadcrumb', () => {
        let service = {
            getFolder: function() {
                return Observable.create(observer => {
                    var value = {};
                    observer.next(value);
                    observer.complete();
                });
            }
        };

        let list: DocumentList = new DocumentList(service);

        list.ngOnInit();
        expect(list.route.length).toBe(1);
        expect(list.route[0]).toBe(list.rootFolder);
    });

    it('should fetch folder', () => {
        let folder = {};
        let service = {
            getFolder: function() {
                return Observable.create(observer => {
                    observer.next(folder);
                    observer.complete();
                });
            }
        };
        let list: DocumentList = new DocumentList(service);
        list.ngOnInit();

        expect(list.folder).toBe(folder);
    });

    it('should get content url', () => {
        let url = 'URL';
        let service = {
            getContentUrl(content:any) { return url; }
        };
        let list: DocumentList = new DocumentList(service);

        spyOn(service, 'getContentUrl').and.callThrough();
        let result = list.getContentUrl(null);

        expect(result).toBe(url);
        expect(service.getContentUrl).toHaveBeenCalled();
    });

    it('should get thumbnail url', () => {
        let url = 'URL';
        let service = {
            getDocumentThumbnailUrl(content:any) { return url; }
        };
        let list: DocumentList = new DocumentList(service);

        spyOn(service, 'getDocumentThumbnailUrl').and.callThrough();
        let result = list.getDocumentThumbnailUrl(null);

        expect(result).toBe(url);
        expect(service.getDocumentThumbnailUrl).toHaveBeenCalled();
    });

});
