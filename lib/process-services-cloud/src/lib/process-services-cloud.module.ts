import { NgModule } from '@angular/core';
import { HelloModule } from './hello/hello.module';
import { TRANSLATION_PROVIDER } from '@alfresco/adf-core';
@NgModule({
    imports: [
        HelloModule
    ],
    providers: [
        {
            provide: TRANSLATION_PROVIDER,
            multi: true,
            useValue: {
                name: 'adf-process-services-cloud',
                source: 'assets/adf-process-services-cloud'
            }
        }
    ],
    declarations: [],
    exports: [HelloModule]
})
export class ProcessServicesCloudModule { }
