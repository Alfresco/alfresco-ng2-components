import { Injectable } from '@angular/core';
import { IdentityGroupCountModel, IdentityGroupModel, IdentityGroupQueryCloudRequestModel, IdentityGroupQueryResponse, IdentityGroupSearchParam, IdentityRoleModel, mockIdentityGroups, mockIdentityRoles } from '@alfresco/adf-core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

Injectable({ providedIn: 'root' });
export class IdentityGroupServiceMock {

    getGroups(): Observable<IdentityGroupModel[]> {
        return of(mockIdentityGroups);
    }

    getAvailableRoles(_groupId: string): Observable<IdentityRoleModel[]> {
        return of (mockIdentityRoles);
    }

    getAssignedRoles(_groupId: string): Observable<IdentityRoleModel[]> {
        return of(mockIdentityRoles);
    }

    assignRoles(_groupId: string, _roles: IdentityRoleModel[]): Observable<any> {
        return of();
    }

    removeRoles(_groupId: string, _roles: IdentityRoleModel[]): Observable<any> {
        return of();
    }

    getEffectiveRoles(_groupId: string): Observable<IdentityRoleModel[]> {
        return of(mockIdentityRoles);
    }

    queryGroups(_requestQuery: IdentityGroupQueryCloudRequestModel): Observable<IdentityGroupQueryResponse> {
        return of();
    }

    getTotalGroupsCount(): Observable<IdentityGroupCountModel> {
        return of({count: mockIdentityGroups.length});
    }

    createGroup(_newGroup: IdentityGroupModel): Observable<any> {
        return of();
    }

    updateGroup(_groupId: string, _updatedGroup: IdentityGroupModel): Observable<any> {
        return of();
    }

    deleteGroup(_groupId: string): Observable<any> {
        return of();
    }

    findGroupsByName(_searchParams: IdentityGroupSearchParam): Observable<IdentityGroupModel[]> {
        return of(mockIdentityGroups);
    }

    getGroupRoles(_groupId: string): Observable<IdentityRoleModel[]> {
        return of(mockIdentityRoles);
    }

    checkGroupHasRole(groupId: string, roleNames: string[]): Observable<boolean>  {
        return this.getGroupRoles(groupId).pipe(map((groupRoles) => {
            let hasRole = false;
            if (groupRoles && groupRoles.length > 0) {
                roleNames.forEach((roleName: string) => {
                    const role = groupRoles.find(({ name }) => roleName === name);
                    if (role) {
                        hasRole = true;
                        return;
                    }
                });
            }
            return hasRole;
        }));
    }

    getClientIdByApplicationName(_applicationName: string): Observable<string> {
        return of('fake-client-id');
    }

    getClientRoles(_groupId: string, _clientId: string): Observable<IdentityRoleModel[]> {
        return of(mockIdentityRoles);
    }

    checkGroupHasClientApp(groupId: string, clientId: string): Observable<boolean> {
        return this.getClientRoles(groupId, clientId).pipe(
            map((response) => response && response.length > 0)
        );
    }

    checkGroupHasAnyClientAppRole(groupId: string, clientId: string, roleNames: string[]): Observable<boolean> {
        return this.getClientRoles(groupId, clientId).pipe(
            map((clientRoles: any[]) => {
                let hasRole = false;
                if (clientRoles.length > 0) {
                    roleNames.forEach((roleName) => {
                        const role = clientRoles.find(({ name }) => name === roleName);

                        if (role) {
                            hasRole = true;
                            return;
                        }
                    });
                }
                return hasRole;
            })
        );
    }
}
