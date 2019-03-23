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

import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { setupTestBed, CoreModule, AlfrescoApiServiceMock,  AlfrescoApiService } from '@alfresco/adf-core';

import { fakeApplicationInstance } from '../mock/app-model.mock';
import { AppListCloudComponent } from './app-list-cloud.component';
import { AppsProcessCloudService } from '../services/apps-process-cloud.service';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { AppListCloudModule } from '../app-list-cloud.module';

describe('AppListCloudComponent', () => {

    let component: AppListCloudComponent;
    let fixture: ComponentFixture<AppListCloudComponent>;
    let alfrescoApiService: AlfrescoApiService;

    const mock = {
            oauth2Auth: {
                callCustomApi: () => Promise.resolve(fakeApplicationInstance)
            }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CoreModule.forRoot(), ProcessServiceCloudTestingModule, AppListCloudModule],
            providers: [
                AppsProcessCloudService,
                {provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock}
            ]
          })
          .overrideComponent(AppListCloudComponent, {
            set: {
              providers: [
                { provide: AlfrescoApiService, useClass: AlfrescoApiServiceMock }
              ]
            }
          }).compileComponents();

        fixture = TestBed.createComponent(AppListCloudComponent);
        component = fixture.componentInstance;
        alfrescoApiService = TestBed.get(AlfrescoApiService);

        spyOn(alfrescoApiService, 'getInstance').and.returnValue(mock);
    });

    it('should create AppListCloudComponent ', async(() => {
        expect(component instanceof AppListCloudComponent).toBe(true);
    }));

});

@Component({
    template: `
    <adf-cloud-app-list>
        <adf-custom-empty-content>
            <mat-icon>apps</mat-icon>
            <p id="custom-id">No Apps Found</p>
        </adf-custom-empty-content>
    </adf-cloud-app-list>
       `
})
class CustomEmptyAppListCloudTemplateComponent {
}

describe('Custom CustomEmptyAppListCloudTemplateComponent', () => {
    let fixture: ComponentFixture<CustomEmptyAppListCloudTemplateComponent>;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule],
        declarations: [CustomEmptyAppListCloudTemplateComponent],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomEmptyAppListCloudTemplateComponent);
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('should render the custom empty template', async(() => {
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const title: any =  fixture.nativeElement.querySelector('#custom-id');
            expect(title.innerText).toBe('No Apps Found');
        });
    }));
});
