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

import { UserInfoMode } from '@alfresco/adf-core';
import { EcmUserModel, PeopleContentService } from '@alfresco/adf-content-services';
import { Component, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger, MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { Subject } from 'rxjs';
import { PeopleProcessService } from '../common/services/people-process.service';
import { BpmUserModel } from '../common/models/bpm-user.model';

@Component({
    selector: 'adf-process-user-info',
    templateUrl: './process-user-info.component.html',
    styleUrls: ['./process-user-info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProcessUserInfoComponent implements OnDestroy {

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    /** Determines if user is logged in. */
    @Input()
    isLoggedIn: boolean;

    /** BPM user info. */
    @Input()
    bpmUser: BpmUserModel;

    /** ECM user info. */
    @Input()
    ecmUser: EcmUserModel;

    /** current mode. */
    @Input()
    mode: UserInfoMode = UserInfoMode.PROCESS;

    /** Custom path for the background banner image for APS users. */
    @Input()
    bpmBackgroundImage: string = './assets/images/bpm-background.png';

    /** Custom path for the background banner image for ACS users. */
    @Input()
    ecmBackgroundImage: string = './assets/images/ecm-background.png';

    /** Custom choice for opening the menu at the bottom. Can be `before` or `after`. */
    @Input()
    menuPositionX: MenuPositionX = 'after';

    /** Custom choice for opening the menu at the bottom. Can be `above` or `below`. */
    @Input()
    menuPositionY: MenuPositionY = 'below';

    /** Shows/hides the username next to the user info button. */
    @Input()
    showName: boolean = true;

    /** When the username is shown, this defines its position relative to the user info button.
     * Can be `right` or `left`.
     */
    @Input()
    namePosition: string = 'right';

    userInfoMode = UserInfoMode;

    private destroy$ = new Subject();

    constructor(private peopleProcessService: PeopleProcessService, private peopleContentService: PeopleContentService) {
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    onKeyPress(event: KeyboardEvent) {
        this.closeUserModal(event);
    }

    private closeUserModal($event: KeyboardEvent) {
        if ($event.keyCode === 27) {
            this.trigger.closeMenu();
        }
    }

    stopClosing(event: Event) {
        event.stopPropagation();
    }

    getBpmUserImage(): string {
        return this.peopleProcessService.getCurrentUserProfileImage();
    }

    getEcmAvatar(avatarId: string): string {
        return this.peopleContentService.getUserProfileImage(avatarId);
    }

    get showOnRight(): boolean {
        return this.namePosition === 'right';
    }

    get canShow(): boolean {
        return this.isLoggedIn && !!this.bpmUser && !!this.mode;
    }
}
