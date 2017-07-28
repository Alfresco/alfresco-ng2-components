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

import { Component, Input } from '@angular/core';

declare var require: any;

@Component({
    selector: 'adf-empty-list',
    styleUrls: ['./empty-list.component.css'],
    templateUrl: './empty-list.component.html'
})
export class EmptyListComponent {

    @Input()
    emptyListImageUrl: string = require('../../assets/images/empty_doc_lib.svg');

    @Input()
    emptyMsg: string = 'ADF-DATATABLE.EMPTY.HEADER';

    @Input()
    dragDropMsg: string = 'ADF-DATATABLE.EMPTY.DRAG-AND-DROP.TITLE';

    @Input()
    additionalMsg: string = 'ADF-DATATABLE.EMPTY.DRAG-AND-DROP.SUBTITLE';

}
