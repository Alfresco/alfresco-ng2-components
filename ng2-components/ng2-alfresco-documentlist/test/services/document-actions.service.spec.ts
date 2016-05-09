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

import {
    it,
    describe,
    expect,
    beforeEach
} from 'angular2/testing';
import {ContentActionHandler} from '../../src/models/content-action.model';
import {DocumentActionsService} from '../../src/services/document-actions.service';
import {AlfrescoServiceMock} from '../assets/alfresco.service.mock';

describe('DocumentActionsService', () => {

    let service: DocumentActionsService;
    
    beforeEach(() => {
        let alfrescoServiceMock = new AlfrescoServiceMock();
        service = new DocumentActionsService(alfrescoServiceMock);
    });

    it('should register default download action', () => {
        expect(service.getHandler('download')).not.toBeNull();
    });

    it('should register custom action handler', () => {
        var handler: ContentActionHandler = function (obj: any) {};
        service.setHandler('<key>', handler);
        expect(service.getHandler('<key>')).toBe(handler);
    });

    it('should not find handler that is not registered', () => {
        expect(service.getHandler('<missing>')).toBeNull();
    });

    it('should be case insensitive for keys', () => {
        var handler: ContentActionHandler = function (obj: any) {};
        service.setHandler('<key>', handler);
        expect(service.getHandler('<KEY>')).toBe(handler);

    });
});
