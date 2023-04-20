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

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@alfresco/adf-content-services';

@Component({
    selector: 'app-confirm-dialog-example',
    templateUrl: './confirm-dialog-example.component.html'
})
export class ConfirmDialogExampleComponent {

    constructor(private dialog: MatDialog) { }

    openConfirmDefaultDialog() {
        this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Upload',
                message: `This is the default message`
            },
            minWidth: '250px'
        });
    }

    openConfirmCustomDialog() {
        this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Upload',
                message: `This is the default message`,
                htmlContent: '<div> <p>A</p> <p>Custom</p> <p>Content</p> </div>'
            },
            minWidth: '250px'
        });
    }

    openConfirmCustomActionDialog() {
       const thirdOptionLabel = 'Yes. Don\'t Show it again';
       const dialog =  this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Upload',
                thirdOptionLabel,
                message: `This is the default message`
            },
            minWidth: '250px'
        });
       dialog.afterClosed().subscribe((status) => {
           // do the third option label operation
           if ( status === thirdOptionLabel) {
               // console.log('third option clicked');
           }
       });
    }
}
