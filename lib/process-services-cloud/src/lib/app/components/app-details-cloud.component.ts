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

import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ApplicationInstanceModel, DEFAULT_APP_INSTANCE_ICON, DEFAULT_APP_INSTANCE_THEME } from '../models/application-instance.model';

@Component({
  selector: 'adf-cloud-app-details',
  templateUrl: './app-details-cloud.component.html',
  styleUrls: ['./app-details-cloud.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppDetailsCloudComponent {

  @Input()
  applicationInstance: ApplicationInstanceModel;

  @Output()
  selectedApp = new EventEmitter<ApplicationInstanceModel>();

  /**
   * Pass the selected app as next
   *
   * @param app
   */
  onSelectApp(app: ApplicationInstanceModel): void {
    this.selectedApp.emit(app);
  }

  getTheme(): string {
    return this.applicationInstance.theme || DEFAULT_APP_INSTANCE_THEME;
  }

  getIcon(): string {
    return this.applicationInstance.icon || DEFAULT_APP_INSTANCE_ICON;
  }
}
