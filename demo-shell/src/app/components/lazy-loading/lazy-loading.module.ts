import { NgModule } from '@angular/core';
import { CoreModule } from '@alfresco/adf-core';
import { LazyLoadingRoutes } from './lazy-loading.routes';
import { LazyLoadingComponent } from './lazy-loading.component';

@NgModule({
    imports: [
        CoreModule,
        LazyLoadingRoutes
    ],
    declarations: [
        LazyLoadingComponent
    ]
})
export class LazyLoadingModule {
}
