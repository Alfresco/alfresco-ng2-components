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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreTestingModule } from '../../testing/core.testing.module';
import { setupTestBed } from '../../testing/setup-test-bed';
import { AboutApplicationModulesComponent } from './about-application-modules.component';
import { MatTableModule } from '@angular/material/table';
import { DataTableModule } from '../../datatable/datatable.module';
import { mockDependencies, mockPlugins } from '../about.mock';

describe('AboutApplicationModulesComponent', () => {
    let fixture: ComponentFixture<AboutApplicationModulesComponent>;
    let component: AboutApplicationModulesComponent;

    setupTestBed({
        imports: [CoreTestingModule, MatTableModule, DataTableModule]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AboutApplicationModulesComponent);
        component = fixture.componentInstance;
        component.dependencies = mockDependencies;
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('Should display title', () => {
        const titleElement = fixture.nativeElement.querySelector('[data-automation-id="adf-about-modules-title"]');
        expect(titleElement.innerText).toEqual('ABOUT.PACKAGES.TITLE');
    });

    it('should display dependencies', async() => {
        fixture.detectChanges();
        await fixture.whenStable();
        const dataTable =  fixture.nativeElement.querySelector('.adf-datatable');

        const depOne =  fixture.nativeElement.querySelector('[data-automation-id="text_@alfresco/mock-core"]');
        const depTwo =  fixture.nativeElement.querySelector('[data-automation-id="text_@alfresco/mock-services"]');
        const depVersionOne =  fixture.nativeElement.querySelector('[data-automation-id="text_3.7.0"]');
        const depVersionTwo =  fixture.nativeElement.querySelector('[data-automation-id="text_2.0.0"]');

        expect(dataTable).not.toBeNull();

        expect(depOne.innerText).toEqual('@alfresco/mock-core');
        expect(depTwo.innerText).toEqual('@alfresco/mock-services');

        expect(depVersionOne.innerText).toEqual('3.7.0');
        expect(depVersionTwo.innerText).toEqual('2.0.0');
    });

    it('should display extensions', async() => {
        component.extensions = mockPlugins;
        fixture.detectChanges();
        await fixture.whenStable();
        const dataTable =  fixture.nativeElement.querySelector('.mat-table');
        const nameColumn =  fixture.nativeElement.querySelector('.mat-column--name');
        const versionColumn =  fixture.nativeElement.querySelector('.mat-column--version');
        const licenseColumn =  fixture.nativeElement.querySelector('.mat-column--license');
        const nameRows =  fixture.nativeElement.querySelector('.mat-row .mat-column--name');
        const versionRows =  fixture.nativeElement.querySelector('.mat-row .mat-column--version');
        const licenseRows =  fixture.nativeElement.querySelector('.mat-row .mat-column--license');

        expect(dataTable).not.toBeNull();

        expect(versionColumn.innerText).toEqual('ABOUT.EXTENSIONS.TABLE_HEADERS.VERSION');
        expect(nameColumn.innerText).toEqual('ABOUT.EXTENSIONS.TABLE_HEADERS.NAME');
        expect(licenseColumn.innerText).toEqual('ABOUT.EXTENSIONS.TABLE_HEADERS.LICENSE');

        expect(nameRows.innerText).toEqual('plugin1');
        expect(versionRows.innerText).toEqual('1.0.0');
        expect(licenseRows.innerText).toEqual('MockLicense-2.0');
    });

    it('should not display extensions if showExtensions set to false ', async() => {
        component.extensions = mockPlugins;
        component.showExtensions = false;
        fixture.detectChanges();
        await fixture.whenStable();
        const dataTable =  fixture.nativeElement.querySelector('.mat-table');
        const nameColumn =  fixture.nativeElement.querySelector('.mat-column--name');
        const nameRows =  fixture.nativeElement.querySelector('.mat-row .mat-column--name');

        expect(dataTable).toBeNull();
        expect(nameColumn).toBeNull();
        expect(nameRows).toBeNull();
    });
});
