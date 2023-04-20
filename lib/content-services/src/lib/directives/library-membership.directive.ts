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

import { Directive, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import {
    SiteEntry,
    SiteMembershipRequestBody,
    SiteMemberEntry,
    SiteMembershipRequestEntry,
    SitesApi
} from '@alfresco/js-api';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { AlfrescoApiService } from '@alfresco/adf-core';
import { LibraryMembershipToggleEvent } from '../interfaces/library-membership-toggle-event.interface';
import { LibraryMembershipErrorEvent} from '../interfaces/library-membership-error-event.interface';
import { VersionCompatibilityService } from '../version-compatibility/version-compatibility.service';
import { SitesService } from '../common/services/sites.service';

@Directive({
    selector: '[adf-library-membership]',
    exportAs: 'libraryMembership'
})
export class LibraryMembershipDirective implements OnChanges {
    targetSite: any = null;

    isJoinRequested: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    _sitesApi: SitesApi;
    get sitesApi(): SitesApi {
        this._sitesApi = this._sitesApi ?? new SitesApi(this.alfrescoApiService.getInstance());
        return this._sitesApi;
    }

    /** Site for which to toggle the membership request. */
    @Input('adf-library-membership')
    selection: SiteEntry = null;

    /** Site for which to toggle the membership request. */
    @Input()
    isAdmin = false;

    @Output()
    toggle = new EventEmitter<LibraryMembershipToggleEvent>();

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output()
    error = new EventEmitter<LibraryMembershipErrorEvent>();

    @HostListener('click')
    onClick() {
        this.toggleMembershipRequest();
    }

    constructor(
        private alfrescoApiService: AlfrescoApiService,
        private sitesService: SitesService,
        private versionCompatibilityService: VersionCompatibilityService
    ) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes.selection.currentValue || !changes.selection.currentValue.entry) {
            this.targetSite = null;

            return;
        }
        this.targetSite = changes.selection.currentValue.entry;
        this.markMembershipRequest();
    }

    toggleMembershipRequest() {
        if (!this.targetSite) {
            return;
        }

        if (this.targetSite.joinRequested) {
            this.cancelJoinRequest().subscribe(
                () => {
                    this.targetSite.joinRequested = false;
                    this.isJoinRequested.next(false);
                    const info = {
                        updatedEntry: this.targetSite,
                        shouldReload: false,
                        i18nKey: 'APP.MESSAGES.INFO.JOIN_CANCELED'
                    };
                    this.toggle.emit(info);
                },
                (error) => {
                    const errWithMessage = {
                        error,
                        i18nKey: 'APP.MESSAGES.ERRORS.JOIN_CANCEL_FAILED'
                    };
                    this.error.emit(errWithMessage);
                }
            );
        }

        if (!this.targetSite.joinRequested && !this.isAdmin) {
            this.joinLibraryRequest().subscribe(
                (createdMembership) => {
                    this.targetSite.joinRequested = true;
                    this.isJoinRequested.next(true);

                    if (createdMembership.entry && createdMembership.entry.site && createdMembership.entry.site.role) {
                        const info = {
                            shouldReload: true,
                            i18nKey: 'APP.MESSAGES.INFO.JOINED'
                        };
                        this.toggle.emit(info);
                    } else {
                        const info = {
                            updatedEntry: this.targetSite,
                            shouldReload: false,
                            i18nKey: 'APP.MESSAGES.INFO.JOIN_REQUESTED'
                        };
                        this.toggle.emit(info);
                    }
                },
                (error) => {
                    const errWithMessage = {
                        error,
                        i18nKey: 'APP.MESSAGES.ERRORS.JOIN_REQUEST_FAILED'
                    };

                    const senderEmailCheck = 'Failed to resolve sender mail address';
                    const receiverEmailCheck = 'All recipients for the mail action were invalid';

                    if (error.message) {
                        if (error.message.includes(senderEmailCheck)) {
                            errWithMessage.i18nKey = 'APP.MESSAGES.ERRORS.INVALID_SENDER_EMAIL';
                        } else if (error.message.includes(receiverEmailCheck)) {
                            errWithMessage.i18nKey = 'APP.MESSAGES.ERRORS.INVALID_RECEIVER_EMAIL';
                        }
                    }

                    this.error.emit(errWithMessage);
                }
            );
        }

        if (this.isAdmin) {
            this.joinLibrary().subscribe(
                (createdMembership: SiteMemberEntry) => {
                    if (createdMembership.entry && createdMembership.entry.role) {
                        const info = {
                            shouldReload: true,
                            i18nKey: 'APP.MESSAGES.INFO.JOINED'
                        };
                        this.toggle.emit(info);
                    }
                },
                (error) => {
                    const errWithMessage = {
                        error,
                        i18nKey: 'APP.MESSAGES.ERRORS.JOIN_REQUEST_FAILED'
                    };

                    const senderEmailCheck = 'Failed to resolve sender mail address';
                    const receiverEmailCheck = 'All recipients for the mail action were invalid';

                    if (error.message) {
                        if (error.message.includes(senderEmailCheck)) {
                            errWithMessage.i18nKey = 'APP.MESSAGES.ERRORS.INVALID_SENDER_EMAIL';
                        } else if (error.message.includes(receiverEmailCheck)) {
                            errWithMessage.i18nKey = 'APP.MESSAGES.ERRORS.INVALID_RECEIVER_EMAIL';
                        }
                    }

                    this.error.emit(errWithMessage);
                }
            );
        }
    }

    markMembershipRequest() {
        if (!this.targetSite) {
            return;
        }

        this.getMembershipRequest().subscribe(
            (data) => {
                if (data.entry.id === this.targetSite.id) {
                    this.targetSite.joinRequested = true;
                    this.isJoinRequested.next(true);
                }
            },
            () => {
                this.targetSite.joinRequested = false;
                this.isJoinRequested.next(false);
            }
        );
    }

    private joinLibraryRequest(): Observable<SiteMembershipRequestEntry> {
        const memberBody = {
            id: this.targetSite.id
        } as SiteMembershipRequestBody;

        if (this.versionCompatibilityService.isVersionSupported('7.0.0')) {
            memberBody.client = 'workspace';
        }
        return from(this.sitesApi.createSiteMembershipRequestForPerson('-me-', memberBody));
    }

    private joinLibrary() {
        return this.sitesService.createSiteMembership(this.targetSite.id, {
            role: 'SiteConsumer',
            id: '-me-'
        });
    }

    private cancelJoinRequest() {
        return from(this.sitesApi.deleteSiteMembershipRequestForPerson('-me-', this.targetSite.id));
    }

    private getMembershipRequest() {
        return from(this.sitesApi.getSiteMembershipRequestForPerson('-me-', this.targetSite.id));
    }
}
