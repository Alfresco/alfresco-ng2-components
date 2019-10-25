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

 /* spellchecker: disable */
export class AllowableOperationsEnum extends String {
    static DELETE: string = 'delete';
    static UPDATE: string = 'update';
    static CREATE: string = 'create';
    static COPY: string = 'copy';
    static LOCK: string = 'lock';
    static UPDATEPERMISSIONS: string = 'updatePermissions';
    static NOT_DELETE: string = '!delete';
    static NOT_UPDATE: string = '!update';
    static NOT_CREATE: string = '!create';
    static NOT_UPDATEPERMISSIONS: string = '!updatePermissions';
}
