import { ContentActionHandler } from '../models/content-action.model';
export declare class FolderActionsService {
    private handlers;
    constructor();
    getHandler(key: string): ContentActionHandler;
    setHandler(key: string, handler: ContentActionHandler): void;
    private handleStandardAction1(document);
    private handleStandardAction2(document);
}
