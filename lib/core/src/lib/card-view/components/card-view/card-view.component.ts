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

import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CardViewItem } from '../../interfaces/card-view-item.interface';
import { DEFAULT_SEPARATOR } from '../card-view-textitem/card-view-textitem.component';

@Component({
    selector: 'adf-card-view',
    templateUrl: './card-view.component.html',
    styleUrls: ['./card-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CardViewComponent {
    /** (**required**) Items to show in the card view. */
    @Input()
    properties: CardViewItem [];

    /** Toggles whether or not the items can be edited. */
    @Input()
    editable: boolean;

    /** Toggles whether or not to show empty items in non-editable mode. */
    @Input()
    displayEmpty: boolean = true;

    /** Toggles whether or not to display none option. */
    @Input()
    displayNoneOption: boolean = true;

    /** Toggles whether or not to display clear action. */
    @Input()
    displayClearAction: boolean = true;

    /** Toggles whether or not to enable copy to clipboard action. */
    @Input()
    copyToClipboardAction: boolean = true;

    /** Toggles whether or not to enable chips for multivalued properties. */
    @Input()
    useChipsForMultiValueProperty: boolean = true;

    /** String separator between multi-value property items. */
    @Input()
    multiValueSeparator: string = DEFAULT_SEPARATOR;
}
