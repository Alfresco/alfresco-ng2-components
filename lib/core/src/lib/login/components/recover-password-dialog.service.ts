/*
 * Copyright © 2005 - 2021 Alfresco Software, Ltd. All rights reserved.
 *
 * License rights for this program may be obtained from Alfresco Software, Ltd.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Injectable, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({ providedIn: 'root' })
export class RecoverPasswordDialogService {
    constructor(private dialog: MatDialog) { }

    showDialog<T>(dialog: ComponentType<T> | TemplateRef<T>, options = {}): MatDialogRef<T, boolean> {
        return this.dialog.open<T>(dialog, {
            height: '35%',
            minWidth: '30%',
            ...options
        });
    }
}
