import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeopleCloudComponent } from './people-cloud.component';
import { StartTaskCloudTestingModule } from '../../testing/start-task-cloud.testing.module';
import { StartTaskCloudService } from '../../services/start-task-cloud.service';
import { LogService, setupTestBed } from '@alfresco/adf-core';
import { mockUsers } from '../../mock/task-details.mock';
import { mockRoles } from '../../mock/role-cloud.mock';
import { of } from 'rxjs';
// import { UserCloudModel } from './../../models/user-cloud.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('PeopleCloudComponent', () => {
    let component: PeopleCloudComponent;
    let fixture: ComponentFixture<PeopleCloudComponent>;
    let service: StartTaskCloudService;
    let getRolesByUserIdSpy: jasmine.Spy;
    let getUserSpy: jasmine.Spy;

    setupTestBed({
        imports: [StartTaskCloudTestingModule, NoopAnimationsModule],
        providers: [StartTaskCloudService, LogService]
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PeopleCloudComponent);
        component = fixture.componentInstance;
        service = TestBed.get(StartTaskCloudService);
        getRolesByUserIdSpy = spyOn(service, 'getRolesByUserId').and.returnValue(of(mockRoles));
        getUserSpy = spyOn(service, 'getUsers').and.returnValue(of(mockUsers));
        fixture.detectChanges();
    });

    it('should create PeopleCloudComponent', () => {
        expect(component instanceof PeopleCloudComponent).toBeTruthy();
    });

    it('should able to fetch users', () => {
        fixture.detectChanges();
        expect(getUserSpy).toHaveBeenCalled();
    });

    it('should able to fetch roles by user id', () => {
        fixture.detectChanges();
        expect(getRolesByUserIdSpy).toHaveBeenCalled();
    });

    it('should return empty display name for missing model', () => {
        expect(component.getDisplayName(null)).toBe('');
    });

    // it('should return full name for a given model', () => {
    //     let model = <UserCloudModel> { firstName: 'John', lastName: 'Doe'};
    //     expect(component.getDisplayName(model)).toBe('John Doe');
    // });

    // it('should skip first name for display name', () => {
    //     let model = <UserCloudModel> { firstName: null, lastName: 'Doe'};
    //     expect(component.getDisplayName(model)).toBe('Doe');
    // });

    // it('should skip last name for display name', () => {
    //     let model = <UserCloudModel> { firstName: 'John', lastName: null};
    //     expect(component.getDisplayName(model)).toBe('John');
    // });
});
