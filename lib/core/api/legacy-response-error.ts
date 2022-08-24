export class LegacyResponseError extends Error {

    public name = 'LegacyResponseError';

    constructor(msg: string, public status: number, public error: { response: Record<string, any> }) {
        super(msg);
    }
}
