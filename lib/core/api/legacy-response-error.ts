// for backward compatibility we need to return Error message with status code
export class LegacyResponseError extends Error {

    public name = 'ResponseError';

    // to handle for example demo-shell/src/app/components/files/files.component.ts
        /*
            onNavigationError(error: any) {
            if (error) {
                this.router.navigate(['/error', error.status]);
            }
        }
    */
    constructor(msg: string, public status: number, public error: { response: Record<string, any> }) {
        super(msg);
    }
}
