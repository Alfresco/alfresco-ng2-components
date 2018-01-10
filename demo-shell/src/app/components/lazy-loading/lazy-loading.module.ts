import { NgModule } from '@angular/core';
import { CoreModule, TRANSLATION_PROVIDER, TranslationService } from '@alfresco/adf-core';

import { LazyLoadingRoutes } from './lazy-loading.routes';
import { LazyLoadingComponent } from './lazy-loading.component';

@NgModule({
    imports: [
        CoreModule.forChild(),
        LazyLoadingRoutes
    ],
    declarations: [
        LazyLoadingComponent
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'app',
                source: 'resources'
            }
        },
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'lazy-loading',
                source: 'resources/lazy-loading'
            }
        }
    ]
})
export class LazyLoadingModule {
    constructor(translate: TranslationService) {
        // this is needed for the root module in the lazy hierarchy
    }
}
