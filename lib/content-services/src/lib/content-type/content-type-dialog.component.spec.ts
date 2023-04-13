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

import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { ContentTestingModule } from '../testing/content.testing.module';
import { ContentTypeDialogComponent } from './content-type-dialog.component';
import { ContentTypeService } from './content-type.service';
import { ContentTypeDialogComponentData } from './content-type-metadata.interface';
import { TypeEntry } from '@alfresco/js-api';

const elementCustom: TypeEntry = {
    entry: {
        id: 'ck:pippobaudo',
        title: 'PIPPO-BAUDO',
        model: { id: 'what', namespacePrefix: 'ck' },
        description: 'Doloro reaepgfihawpefih peahfa powfj p[qwofhjaq[ fq[owfj[qowjf[qowfgh[qowh f[qowhfj [qwohf',
        parentId: 'cm:content',
        properties: [
            {
                id: 'lm:PropA',
                dataType: 'lm:notshowed',
                defaultValue: 'I NEVER show uP',
                description: 'A inherited property',
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                title: 'PropertyHidden'
            },
            {
                id: 'ck:PropA',
                dataType: 'ck:propA',
                defaultValue: 'HERE I AM',
                description: 'A property',
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                title: 'PropertyA'
            },
            {
                id: 'ck:PropB',
                dataType: 'ck:propB',
                defaultValue: 'HERE I AM',
                description: 'A property',

                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                title: 'PropertyB'
            },
            {
                id: 'ck:PropC',
                dataType: 'ck:propC',
                defaultValue: 'HERE I AM',
                description: 'A property',
                isMandatory: false,
                isMandatoryEnforced: false,
                isMultiValued: false,
                title: 'PropertyC'
            }
        ]
    }
};

describe('Content Type Dialog Component', () => {
    let fixture: ComponentFixture<ContentTypeDialogComponent>;
    let contentTypeService: ContentTypeService;
    let data: ContentTypeDialogComponentData;

    beforeEach(async () => {
        data = {
            title: 'Title',
            description: 'Description that can be longer or shorter',
            nodeType: 'fk:fakeNode',
            confirmMessage: 'Do you want to jump? Y/N',
            select: new Subject<boolean>()
        };

        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot(),
                ContentTestingModule,
                MatDialogModule
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                {
                    provide: MatDialogRef,
                    useValue: {
                        keydownEvents: () => of(null),
                        backdropClick: () => of(null),
                        close: jasmine.createSpy('close')
                    }
                }
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        contentTypeService = TestBed.inject(ContentTypeService);
        spyOn(contentTypeService, 'getContentTypeByPrefix').and.returnValue(of(elementCustom));
        fixture = TestBed.createComponent(ContentTypeDialogComponent);
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should show basic information for the dialog', () => {
        const dialogTitle = fixture.nativeElement.querySelector('[data-automation-id="content-type-dialog-title"]');
        expect(dialogTitle).not.toBeNull();
        expect(dialogTitle.innerText).toBe(data.title);

        const description = fixture.nativeElement.querySelector('[data-automation-id="content-type-dialog-description"]');
        expect(description).not.toBeNull();
        expect(description.innerText).toBe(data.description);

        const confirmMessage = fixture.nativeElement.querySelector('[data-automation-id="content-type-dialog-confirm-message"]');
        expect(confirmMessage).not.toBeNull();
        expect(confirmMessage.innerText).toBe(data.confirmMessage);

    });

    it('should complete the select stream Cancel button is clicked', (done) => {
        data.select.subscribe(() => { }, () => { }, () => done());
        const cancelButton: HTMLButtonElement = fixture.nativeElement.querySelector('#content-type-dialog-actions-cancel');
        expect(cancelButton).toBeDefined();
        cancelButton.click();
        fixture.detectChanges();
    });

    it('should show the property with the aspect prefix not the inherited ones', async () => {
        const showPropertyAccordon: HTMLButtonElement = fixture.nativeElement.querySelector('.adf-content-type-accordion .mat-expansion-panel-header');
        expect(showPropertyAccordon).toBeDefined();
        showPropertyAccordon.click();
        fixture.detectChanges();
        await fixture.whenStable();
        const propertyShowed: NodeList = fixture.nativeElement.querySelectorAll('.adf-content-type-table .mat-row');
        expect(propertyShowed.length).toBe(3);
    });

    it('should emit true when apply is clicked', (done) => {
        data.select.subscribe((value) => {
            expect(value).toBe(true);
         }, () => { }, () => done());
        const applyButton: HTMLButtonElement = fixture.nativeElement.querySelector('#content-type-dialog-apply-button');
        expect(applyButton).toBeDefined();
        applyButton.click();
        fixture.detectChanges();
    });

});
