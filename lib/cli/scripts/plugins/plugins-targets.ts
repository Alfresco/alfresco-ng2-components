export enum PluginTarget {
    processService = 'processService',
    processAutomation = 'processAutomation',
    governance = 'governance'
}

export interface PlugInInterface {
    name: string;
    host: string;
}
