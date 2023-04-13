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

import { Component, ContentChildren, QueryList, AfterContentInit, ViewEncapsulation } from '@angular/core';
import { MatMenuItem } from '@angular/material/menu';

@Component({
    selector: 'adf-buttons-action-menu',
    templateUrl: './buttons-menu.component.html',
    styleUrls: ['./buttons-menu.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ButtonsMenuComponent implements  AfterContentInit {

    @ContentChildren(MatMenuItem) buttons: QueryList<MatMenuItem>;

    isMenuEmpty: boolean;

    ngAfterContentInit() {
        this.isMenuEmpty = this.buttons.length <= 0;
    }

    isMobile(): boolean {
        return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}
