import { NgModule } from '@angular/core';
import { CoreModule, TranslationService } from '@alfresco/adf-core';

import { LazyLoadingRoutes } from './lazy-loading.routes';
import { LazyLoadingComponent } from './lazy-loading.component';

@NgModule({
    imports: [
        CoreModule.forChild(),
        LazyLoadingRoutes
    ],
    declarations: [
        LazyLoadingComponent
    ]
})
export class LazyLoadingModule {
    constructor(translate: TranslationService) {
        // this is needed for the root module in the lazy hierarchy
        translate.addTranslationFolder('lazy-loading', 'resources/lazy-loading');
    }
}
