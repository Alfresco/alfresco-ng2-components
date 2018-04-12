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

import { Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatExpansionPanel } from '@angular/material';

@Component({
    selector: 'adf-accordion-group',
    templateUrl: 'accordion-group.component.html',
    styleUrls: ['./accordion-group.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccordionGroupComponent {
    private _isOpen: boolean = false;
    private _isSelected: boolean = false;

    @ViewChild('contentWrapper')
    contentWrapper: any;

    @ViewChild('expansionPanel') expansionPanel: MatExpansionPanel;

    /** Title heading for the group. */
    @Input()
    heading: string;

    /** The material design icon. */
    @Input()
    headingIcon: string;

    /** Tooltip message to be shown for headingIcon */
    @Input()
    headingIconTooltip: string;

    @Input()
    showExpansionIndicator: boolean = true;

    /** Emitted when the heading is clicked. */
    @Output()
    headingClick: EventEmitter<any> = new EventEmitter<any>();

    /** Is this group currently open? */
    @Input()
    set isOpen(value: boolean) {
        this._isOpen = value;
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

    constructor() { }

    hasHeadingIcon() {
        return this.headingIcon ? true : false;
    }

    onHeaderClick(): void {
        this.headingClick.emit(this.heading);
    }

    toggleExpansion(event: any) {
        this.isOpen && this.showExpansionIndicator ? this.expansionPanel.expanded : this.expandPannel() ;
    }

    expandPannel() {
        this.expansionPanel.expanded = !this.expansionPanel.expanded;
    }

    isExpanded(): boolean {
        return this.isOpen && this.isSelected;
    }
}
