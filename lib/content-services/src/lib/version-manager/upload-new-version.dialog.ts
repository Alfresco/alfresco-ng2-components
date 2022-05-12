import { MinimalNodeEntryEntity, NodeChildAssociation, Version } from '@alfresco/js-api';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface UploadNewVersionDialogData {
    title?: string;
    node: MinimalNodeEntryEntity;
    file?: File;
    currentVersion?: Version;
    showVersionsOnly?: boolean;
}

export interface VersionManagerData {
    newVersion: Node;
    currentVersion: NodeChildAssociation;
}
@Component({
  selector: 'adf-upload-new-version',
  templateUrl: './upload-new-version.dialog.html',
  styleUrls: ['./upload-new-version.dialog.scss']
})
export class UploadNewVersionDialogComponent implements OnInit {

  @Output()
  uploadedNewVersion = new EventEmitter<VersionManagerData>();

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: UploadNewVersionDialogData,
      private dialogRef: MatDialogRef<UploadNewVersionDialogComponent>
   ) {}

  ngOnInit(): void {
  }

  handleUpload(newFileVersion){
      this.uploadedNewVersion.emit({newVersion: newFileVersion.value.entry, currentVersion: this.data.node});
      this.dialogRef.close();
  }

  handleCancel(){
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
