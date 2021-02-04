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

import { Node } from '@alfresco/js-api';
import { TestBed } from '@angular/core/testing';
import { ContentMetadataService } from './content-metadata.service';
import { of } from 'rxjs';
import { ContentTypePropertiesService } from './content-type-property.service';

describe('ContentTypePropertyService', () => {

    let service: ContentMetadataService;
    let contentPropertyService: ContentTypePropertiesService;

    beforeEach(() => {
        service = TestBed.inject(ContentMetadataService);
        contentPropertyService = TestBed.inject(ContentTypePropertiesService);
    });

    it('should return all the properties of the node', () => {
        const fakeNode: Node = <Node> {
            name: 'Node',
            id: 'fake-id',
            isFile: true,
            aspectNames: ['exif:exif'],
            createdByUser: {displayName: 'test-user'},
            modifiedByUser: {displayName: 'test-user-modified'}
        };

        service.getBasicProperties(fakeNode).subscribe(
            (res) => {
                expect(res.length).toEqual(10);
                expect(res[0].value).toEqual('Node');
                expect(res[1].value).toBeFalsy();
                expect(res[2].value).toBe('test-user');
            }
        );
    });

    it('should return the content type property', () => {
        spyOn(contentPropertyService, 'getContentTypeCardItem').and.returnValue(of({ label: 'hello i am a weird content type'}));

        service.getNodeType('fn:fakenode').subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res).not.toBeNull();
                expect(res.label).toBe('hello i am a weird content type');
            }
        );
    });

    it('should trigger the opening of the content type dialog', () => {
        spyOn(contentPropertyService, 'openContentTypeDialogConfirm').and.returnValue(of());

        service.openConfirmDialog('fn:fakenode').subscribe(
            () => {
                expect(contentPropertyService.openContentTypeDialogConfirm).toHaveBeenCalledWith('fn:fakenode');
            }
        );
    });

});
