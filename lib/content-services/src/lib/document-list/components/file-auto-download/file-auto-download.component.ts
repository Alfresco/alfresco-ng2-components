import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FileAutoDownloadActionsEnum } from '../../models/file-auto-download-actions.enum';

@Component({
  selector: 'adf-file-auto-download',
  templateUrl: './file-auto-download.component.html',
  styleUrls: ['./file-auto-download.component.scss']
})
export class FileAutoDownloadComponent {

    constructor(private dialogRef: MatDialogRef<FileAutoDownloadComponent>) {}

    onCancel() {
        this.dialogRef.close(FileAutoDownloadActionsEnum.CANCEL);
    }

    onDownload() {
        this.dialogRef.close(FileAutoDownloadActionsEnum.DOWNLOAD);
    }

}
