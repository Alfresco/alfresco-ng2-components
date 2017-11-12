import { NgModule } from '@angular/core';

import { ContentModule } from '@adf/content-services';
import { ProcessModule } from '@adf/process-services';
import { CoreModule } from '@adf/core';

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
