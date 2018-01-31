import { NgModule } from '@angular/core';

import { ContentModule } from '@alfresco/adf-content-services';
import { ProcessModule } from '@alfresco/adf-process-services';
import { InsightsModule } from '@alfresco/adf-insights';

export function modules() {
    return [
        ContentModule,
        InsightsModule,
        ProcessModule
    ];
}

@NgModule({
    imports: modules(),
    exports: modules()
})
export class AdfModule {
}
