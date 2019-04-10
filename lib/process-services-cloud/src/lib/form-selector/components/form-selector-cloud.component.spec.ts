import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlfrescoApiService, AppConfigService, IdentityUserModel, IdentityUserService, LogService, setupTestBed, StorageService, UserPreferencesService } from '@alfresco/adf-core';
import { ProcessServiceCloudTestingModule } from '../../testing/process-service-cloud.testing.module';
import { StartTaskCloudTestingModule } from '../../task/start-task/testing/start-task-cloud.testing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of} from 'rxjs';
import {FormSelectorCloudComponent} from './form-selector-cloud.component'
import { FormListService } from '../../../..';

describe('FormSelectorCloudComponent', () => {

    let fixture: ComponentFixture<FormSelectorCloudComponent>;
    let service: FormListService;
    let identityService: IdentityUserService;
    let element: HTMLElement;
    let getFormsSpy: jasmine.Spy;

    setupTestBed({
        imports: [ProcessServiceCloudTestingModule, StartTaskCloudTestingModule],
        providers: [FormListService, AlfrescoApiService, AppConfigService, LogService, StorageService, UserPreferencesService],
        schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    });

    beforeEach(async(() => {
        fixture = TestBed.createComponent(FormSelectorCloudComponent);
        element = fixture.nativeElement;
        service = TestBed.get(FormListService);
        identityService = TestBed.get(IdentityUserService);
        getFormsSpy = spyOn(service, 'getForms').and.returnValue(of([{id: 'fake-form', name: 'fakeForm'}]));
        spyOn(identityService, 'getCurrentUserInfo').and.returnValue(new IdentityUserModel({username: 'currentUser', firstName: 'Test', lastName: 'User'}));
        fixture.detectChanges();
    }));

    it('should load the forms by default', async(() => {
        fixture.detectChanges();
        expect(getFormsSpy).toHaveBeenCalled();
    }));

    it('should not preselect any form by default', () => {
        fixture.detectChanges();
        const formInput = element.querySelector('mat-select');
        expect(formInput).toBeDefined();
        expect(formInput.nodeValue).toBeNull();
    });

});

