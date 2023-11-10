/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { SecurityControlSettingBody } from '../model/securityControlSettingBody';
import { SecurityControlSettingEntry } from '../model/securityControlSettingEntry';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * SecurityControlSettingsApi service.
 * @module SecurityControlSettingsApi
 */
export class SecurityControlSettingsApi extends BaseApi {
    /**
     * Get security control setting value
     *
     * @param securityControlSettingKey The key for the security control setting. You can use one of the following settings:
     * -declassificationTimeFrame- for the declassification time frame value set in alfresco-global.properties file
     * @return Promise<SecurityControlSettingEntry>
     */
    getSecurityControlSetting(securityControlSettingKey: string): Promise<SecurityControlSettingEntry> {
        throwIfNotDefined(securityControlSettingKey, 'securityControlSettingKey');

        const pathParams = {
            securityControlSettingKey
        };

        return this.get({
            path: '/security-control-settings/{securityControlSettingKey}',
            pathParams,
            returnType: SecurityControlSettingEntry
        });
    }

    /**
     * Update security control setting value
     *
     * @param securityControlSettingKey The key for the security control setting. You can use one of the following settings:
     * -declassificationTimeFrame- for the declassification time frame value set in alfresco-global.properties file
     * @param securityControlSettingValue The new value for the security control setting. This can be a string or number, depending on the setting key.
     * @return Promise<SecurityControlSettingEntry>
     */
    updateSecurityControlSetting(securityControlSettingKey: string, securityControlSettingValue: SecurityControlSettingBody): Promise<SecurityControlSettingEntry> {
        throwIfNotDefined(securityControlSettingKey, 'securityControlSettingKey');
        throwIfNotDefined(securityControlSettingValue, 'securityControlSettingValue');

        const pathParams = {
            securityControlSettingKey
        };

        return this.put({
            path: '/security-control-settings/{securityControlSettingKey}',
            pathParams,
            bodyParam: securityControlSettingValue,
            returnType: SecurityControlSettingEntry
        });
    }
}
