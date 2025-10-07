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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AuthenticationService, BasicAlfrescoAuthService } from '@alfresco/adf-core';
import { ContentAuthLoaderService } from './content-auth-loader.service';
import { Subject } from 'rxjs';

describe('ContentAuthLoaderService', () => {
    let service: ContentAuthLoaderService;
    let authService: AuthenticationService;
    let basicAlfrescoAuthService: BasicAlfrescoAuthService;
    let onLoginSubject: Subject<void>;

    beforeEach(() => {
        onLoginSubject = new Subject<void>();
        TestBed.configureTestingModule({
            providers: [
                ContentAuthLoaderService,
                {
                    provide: AuthenticationService,
                    useValue: {
                        onLogin: onLoginSubject.asObservable(),
                        isOauth: () => false,
                        isALLProvider: () => false,
                        isECMProvider: () => false
                    }
                },
                {
                    provide: BasicAlfrescoAuthService,
                    useValue: {
                        requireAlfTicket: jasmine.createSpy()
                    }
                }
            ]
        });

        service = TestBed.inject(ContentAuthLoaderService);
        authService = TestBed.inject(AuthenticationService);
        basicAlfrescoAuthService = TestBed.inject(BasicAlfrescoAuthService);
    });

    it('should require Alf ticket on login if OAuth and provider is ALL or ECM', fakeAsync(() => {
        spyOn(authService, 'isOauth').and.returnValue(true);
        spyOn(authService, 'isALLProvider').and.returnValue(true);

        service.init();
        onLoginSubject.next();
        tick();

        expect(basicAlfrescoAuthService.requireAlfTicket).toHaveBeenCalled();
    }));

    it('should not require Alf ticket on login if not OAuth', fakeAsync(() => {
        spyOn(authService, 'isOauth').and.returnValue(false);

        service.init();
        onLoginSubject.next();
        tick();

        expect(basicAlfrescoAuthService.requireAlfTicket).not.toHaveBeenCalled();
    }));
});
