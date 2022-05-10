import { MinimalNodeEntryEntity, Version } from '@alfresco/js-api';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface UploadNewVersionDialogData {
    title?: string;
    node: MinimalNodeEntryEntity;
    file?: File;
    currentVersion?: Version;
    showVersionsOnly?: boolean;
  }

@Component({
  selector: 'adf-upload-new-version',
  templateUrl: './upload-new-version.dialog.html',
  styleUrls: ['./upload-new-version.dialog.scss']
})
export class UploadNewVersionDialogComponent implements OnInit {

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: UploadNewVersionDialogData,
      private dialogRef: MatDialogRef<UploadNewVersionDialogComponent>
   ) {}

  ngOnInit(): void {
  }

  handleUpload(event){
      console.log(`%chandleUpload => ${event}`, 'color: orange');
  }

  handleCancel(){
      console.log(`%chandleCancel`, 'color: yellow');
      this.dialogRef.close();
  }

  onUploadError(event){
      console.log(`%conUploadError => ${event}`, 'color: red');
  }

  onViewingVersion(event){
      console.log(`%conViewingVersion => ${event}`, 'color: red');
  }

  refresh(event){
      console.log(`%crefresh => ${event}`, 'color: azure');
  }

}
