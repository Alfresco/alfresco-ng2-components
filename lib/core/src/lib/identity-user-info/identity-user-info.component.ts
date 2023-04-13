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

import { Component, Input, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatMenuTrigger, MenuPositionX, MenuPositionY } from '@angular/material/menu';
import { IdentityUserModel } from '../auth/models/identity-user.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'adf-identity-user-info',
    templateUrl: './identity-user-info.component.html',
    styleUrls: ['./identity-user-info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class IdentityUserInfoComponent implements OnDestroy {

    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;

    /** Is the user logged in */
    @Input()
    isLoggedIn: boolean;

    /** User */
    @Input()
    identityUser: IdentityUserModel;

    /** Custom path for the background banner image for APS users. */
    @Input()
    bpmBackgroundImage: string = './assets/images/bpm-background.png';

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

    private destroy$ = new Subject();

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

    get showOnRight(): boolean {
        return this.namePosition === 'right';
    }

    get canShow(): boolean {
        return this.isLoggedIn && !!this.identityUser;
    }
}
