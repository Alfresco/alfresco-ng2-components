/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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
    Component,
    ContentChildren,
    EventEmitter,
    HostListener,
    Input,
    Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import {
    InfoDrawerButtonsDirective,
    InfoDrawerContentDirective,
    InfoDrawerLayoutComponent,
    InfoDrawerTitleDirective
} from './info-drawer-layout.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
@Component({
    selector: 'adf-info-drawer-tab',
    standalone: true,
    template: '<ng-template><ng-content /></ng-template>',
    encapsulation: ViewEncapsulation.None
})
export class InfoDrawerTabComponent {
    /** The title of the tab (string or translation key). */
    @Input()
    label: string = '';

    /** Icon to render for the tab. */
    @Input()
    icon: string = null;

    @ViewChild(TemplateRef, { static: true })
    content: TemplateRef<any>;
}

@Component({
    selector: 'adf-info-drawer',
    standalone: true,
    imports: [
        CommonModule,
        InfoDrawerLayoutComponent,
        TranslateModule,
        MatTabsModule,
        MatIconModule,
        InfoDrawerButtonsDirective,
        InfoDrawerTitleDirective,
        InfoDrawerContentDirective,
        InfoDrawerTabComponent
    ],
    templateUrl: './info-drawer.component.html',
    styleUrls: ['./info-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: { class: 'adf-info-drawer' }
})
export class InfoDrawerComponent {
    /** The title of the info drawer (string or translation key). */
    @Input()
    title: string | null = null;

    @Input()
    icon: string | null = null;

    /** The selected index tab. */
    @Input()
    selectedIndex: number = 0;

    /** The visibility of the header. */
    @Input()
    showHeader: boolean = true;

    /** Emitted when the currently active tab changes. */
    @Output()
    currentTab: EventEmitter<number> = new EventEmitter<number>();

    @ContentChildren(InfoDrawerTabComponent)
    contentBlocks: QueryList<InfoDrawerTabComponent>;

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    @HostListener('keyup', ['$event'])
    onKeyUp(event: KeyboardEvent): void {
        event.stopPropagation();
    }

    showTabLayout(): boolean {
        return this.contentBlocks.length > 0;
    }

    onTabChange(event: MatTabChangeEvent) {
        this.currentTab.emit(event.index);
    }
}
