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

import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { AccordionComponent } from './accordion.component';
// import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
    selector: 'adf-accordion-group',
    templateUrl: 'accordion-group.component.html',
    styleUrls: ['./accordion-group.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccordionGroupComponent implements OnDestroy {
    private _isOpen: boolean = false;
    private _isSelected: boolean = false;

    @ViewChild('contentWrapper')
    contentWrapper: any;

    /** Title heading for the group. */
    @Input()
    heading: string;

    /** The material design icon. */
    @Input()
    headingIcon: string;

    /** Tooltip message to be shown for headingIcon */
    @Input()
    headingIconTooltip: string;

    /** Should the (expanded) accordion icon be shown? */
    @Input()
    hasAccordionIcon: boolean = true;

    @Input()
    hasChiled: boolean = true;

    /** Emitted when the heading is clicked. */
    @Output()
    headingClick: EventEmitter<any> = new EventEmitter<any>();

    /** Is this group currently open? */
    @Input()
    set isOpen(value: boolean) {
        this._isOpen = value;
        if (value) {
            this.accordion.closeOthers(this);
        }
    }

    get isOpen() {
        return this._isOpen;
    }

    /** Is this group currently selected? */
    @Input()
    set isSelected(value: boolean) {
        this._isSelected = value;
    }

    get isSelected() {
        return this._isSelected;
    }

    constructor(private accordion: AccordionComponent) {
        this.accordion.addGroup(this);
    }

    ngOnDestroy() {
        this.accordion.removeGroup(this);
    }

    hasHeadingIcon() {
        return this.headingIcon ? true : false;
    }

    toggleOpen(): void {
        this.isOpen = !this.isOpen;
        this.headingClick.emit(this.heading);
    }
}
