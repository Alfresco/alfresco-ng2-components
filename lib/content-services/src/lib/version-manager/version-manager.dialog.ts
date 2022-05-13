import { MinimalNodeEntryEntity, NodeChildAssociation, Version } from '@alfresco/js-api';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface VersionManagerDialogData {
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
  selector: 'adf-version-manager-dialog',
  templateUrl: './version-manager.dialog.html',
  styleUrls: ['./version-manager.dialog.scss']
})
export class VersionManagerDialogComponent implements OnInit {

  @Output()
  uploadedNewVersion = new EventEmitter<VersionManagerData>();

  @Output()
  uploadError = new EventEmitter<any>();

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: VersionManagerDialogData,
      private dialogRef: MatDialogRef<VersionManagerDialogComponent>
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

  onUploadError(error){
      this.uploadError.emit(error);
      this.dialogRef.close();
  }

  onViewingVersion(event){
      console.log(`%conViewingVersion => ${event}`);
  }

  refresh(event){
      console.log(`%crefresh => ${event}`);
  }

}
