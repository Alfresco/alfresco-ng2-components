import { Component } from '@angular/core';
import { NonResponsivePreviewActionsEnum } from '../../models/non-responsive-preview-actions.enum';

@Component({
    selector: 'adf-non-responsive-dialog',
    templateUrl: './non-responsive-dialog.component.html',
})
export class NonResponsiveDialogComponent {
    NonResponsivePreviewActionsEnum = NonResponsivePreviewActionsEnum;
    constructor() {}
}
