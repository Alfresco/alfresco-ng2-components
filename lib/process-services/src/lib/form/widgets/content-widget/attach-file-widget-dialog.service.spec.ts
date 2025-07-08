/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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
import { MatDialog } from '@angular/material/dialog';
import { AttachFileWidgetDialogService } from './attach-file-widget-dialog.service';
import { Subject, of } from 'rxjs';
import { AlfrescoEndpointRepresentation } from '@alfresco/js-api';

describe('AttachFileWidgetDialogService', () => {
    let service: AttachFileWidgetDialogService;
    let materialDialog: MatDialog;
    let spyOnDialogOpen: jasmine.Spy;
    let mockRepository: AlfrescoEndpointRepresentation;

    beforeEach(() => {
        service = TestBed.inject(AttachFileWidgetDialogService);
        materialDialog = TestBed.inject(MatDialog);
        spyOnDialogOpen = spyOn(materialDialog, 'open').and.returnValue({
            afterOpen: () => of({}),
            afterClosed: () => of({}),
            componentInstance: {
                error: new Subject<any>()
            }
        } as any);
        mockRepository = { id: 1, name: 'fake-title', repositoryUrl: 'https://fakeurl.com/alfresco' };
    });

    it('should be able to open the dialog when node has permission', () => {
        service.openLogin(mockRepository, 'fake-action');
        expect(spyOnDialogOpen).toHaveBeenCalled();
    });

    it('should be able to close the material dialog', () => {
        spyOn(materialDialog, 'closeAll');
        service.close();
        expect(materialDialog.closeAll).toHaveBeenCalled();
    });

    it('should attach predicate on dialog opening which accepts only file nodes', () => {
        const spyOnOpenLoginDialog = spyOn(service as any, 'openLoginDialog');

        service.openLogin(mockRepository, 'fake-action');

        expect(spyOnOpenLoginDialog).toHaveBeenCalledTimes(1);
        const actualIsSelectionValid = (spyOnOpenLoginDialog.calls.mostRecent().args[0] as any).isSelectionValid;

        expect(actualIsSelectionValid({ isFile: true, isFolder: false })).toBe(true);
        expect(actualIsSelectionValid({ isFile: false, isFolder: true })).toBe(false);
    });
});
