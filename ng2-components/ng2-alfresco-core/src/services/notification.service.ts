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

import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarRef, MdDialog } from '@angular/material';

@Injectable()
export class NotificationService {

    static DEFAULT_DURATION_MESSAGE: number = 5000;

    constructor(public snackbar: MdSnackBar, public dialog: MdDialog) {
    }

    public openSnackMessage(message: string, millisecondsDuration?: number): MdSnackBarRef<any> {
        return this.snackbar.open(message, null, {
            duration: millisecondsDuration || NotificationService.DEFAULT_DURATION_MESSAGE
        });
    }

    public openSnackMessageAction(message: string, action: string, millisecondsDuration?: number): MdSnackBarRef<any> {
        return this.snackbar.open(message, action, {
            duration: millisecondsDuration || NotificationService.DEFAULT_DURATION_MESSAGE
        });
    }
}
