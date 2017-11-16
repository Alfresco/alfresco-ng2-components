import { NgModule } from '@angular/core';

import { ContentModule } from '@alfresco/content-services';
import { ProcessModule } from '@alfresco/process-services';
import { CoreModule } from '@alfresco/core';
import { AnalyticsModule } from '@alfresco/insights';

export function modules() {
    return [
        AnalyticsModule,
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
