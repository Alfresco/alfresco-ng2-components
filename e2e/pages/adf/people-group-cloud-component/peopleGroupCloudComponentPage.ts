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

import { by, element } from 'protractor';
import { Util } from '../../util/util';

export class PeopleGroupCloudComponentPage {

    peopleCloudSingleSelection = element(by.css('mat-radio-button[id="mat-radio-2"]'));
    peopleCloudMultipleSelection = element(by.css('mat-radio-button[id="mat-radio-3"]'));
    groupCloudSingleSelection = element(by.css('mat-radio-button[id="mat-radio-5"]'));
    groupCloudMultipleSelection = element(by.css('mat-radio-button[id="mat-radio-6"]'));
    peopleRoleInput = element(by.css('input[id="mat-input-6"]'));
    peoplePreselect = element(by.css('input[id="mat-input-7"]'));
    groupRoleInput = element(by.css('input[id="mat-input-8"]'));
    groupPreselect = element(by.css('input[id="mat-input-9"]'));
    peopleCloudSearch = element(by.css('input[data-automation-id="adf-people-cloud-search-input"]'));
    groupCloudSearcgh = element(by.css('input[data-automation-id="adf-cloud-group-search-input"]'));
}
