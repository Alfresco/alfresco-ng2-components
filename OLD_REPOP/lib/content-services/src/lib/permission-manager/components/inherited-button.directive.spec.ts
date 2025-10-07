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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContentTestingModule } from '../../testing/content.testing.module';
import { NodesApiService } from '../../common/services/nodes-api.service';
import { Component } from '@angular/core';
import { InheritPermissionDirective } from './inherited-button.directive';
import { NgIf } from '@angular/common';

const fakeNodeWithInherit: any = { id: 'fake-id', permissions: { isInheritanceEnabled: true }, allowableOperations: ['updatePermissions'] };
const fakeNodeNoInherit: any = { id: 'fake-id', permissions: { isInheritanceEnabled: false }, allowableOperations: ['updatePermissions'] };
const fakeNodeWithInheritNoPermission: any = { id: 'fake-id', permissions: { isInheritanceEnabled: true } };

@Component({
    template: `
        <button id="sample-button-permission" adf-inherit-permission [nodeId]="nodeId" (updated)="onUpdate($event)">PERMISSION</button>
        <span id="update-notification" *ngIf="updatedNode"> NODE UPDATED </span>
    `,
    standalone: true,
    imports: [InheritPermissionDirective, NgIf]
})
class SimpleInheritedPermissionTestComponent {
    message: string = '';
    nodeId: string = 'fake-node-id';
    updatedNode: boolean = false;

    constructor() {}

    onUpdate(node: any) {
        this.updatedNode = node.permissions?.isInheritanceEnabled ?? false;
    }
}

describe('InheritPermissionDirective', () => {
    let fixture: ComponentFixture<SimpleInheritedPermissionTestComponent>;
    let element: HTMLElement;
    let component: SimpleInheritedPermissionTestComponent;
    let nodeService: NodesApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ContentTestingModule, SimpleInheritedPermissionTestComponent]
        });
        fixture = TestBed.createComponent(SimpleInheritedPermissionTestComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        nodeService = TestBed.inject(NodesApiService);
    });

    it('should be able to render the simple component', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#sample-button-permission')).not.toBeNull();
        expect(element.querySelector('#update-notification')).toBeNull();
    });

    it('should be able to add inherited permission', async () => {
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeNoInherit));
        spyOn(nodeService, 'updateNode').and.callFake((_, nodeBody) => {
            if (nodeBody.permissions?.isInheritanceEnabled) {
                return of(fakeNodeWithInherit);
            } else {
                return of(fakeNodeNoInherit);
            }
        });
        fixture.detectChanges();
        await fixture.whenStable();

        const buttonPermission = element.querySelector<HTMLButtonElement>('#sample-button-permission');
        expect(buttonPermission).not.toBeNull();
        expect(element.querySelector('#update-notification')).toBeNull();
        buttonPermission.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#update-notification')).not.toBeNull();
    });

    it('should be able to remove inherited permission', async () => {
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithInherit));
        spyOn(nodeService, 'updateNode').and.callFake((_, nodeBody) => {
            if (nodeBody.permissions?.isInheritanceEnabled) {
                return of(fakeNodeWithInherit);
            } else {
                return of(fakeNodeNoInherit);
            }
        });
        component.updatedNode = true;

        fixture.detectChanges();
        await fixture.whenStable();

        const buttonPermission = element.querySelector<HTMLButtonElement>('#sample-button-permission');
        expect(buttonPermission).not.toBeNull();
        expect(element.querySelector('#update-notification')).not.toBeNull();
        buttonPermission.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(element.querySelector('#update-notification')).toBeNull();
    });

    it('should not update the node when node has no permission', async () => {
        spyOn(nodeService, 'getNode').and.returnValue(of(fakeNodeWithInheritNoPermission));
        const spyUpdateNode = spyOn(nodeService, 'updateNode');
        component.updatedNode = true;

        fixture.detectChanges();
        await fixture.whenStable();

        const buttonPermission = element.querySelector<HTMLButtonElement>('#sample-button-permission');
        expect(buttonPermission).not.toBeNull();
        expect(element.querySelector('#update-notification')).not.toBeNull();
        buttonPermission.click();

        fixture.detectChanges();
        await fixture.whenStable();

        expect(spyUpdateNode).not.toHaveBeenCalled();
    });
});
