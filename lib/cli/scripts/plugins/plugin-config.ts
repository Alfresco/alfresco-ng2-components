import { PluginInterface } from './plugin-model';
import { logger } from '../logger';

export class PluginConfiguration {
    constructor(
        private plugInInfo: PluginInterface,
        private alfrescoJsApi: any
    ) {}

    async getAppConfig(url: string) {
        return this.callCustomApi(url);
    }

    async callCustomApi(url: string) {
        const pathParams = {},
            headerParams = {},
            formParams = {},
            bodyParam = {},
            queryParams = {},
            contentTypes = ['application/json'],
            accepts = ['application/json'];
        try {
            const response = await this.alfrescoJsApi.oauth2Auth.callCustomApi(
                url,
                'GET',
                pathParams,
                queryParams,
                headerParams,
                formParams,
                bodyParam,
                contentTypes,
                accepts
            );

            return response;
        } catch (error) {
            logger.error(
                `${this.plugInInfo.host} is not reachable error: `,
                error
            );
            return {};
        }
    }
}
