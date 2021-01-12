import { PluginInterface } from './plugin-model';
import { GovernanceHealth } from './governance-health';

export class GovernanceCheckPlugin {
    governanceHealth: GovernanceHealth;
    constructor(
        private pluginInfo: PluginInterface,
        private alfrescoJsApi: any
    ) {
        this.governanceHealth = new GovernanceHealth(this.alfrescoJsApi);
    }

    async checkRecordManagement() {
        let pluginStatus;

        const isAvailable = await this.governanceHealth.isRecordManagementAvailable();
        if (!isAvailable) {
            await this.governanceHealth.createRecordManagementSite();
            pluginStatus = [{ PluginName: this.pluginInfo.name, Status: 'Active', RecordManagement: 'Created'}];
            console.table(pluginStatus);
        } else {
            pluginStatus = [{ PluginName: this.pluginInfo.name, Status: 'Active', RecordManagement: 'Available' }];
            console.table(pluginStatus);
        }
    }
}
