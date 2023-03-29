import { Component } from '@angular/core';
import { FileAutoDownloadActionsEnum } from '../../models/file-auto-download-actions.enum';

@Component({
  selector: 'adf-file-auto-download',
  templateUrl: './file-auto-download.component.html',
})
export class FileAutoDownloadComponent {
    FileAutoDownloadActionsEnum = FileAutoDownloadActionsEnum;
    constructor() {}
}
