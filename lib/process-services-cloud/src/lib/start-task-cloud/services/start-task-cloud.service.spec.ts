import { TestBed } from '@angular/core/testing';

import { setupTestBed } from '@alfresco/adf-core';
import { StartTaskCloudService } from './start-task-cloud.service';
import { StartTaskCloudTestingModule } from '../testing/start-task-cloud.testing.module';
import { of, throwError } from 'rxjs';
import { taskDetailsMock, mockUsers } from '../mock/task-details.mock';
import { TaskDetailsCloudModel } from '../models/task-details-cloud.model';
import { HttpErrorResponse } from '@angular/common/http';
import {
    AlfrescoApiService,
    AppConfigService,
    LogService,
    StorageService
} from '@alfresco/adf-core';
import { UserCloudModel } from '../models/user-cloud.model';

describe('StartTaskCloudService', () => {

    let service: StartTaskCloudService;

    setupTestBed({
        imports: [StartTaskCloudTestingModule],
        providers: [StartTaskCloudService, AlfrescoApiService, AppConfigService, LogService, StorageService]
    });

    beforeEach(() => {
        service = TestBed.get(StartTaskCloudService);
    });

    it('should able to create a new task ', (done) => {
        spyOn(service, 'createNewTask').and.returnValue(of({id: 'fake-id', name: 'fake-name'}));
        service.createNewTask(taskDetailsMock).subscribe(
            (res: TaskDetailsCloudModel) => {
                expect(res).toBeDefined();
                expect(res.id).toEqual('fake-id');
                expect(res.name).toEqual('fake-name');
                done();
            }
        );
    });

    it('Should not able to create a task if error occurred', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'createNewTask').and.returnValue(throwError(errorResponse));
        service.createNewTask(taskDetailsMock)
            .subscribe(
                users => fail('expected an error, not applications'),
                error => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                }
            );
    });

    it('should able to fetch users ', (done) => {
        spyOn(service, 'getUsers').and.returnValue(of(mockUsers));
        service.getUsers().subscribe(
            (res: UserCloudModel[]) => {
                expect(res).toBeDefined();
                expect(res[0].id).toEqual('fake-id-1');
                expect(res[0].username).toEqual('first-name-1 last-name-1');
                expect(res[1].id).toEqual('fake-id-2');
                expect(res[1].username).toEqual('first-name-2 last-name-2');
                expect(res[2].id).toEqual('fake-id-3');
                expect(res[2].username).toEqual('first-name-3 last-name-3');
                done();
            }
        );
    });

    it('Should not fetch users if error occurred', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'Mock Error',
            status: 404, statusText: 'Not Found'
        });

        spyOn(service, 'getUsers').and.returnValue(throwError(errorResponse));
        service.getUsers()
            .subscribe(
                users => fail('expected an error, not users'),
                error => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('Mock Error');
                }
            );
    });

});
