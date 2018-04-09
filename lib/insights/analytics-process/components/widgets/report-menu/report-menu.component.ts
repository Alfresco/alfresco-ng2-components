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

 /* tslint:disable:component-selector no-access-missing-member no-input-rename  */

import { Component, Input, Output, EventEmitter } from '@angular/core';

 @Component({
    selector: 'adf-report-action-menu',
    templateUrl: './report-menu.component.html'
})
export class ReportMenuComponent {

    @Output() onToggleClicked = new EventEmitter<void>();
    @Output() onShowDialogClicked = new EventEmitter<string>();
    @Output() onDeleteClicked = new EventEmitter<void>();
    @Input() validForm : boolean;
    
    toggleParameters(){
        this.onToggleClicked.emit();
    }

    deleteReport(){
        this.onDeleteClicked.emit();
    }

    showDialog(event: string) {
        this.onShowDialogClicked.emit(event);
    }
}
