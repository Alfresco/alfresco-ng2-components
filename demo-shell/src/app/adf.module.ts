import { NgModule } from '@angular/core';

import { ContentModule } from '@alfresco/content-services';
import { ProcessModule } from '@alfresco/process-services';
import { CoreModule } from '@alfresco/core';
import { InsightsModule } from '@alfresco/insights';

export function modules() {
    return [
        CoreModule,
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
