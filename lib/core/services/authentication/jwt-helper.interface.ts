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

export interface JwtHelper {
    decodeToken(token): any;
    urlBase64Decode(token): string;
    getValueFromLocalToken<T>(key: string): T;
    getValueFromLocalAccessToken<T>(key: string): T;
    getAccessToken(): string;
    getValueFromLocalIdToken<T>(key: string): T;
    getIdToken(): string;
    getValueFromToken<T>(token: string, key: string): T;
    getRealmRoles(): string[];
    getClientRoles(clientName: string): string[];
    hasRealmRole(role: string): boolean;
    hasRealmRoles(rolesToCheck: string []): boolean;
    hasRealmRolesForClientRole(clientName: string, rolesToCheck: string []): boolean;
    hasClientRole(clientName: string, role: string): boolean;
}
