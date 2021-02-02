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
