import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationInstanceModel } from '../models/application-instance.model';

@Component({
  selector: 'adf-cloud-app-details',
  templateUrl: './app-details-cloud.component.html',
  styleUrls: ['./app-details-cloud.component.scss']
})

export class AppDetailsCloudComponent {

  @Input()
  applicationInstance: ApplicationInstanceModel;

  @Output()
  selectedApp: EventEmitter<ApplicationInstanceModel> = new EventEmitter<ApplicationInstanceModel>();

  constructor() {}

  /**
   * Pass the selected app as next
   * @param app
   */
  public onSelectApp(app: ApplicationInstanceModel): void {
    this.selectedApp.emit(app);
  }
}
