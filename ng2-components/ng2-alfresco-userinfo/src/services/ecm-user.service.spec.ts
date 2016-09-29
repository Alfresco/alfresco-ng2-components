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
/*
// import { AlfrescoAuthenticationService, AlfrescoContentService } from 'ng2-alfresco-core';
import { EcmUserService } from './ecm-user.service';
import { ReflectiveInjector } from '@angular/core';
import { EcmUserModel } from '../models/ecm-user.model';

declare var AlfrescoApi: any;
declare let jasmine: any;

describe('Ecm User service', () => {

    let injector;
    let ecmUserService: EcmUserService;
    // let contentService: AlfrescoContentService;
    // let authService: AlfrescoAuthenticationService;

    beforeEach(() => {

        injector = ReflectiveInjector.resolveAndCreate([
            EcmUserService
        ]);

        // contentService = injector.get(AlfrescoContentService);
        // authService = injector.get(AlfrescoAuthenticationService);
        ecmUserService = injector.get(EcmUserService);

        jasmine.Ajax.install();
    });

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should be able', (done) => {
        let authService = new AlfrescoAuthenticationService();
        spyOn(authService, )
        ecmUserService.getUserInfo('fake-user').subscribe((res) => {
            expect(res).not.toBeUndefined();
            expect(res).toEqual(jasmine.any(EcmUserModel));
            expect(res.firstName).toEqual('fake-user-response');
            expect(res.email).toEqual('fake@email.com');
            done();
        });

        jasmine.Ajax.requests.mostRecent().respondWith({
            'status': 201,
            contentType: 'application/json',
            responseText: JSON.stringify({'entry': {'firstName': 'fake-user-response', 'id': 'fake@email.com'}})
        });
    });

});
*/
