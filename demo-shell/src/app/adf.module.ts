import { NgModule } from '@angular/core';

import { ContentModule } from '@alfresco/content-services';
import { ProcessModule } from '@alfresco/process-services';
import { CoreModule } from '@alfresco/core';

export function modules() {
    return [
        CoreModule,
        ProcessModule,
        ContentModule
    ];
}

@NgModule({
    imports: modules(),
    exports: modules()
})
export class AdfModule {
}
