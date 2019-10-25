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

import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material';
@Component({
    selector: 'adf-info-drawer-tab',
    template: '<ng-template><ng-content></ng-content></ng-template>'
})
export class InfoDrawerTabComponent {
    /** The title of the tab (string or translation key). */
    @Input()
    label: string = '';

    /** Icon to render for the tab. */
    @Input()
    icon: string = null;

    @ViewChild(TemplateRef)
    content: TemplateRef<any>;
}

@Component({
    selector: 'adf-info-drawer',
    templateUrl: './info-drawer.component.html',
    styleUrls: ['./info-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { 'class': 'adf-info-drawer' }
})
export class InfoDrawerComponent {
    /** The title of the info drawer (string or translation key). */
    @Input()
    title: string|null = null;

    /** The selected index tab. */
    @Input()
    selectedIndex: number = 0;

    /** Emitted when the currently active tab changes. */
    @Output()
    currentTab: EventEmitter<number> = new EventEmitter<number>();

    @ContentChildren(InfoDrawerTabComponent)
    contentBlocks: QueryList<InfoDrawerTabComponent>;

    showTabLayout(): boolean {
        return this.contentBlocks.length > 0;
    }

    onTabChange(event: MatTabChangeEvent) {
        this.currentTab.emit(event.index);
    }
}
