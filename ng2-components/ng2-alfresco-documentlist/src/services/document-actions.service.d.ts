import { ContentActionHandler } from '../models/content-action.model';
import { AlfrescoService } from './alfresco.service';
export declare class DocumentActionsService {
    private _alfrescoService;
    private handlers;
    constructor(_alfrescoService: AlfrescoService);
    getHandler(key: string): ContentActionHandler;
    setHandler(key: string, handler: ContentActionHandler): void;
    private setupActionHandlers();
    private handleStandardAction1(obj);
    private handleStandardAction2(obj);
    private download(obj);
}
