// eslint-disable-next-line no-shadow
export enum PluginTarget {
    processService = 'processService',
    processAutomation = 'processAutomation',
    governance = 'governance'
}

export interface PluginInterface {
    name: string;
    host: string;
    appName?: string;
    uiName?: string;
}
