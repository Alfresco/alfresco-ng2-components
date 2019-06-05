/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { TestBed } from '@angular/core/testing';
import { ContentCloudNodeSelectorService } from './content-cloud-node-selector.service';
import { MatDialog } from '@angular/material';
import { setupTestBed, CoreModule, AlfrescoApiService, AlfrescoApiServiceMock } from '@alfresco/adf-core';
import { of } from 'rxjs/internal/observable/of';
import { Subject } from 'rxjs/internal/Subject';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ContentCloudNodeSelectorService', () => {

  let service: ContentCloudNodeSelectorService;
  let materialDialog: MatDialog;
  let spyOnDialogOpen: jasmine.Spy;

  setupTestBed({
      imports: [
        NoopAnimationsModule,
        CoreModule.forRoot()
      ],
      providers: [
        { provide: AlfrescoApiService, useValue: AlfrescoApiServiceMock }
    ]
  });

  beforeEach(() => {
      service = TestBed.get(ContentCloudNodeSelectorService);
      materialDialog = TestBed.get(MatDialog);
      spyOnDialogOpen = spyOn(materialDialog, 'open').and.returnValue({
          afterOpen: () => of({}),
          afterClosed: () => of({}),
          componentInstance: {
              error: new Subject<any>()
          }
      });
  });

  it('should be able to create the service', () => {
      expect(service).not.toBeNull();
      expect(service).toBeDefined();
  });

  it('should be able to open the dialog', () => {
      service.openUploadFileDialog('fake-host');
      expect(spyOnDialogOpen).toHaveBeenCalled();
  });

  it('should be able to close the material dialog', () => {
      spyOn(materialDialog, 'closeAll');
      service.close();
      expect(materialDialog.closeAll).toHaveBeenCalled();
  });

});
