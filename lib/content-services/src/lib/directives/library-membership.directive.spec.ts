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

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LibraryMembershipDirective } from './library-membership.directive';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AlfrescoApiService, CoreModule, CoreTestingModule } from '@alfresco/adf-core';
import { ContentDirectiveModule } from './content-directive.module';
import { SitesService } from '../common/services/sites.service';

describe('LibraryMembershipDirective', () => {
    let alfrescoApiService: AlfrescoApiService;
    let directive: LibraryMembershipDirective;
    let sitesService: SitesService;
    let addMembershipSpy: jasmine.Spy;
    let getMembershipSpy: jasmine.Spy;
    let deleteMembershipSpy: jasmine.Spy;
    let mockSupportedVersion = false;

    let testSiteEntry: any;
    let requestedMembershipResponse: any;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentDirectiveModule,
                CoreModule.forRoot(),
                CoreTestingModule
            ],
            schemas: [NO_ERRORS_SCHEMA]
        });

        testSiteEntry = {
            id: 'id-1',
            guid: 'site-1',
            title: 'aa t m',
            visibility: 'MODERATED'
        };

        requestedMembershipResponse = {
            id: testSiteEntry.id,
            createdAt: '2018-11-14',
            site: testSiteEntry
        };

        alfrescoApiService = TestBed.inject(AlfrescoApiService);
        sitesService = TestBed.inject(SitesService);
        directive = new LibraryMembershipDirective(alfrescoApiService, sitesService, {
            ecmProductInfo$: new Subject(),
            isVersionSupported: () => mockSupportedVersion
        } as any);
    });

    describe('markMembershipRequest', () => {
        beforeEach(() => {
            getMembershipSpy = spyOn(directive['sitesApi'], 'getSiteMembershipRequestForPerson').and.returnValue(Promise.resolve({ entry: requestedMembershipResponse }));
        });

        it('should not check membership requests if no entry is selected', fakeAsync(() => {
            const selection = {};
            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();
            expect(getMembershipSpy).not.toHaveBeenCalled();
        }));

        it('should check if a membership request exists for the selected library', fakeAsync(() => {
            const selection = { entry: {} };
            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();
            expect(getMembershipSpy.calls.count()).toBe(1);
        }));

        it('should remember when a membership request exists for selected library', fakeAsync(() => {
            const selection = { entry: testSiteEntry };
            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();
            expect(directive.targetSite.joinRequested).toBe(true);
        }));

        it('should remember when a membership request is not found for selected library', fakeAsync(() => {
            getMembershipSpy.and.returnValue(Promise.reject());

            const selection = { entry: testSiteEntry };
            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();
            expect(directive.targetSite.joinRequested).toBe(false);
        }));
    });

    describe('toggleMembershipRequest', () => {
        beforeEach(() => {
            mockSupportedVersion = false;
            getMembershipSpy = spyOn(directive['sitesApi'], 'getSiteMembershipRequestForPerson').and.returnValue(Promise.resolve({ entry: requestedMembershipResponse }));
            addMembershipSpy = spyOn(directive['sitesApi'], 'createSiteMembershipRequestForPerson').and.returnValue(Promise.resolve({ entry: requestedMembershipResponse }));
            deleteMembershipSpy = spyOn(directive['sitesApi'], 'deleteSiteMembershipRequestForPerson').and.returnValue(Promise.resolve({}));
        });

        it('should do nothing if there is no selected library ', fakeAsync(() => {
            const selection = {};
            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();
            directive.toggleMembershipRequest();
            tick();
            expect(addMembershipSpy).not.toHaveBeenCalled();
            expect(deleteMembershipSpy).not.toHaveBeenCalled();
        }));

        it('should delete membership request if there is one', fakeAsync(() => {
            const selection = { entry: testSiteEntry };
            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();
            directive.toggleMembershipRequest();
            tick();
            expect(deleteMembershipSpy).toHaveBeenCalled();
        }));

        it('should call API to make a membership request if there is none', fakeAsync(() => {
            const selection = { entry: { id: 'no-membership-requested' } };
            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();
            directive.toggleMembershipRequest();
            tick();
            expect(addMembershipSpy).toHaveBeenCalledWith('-me-', { id: 'no-membership-requested' });
            expect(deleteMembershipSpy).not.toHaveBeenCalled();
        }));

        it(`should add 'workspace' to send appropriate email`, fakeAsync(() => {
            mockSupportedVersion = true;
            const selection = { entry: { id: 'no-membership-requested' } };
            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();
            directive.toggleMembershipRequest();
            tick();
            expect(addMembershipSpy).toHaveBeenCalledWith('-me-', { id: 'no-membership-requested', client: 'workspace' });
            expect(deleteMembershipSpy).not.toHaveBeenCalled();
        }));

        it('should call API to add user to library if admin user', fakeAsync(() => {
            const createSiteMembershipSpy = spyOn(sitesService, 'createSiteMembership').and.returnValue(of({} as any));
            const selection = { entry: { id: 'no-membership-requested' } };
            const selectionChange = new SimpleChange(null, selection, true);
            directive.isAdmin = true;
            directive.ngOnChanges({ selection: selectionChange });
            tick();
            directive.toggleMembershipRequest();
            tick();
            expect(createSiteMembershipSpy).toHaveBeenCalled();
            expect(addMembershipSpy).not.toHaveBeenCalled();
        }));

        it('should emit error when the request to join a library fails', fakeAsync(() => {
            spyOn(directive.error, 'emit');
            addMembershipSpy.and.returnValue(throwError('err'));

            const selection = { entry: { id: 'no-membership-requested' } };
            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();
            directive.toggleMembershipRequest();
            tick();
            expect(directive.error.emit).toHaveBeenCalled();
        }));

        it('should emit specific error message on invalid email address server error', fakeAsync(() => {
            const emitErrorSpy = spyOn(directive.error, 'emit');
            const selection = { entry: { id: 'no-membership-requested' } };
            const change = new SimpleChange(null, selection, true);
            directive.ngOnChanges({ selection: change });
            tick();

            const testData = [
                {
                    fixture: 'Failed to resolve sender mail address',
                    expected: 'APP.MESSAGES.ERRORS.INVALID_SENDER_EMAIL'
                },
                {
                    fixture: 'All recipients for the mail action were invalid',
                    expected: 'APP.MESSAGES.ERRORS.INVALID_RECEIVER_EMAIL'
                }
            ];

            testData.forEach((data) => {
                addMembershipSpy.and.returnValue(throwError({ message: data.fixture }));
                emitErrorSpy.calls.reset();
                directive.toggleMembershipRequest();
                tick();
                expect(emitErrorSpy).toHaveBeenCalledWith({
                    error: { message: data.fixture },
                    i18nKey: data.expected
                });
            });
        }));
    });
});
