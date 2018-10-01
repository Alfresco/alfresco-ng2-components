/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { ContentTestingModule } from '../testing/content.testing.module';
import { setupTestBed, CoreModule, SharedLinksApiService } from '@alfresco/adf-core';
import { ContentNodeShareModule } from './content-node-share.module';

@Component({
    selector: 'adf-node-share-test-component',
    template: `
       <button
            [disabled]="!shareRef.isFile"
            #shareRef="adfShare"
            [baseShareUrl]="baseShareUrl"
            [adf-share]="documentList.selection[0]"
            [title]="shareRef.isShared ? 'Shared' : 'Not Shared'">
        </button>
    `
})
class NodeShareTestComponent {
    baseShareUrl = 'some-url/';
    documentList = {
        selection: []
    };
}

describe('NodeSharedDirective', () => {
    let fixture: ComponentFixture<NodeShareTestComponent>;
    let component: NodeShareTestComponent;
    let document: any;
    let shareButtonElement;
    let selection;

    setupTestBed({
        imports: [
            NoopAnimationsModule,
            CoreModule.forRoot(),
            ContentTestingModule,
            ContentNodeShareModule
        ],
        declarations: [
            NodeShareTestComponent
        ],
        providers: [
            SharedLinksApiService
        ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NodeShareTestComponent);
        document = TestBed.get(DOCUMENT);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    beforeEach(() => {
        shareButtonElement = fixture.debugElement.query(By.css('button')).nativeElement;
        selection = {
            entry: {
                isFile: true,
                properties: {}
            }
        };
    });

    it('should have share button disabled when selection is empty', async() => {
        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(shareButtonElement.disabled).toBe(true);
        });
    });

    it('should have button enabled when selection is not empty', () => {
        component.documentList.selection = [selection];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(shareButtonElement.disabled).toBe(false);
        });
    });

    it('should have button disabled when selection is not a file', () => {
        selection.entry.isFile = false;
        component.documentList.selection = [selection];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(shareButtonElement.disabled).toBe(true);
        });
    });

    it('should indicate if file is not shared', () => {
        component.documentList.selection = [selection];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(shareButtonElement.title).toBe('Not Shared');
        });
    });

    it('should indicate if file is already shared', () => {
        selection.entry.properties['qshare:sharedId'] = 'someId';
        component.documentList.selection = [selection];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();
            expect(shareButtonElement.title).toBe('Shared');
        });
    });

    it('should open share dialog on click event', () => {
        selection.entry.properties['qshare:sharedId'] = 'someId';
        component.documentList.selection = [selection];
        fixture.detectChanges();

        fixture.whenStable().then(() => {
            fixture.detectChanges();

            shareButtonElement.click();
            fixture.detectChanges();

            expect(document.querySelector('.adf-share-link-dialog')).not.toBe(null);
        });
    });
});
