import { ContentActionHandler } from '../models/content-action.model';
export declare class DocumentActionsService {
    private handlers;
    constructor();
    getHandler(key: string): ContentActionHandler;
    private handleStandardAction1(document);
    private handleStandardAction2(document);
}
