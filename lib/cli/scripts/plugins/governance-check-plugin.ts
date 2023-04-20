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

import { PluginInterface } from './plugin-model';
import { GovernanceHealth } from './governance-health';

export class GovernanceCheckPlugin {
    governanceHealth: GovernanceHealth;
    constructor(
        private pluginInfo: PluginInterface,
        private alfrescoJsApi: any
    ) {
        this.governanceHealth = new GovernanceHealth(this.pluginInfo, this.alfrescoJsApi);
    }

    async checkRecordManagement() {
        const isAvailable = await this.governanceHealth.isRecordManagementAvailable();
        if (!isAvailable) {
            await this.governanceHealth.createRecordManagementSite();
        }
    }
}
