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

import { Component, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'adf-avatar',
    imports: [CommonModule],
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AvatarComponent {
    @Input()
    src: string;

    @Input()
    initials: string = 'U';

    @Input()
    tooltip: string = '';

    @HostBinding('style.--adf-avatar-size')
    @Input()
    size = getComputedStyle(document.documentElement).getPropertyValue('--adf-avatar-size');

    @HostBinding('style.--adf-avatar-cursor')
    @Input()
    cursor = getComputedStyle(document.documentElement).getPropertyValue('--adf-avatar-cursor');
}
