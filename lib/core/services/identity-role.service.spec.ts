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

import { setupTestBed } from '@alfresco/adf-core';
import { HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { IdentityRoleResponseModel, IdentityRoleService } from './identity-role.service';

export let mockIdentityRole1 = {
    id: 'mock-id-1', name: 'Mock_Role_1', description: 'Mock desc1',  clientRole: true, composite: false
};

export let mockIdentityRole2 = {
    id: 'mock-id-2', name: 'Mock_Role_2', description: 'Mock desc2', clientRole: false, composite: true
};

export let mockIdentityRole3 = {
    id: 'mock-id-3', name: 'Mock_Role_3', description: 'Mock desc3', clientRole: false, composite: false
};

export let mockIdentityRoles = {
    entries: [
      mockIdentityRole1,  mockIdentityRole2, mockIdentityRole3
    ],
    pagination: {
        skipCount: 1,
        maxItems: 5,
        count: 100,
        hasMoreItems: false,
        totalItems: 100
    }
};

describe('IdentityRoleService', () => {
    let service: IdentityRoleService;

    setupTestBed({
      imports: [
        HttpClientModule
      ]
    });

    beforeEach(() => {
        service = TestBed.get(IdentityRoleService);
    });

    it('Should fetch roles', () => {
        spyOn(service, 'getRoles').and.returnValue(of(mockIdentityRoles));
        service.getRoles().subscribe((response: IdentityRoleResponseModel) => {
            expect(response).toBeDefined();

            expect(response.entries[0]).toEqual(mockIdentityRole1);
            expect(response.entries[1]).toEqual(mockIdentityRole2);
            expect(response.entries[2]).toEqual(mockIdentityRole3);
        });
    });

    it('should be able to add role', (done) => {
        const response = new HttpResponse({
            body: [],
            'status': 201,
            'statusText': 'Created'
        });
        spyOn(service, 'addRole').and.returnValue(of(response));
        service.addRole(mockIdentityRole1).subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res.status).toEqual(201);
                expect(res.statusText).toEqual('Created');
                done();
            }
        );
    });

    it('Should not add role if error occurred', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'test 404 error',
            status: 404, statusText: 'Not Found'
        });
        spyOn(service, 'addRole').and.returnValue(throwError(errorResponse));
        service.addRole(mockIdentityRole1)
            .subscribe(
                () => fail('expected an error'),
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('test 404 error');
                }
            );
    });

    it('should be able to delete role', (done) => {
        const response = new HttpResponse({
            body: [],
            'status': 204,
            'statusText': 'No Content'
        });
        spyOn(service, 'deleteRole').and.returnValue(of(response));
        service.deleteRole(mockIdentityRole1).subscribe(
            (res: any) => {
                expect(res).toBeDefined();
                expect(res.status).toEqual(204);
                expect(res.statusText).toEqual('No Content');
                done();
            }
        );
    });

    it('Should not delete role if error occurred', () => {
        const errorResponse = new HttpErrorResponse({
            error: 'test 404 error',
            status: 404, statusText: 'Not Found'
        });
        spyOn(service, 'deleteRole').and.returnValue(throwError(errorResponse));
        service.deleteRole(mockIdentityRole1)
            .subscribe(
                () => fail('expected an error'),
                (error) => {
                    expect(error.status).toEqual(404);
                    expect(error.statusText).toEqual('Not Found');
                    expect(error.error).toEqual('test 404 error');
                }
            );
    });
});
