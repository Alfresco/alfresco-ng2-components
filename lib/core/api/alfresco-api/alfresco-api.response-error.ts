export class AlfrescoApiResponseError extends Error {

    public name = 'AlfrescoApiResponseError';

    constructor(msg: string, public status: number, public error: { response: Record<string, any> }) {
        super(msg);
    }
}
