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

import { Injectable } from '@angular/core';
import { EMPTY, forkJoin, Observable, of, zip } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppConfigService } from '../app-config/app-config.service';
import {
    IdentityGroupSearchParam,
    IdentityGroupQueryCloudRequestModel,
    IdentityGroupModel,
    IdentityGroupQueryResponse,
    IdentityGroupCountModel
} from '../models/identity-group.model';
import { IdentityRoleModel } from '../models/identity-role.model';
// import { IdentityGroupServiceInterface } from './identity-group.interface';
import { OAuth2Service } from './oauth2.service';

@Injectable({ providedIn: 'root' })
export class IdentityGroupService { // implements IdentityGroupServiceInterface {

    constructor(
        private oAuth2Service: OAuth2Service,
        private appConfigService: AppConfigService
    ) {}

    private get identityHost(): string {
        return `${this.appConfigService.get('identityHost')}`;
    }

    /**
     * Gets all groups.
     *
     * @returns Array of group information objects
     */
    getGroups(): Observable<IdentityGroupModel[]> {
        const url = `${this.identityHost}/groups`;
        return this.oAuth2Service.get({ url });
    }

    /**
     * Gets available roles
     *
     * @param groupId Id of the group.
     * @returns Array of available roles information objects
     */
    getAvailableRoles(groupId: string): Observable<IdentityRoleModel[]> {
        const url = `${this.identityHost}/groups/${groupId}/role-mappings/realm/available`;
        return this.oAuth2Service.get({ url });
    }

    /**
     * Gets assigned roles
     *
     * @param groupId Id of the group.
     * @returns Array of available roles
     */
    getAssignedRoles(groupId: string): Observable<IdentityRoleModel[]> {
        const url = `${this.identityHost}/groups/${groupId}/role-mappings/realm`;
        return this.oAuth2Service.get({ url });
    }

    /**
     * Assigns roles to the group
     *
     * @param groupId The ID of the group
     * @param roles Array of roles to assign
     */
    assignRoles(groupId: string, roles: IdentityRoleModel[]): Observable<any> {
        const url = `${this.identityHost}/groups/${groupId}/role-mappings/realm`;
        const bodyParam = JSON.stringify(roles);

        return this.oAuth2Service.post({ url, bodyParam });
    }

    /**
     * Removes roles from the group
     *
     * @param groupId The ID of the group
     * @param roles Array of roles to remove
     */
    removeRoles(groupId: string, roles: IdentityRoleModel[]): Observable<any> {
        const url = `${this.identityHost}/groups/${groupId}/role-mappings/realm`;
        const bodyParam = JSON.stringify(roles);

        return this.oAuth2Service.delete({ url, bodyParam });
    }

    /**
     * Get effective roles
     *
     * @param groupId Id of the group
     * @returns Array of effective roles
     */
    getEffectiveRoles(groupId: string): Observable<IdentityRoleModel[]> {
        const url = `${this.identityHost}/groups/${groupId}/role-mappings/realm/composite`;
        return this.oAuth2Service.get({ url });
    }

    /**
     * Queries groups.
     *
     * @returns Array of user information objects
     */
    queryGroups(requestQuery: IdentityGroupQueryCloudRequestModel): Observable<IdentityGroupQueryResponse> {
        const url = `${this.identityHost}/groups`;
        const queryParams = { first: requestQuery.first || 0, max: requestQuery.max || 5 };

        return this.getTotalGroupsCount().pipe(
            switchMap((totalCount: IdentityGroupCountModel) =>
            this.oAuth2Service.get<any[]>({ url, queryParams }).pipe(
                map((response) => ({
                    entries: response,
                    pagination: {
                        skipCount: requestQuery.first,
                        maxItems: requestQuery.max,
                        count: totalCount.count,
                        hasMoreItems: false,
                        totalItems: totalCount.count
                    }
                } as IdentityGroupQueryResponse))
            ))
        );
    }

    /**
     * Gets groups total count.
     *
     * @returns Number of groups count.
     */
    getTotalGroupsCount(): Observable<IdentityGroupCountModel> {
        const url = `${this.identityHost}/groups/count`;
        return this.oAuth2Service.get({ url });
    }

    /**
     * Creates new group.
     *
     * @param newGroup Object of containing the new group details.
     * @returns Empty response when the group created.
     */
    createGroup(newGroup: IdentityGroupModel): Observable<any> {
        const url = `${this.identityHost}/groups`;
        const bodyParam = newGroup;

        return this.oAuth2Service.post({ url, bodyParam });
    }

    /**
     * Updates group details.
     *
     * @param groupId Id of the targeted group.
     * @param updatedGroup Object of containing the group details
     * @returns Empty response when the group updated.
     */
    updateGroup(groupId: string, updatedGroup: IdentityGroupModel): Observable<any> {
        const url = `${this.identityHost}/groups/${groupId}`;
        const bodyParam = JSON.stringify(updatedGroup);

        return this.oAuth2Service.put({ url, bodyParam });
    }

    /**
     * Deletes Group.
     *
     * @param groupId Id of the group.
     * @returns Empty response when the group deleted.
     */
    deleteGroup(groupId: string): Observable<any> {
        const url = `${this.identityHost}/groups/${groupId}`;
        return this.oAuth2Service.delete({ url });
    }

    /**
     * Finds groups filtered by name.
     *
     * @param searchParams Object containing the name filter string
     * @returns List of group information
     */
    private findGroupsByName(searchParams: IdentityGroupSearchParam): Observable<IdentityGroupModel[]> {
        if (searchParams.name === '') {
            return of([]);
        }
        const url = `${this.identityHost}/groups`;
        const queryParams = { search: searchParams.name };

        return this.oAuth2Service.get({ url, queryParams });
    }

    search(name: string, filters?: { roles: string[]; withinApplication?: string }): Observable<IdentityGroupModel[]> {
        if (name.trim() === '') {
            return of([]);
        } else if (filters?.withinApplication !== undefined && filters?.withinApplication !== '') {
            return this.searchGroupsWithinApp(name, filters.withinApplication, filters.roles);
        } else if (filters?.roles !== undefined && filters?.roles.length > 0) {
            return this.searchGroupsWithGlobalRoles(name, filters.roles);
        } else {
            return this.searchGroupsByName(name);
        }
    }

    private searchGroupsWithGlobalRoles(name: string, roles: string []): Observable<IdentityGroupModel[]> {
         return this.findGroupsByName({name}).pipe(
            switchMap(groups => {
                if (groups?.length > 0) {
                    return forkJoin(groups.map((group) => this.zipGroupWithHasRole(group, roles)));
                } else {
                    return of(EMPTY);
                }
            }),
            map( groupsWithHasRoles => {
                const groupsWithRoles: IdentityGroupModel[] = [];
                groupsWithHasRoles.forEach(groupWithHasRole => {
                    const hasRole = groupWithHasRole[1];
                    const group = groupWithHasRole[0];
                    if (hasRole) {
                        groupsWithRoles.push(group);
                    }
                });
                return groupsWithRoles;
             })
        );
    }

    private searchGroupsWithinApp(name: string, appName: string, roles: string []): Observable<IdentityGroupModel[]> {
        return this.zipGroupsAppClientId(name, appName).pipe(
            switchMap(zipGroupsAppClientId => {
               const groups =  zipGroupsAppClientId[0];
               const appNameClientId =  zipGroupsAppClientId[1];
               if (groups?.length > 0) {
                   return forkJoin(groups.map((group) => this.zipGroupWithinAppWithHasRole(group, appNameClientId, roles)));
               } else {
                   return of(EMPTY);
               }
           }),
           map( groupsWithHasRoles => {
               const groupsWithRoles: IdentityGroupModel[] = [];
               groupsWithHasRoles.forEach(groupWithHasRole => {
                   const hasRole = groupWithHasRole[1];
                   const group = groupWithHasRole[0];
                   if (hasRole) {
                       groupsWithRoles.push(group);
                   }
               });
               return groupsWithRoles;
            })
       );
   }

    private zipGroupWithHasRole(group, roles): any {
        return zip(
            of(group),
            this.checkGroupHasRole(group.id, roles)
        );
    }

    private zipGroupWithinAppWithHasRole(group, appName, roles): any {
        return zip(
            of(group),
            this.checkGroupHasAnyClientAppRole(group.id, appName, roles)
        );
    }

    private zipGroupsAppClientId(name, appName ) {
        return zip(
            this.findGroupsByName({name}),
            this.getClientIdByApplicationName(appName)
        );
    }

    private searchGroupsByName(name: string): Observable<IdentityGroupModel[]> {
        return this.findGroupsByName({name});
    }

    /**
     * Gets details for a specified group.
     *
     * @param groupId Id of the target group
     * @returns Group details
     */
    getGroupRoles(groupId: string): Observable<IdentityRoleModel[]> {
        const url = this.buildRolesUrl(groupId);
        return this.oAuth2Service.get({ url });
    }

    /**
     * Check that a group has one or more roles from the supplied list.
     *
     * @param groupId Id of the target group
     * @param roleNames Array of role names
     * @returns True if the group has one or more of the roles, false otherwise
     */
    checkGroupHasRole(groupId: string, roleNames: string[]): Observable<boolean>  {
        return this.getGroupRoles(groupId).pipe(map((groupRoles) => {
            let hasRole = false;
            if (groupRoles?.length > 0) {
                //  fix the bug to include all  const roleResult = groupRoles.map( (role) =>  role.name).map ( (role) => roleNames.every(roleName => role.includes(roleName))
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

    /**
     * Gets the client Id using the app name.
     *
     * @param applicationName Name of the app
     * @returns client Id string
     */
    getClientIdByApplicationName(applicationName: string): Observable<string> {
        const url = `${this.identityHost}/clients`;
        const queryParams = {clientId: applicationName};

        return this.oAuth2Service.get<any[]>({ url, queryParams }).pipe(
            map((response) => response && response.length > 0 ? response[0].id : '')
        );
    }

    /**
     * Gets client roles.
     *
     * @param groupId Id of the target group
     * @param clientId Id of the client
     * @returns List of roles
     */
    getClientRoles(groupId: string, clientId: string): Observable<IdentityRoleModel[]> {
        const url = `${this.identityHost}/groups/${groupId}/role-mappings/clients/${clientId}`;
        return this.oAuth2Service.get({ url });
    }

    /**
     * Check if a group has any of the client app roles in the supplied list.
     *
     * @param groupId Id of the target group
     * @param clientId Id of the client
     * @param roleNames Array of role names to check
     * @returns True if the group has one or more of the roles, false otherwise
     */
    private checkGroupHasAnyClientAppRole(groupId: string, clientId: string, roleNames: string[]): Observable<boolean> {
        return this.getClientRoles(groupId, clientId).pipe(
            map((clientRoles: any[]) => {
                //  fix the bug to include all  const roleResult = groupRoles.map( (role) =>  role.name).map ( (role) => roleNames.every(roleName => role.includes(roleName))
                if (roleNames?.length > 0) {
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
                } else {
                    return clientRoles?.length > 0;
                }
            })
        );
    }

    private buildRolesUrl(groupId: string): string {
        return `${this.identityHost}/groups/${groupId}/role-mappings/realm/composite`;
    }
}
