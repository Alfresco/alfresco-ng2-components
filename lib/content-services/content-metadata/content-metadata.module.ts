/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material.module';
import { CardViewModule , FileSizePipe } from '@alfresco/adf-core';
import { ContentMetadataComponent } from './components/content-metadata/content-metadata.component';
import { ContentMetadataCardComponent } from './components/content-metadata-card/content-metadata-card.component';
import { PropertyDescriptorsService } from './services/property-descriptors.service';
import { PropertyDescriptorLoaderService } from './services/properties-loader.service';
import { ContentMetadataConfigFactory } from './services/config/content-metadata-config.factory';
import { AspectOrientedConfigService } from './services/config/aspect-oriented-config.service';
import { IndifferentConfigService } from './services/config/indifferent-config.service';
import { BasicPropertiesService } from './services/basic-properties.service';
import { ContentMetadataService } from './services/content-metadata.service';
import { PropertyGroupTranslatorService } from './services/grouped-properties.service';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        TranslateModule,
        FlexLayoutModule,
        CardViewModule
    ],
    exports: [
        ContentMetadataComponent,
        ContentMetadataCardComponent
    ],
    declarations: [
        ContentMetadataComponent,
        ContentMetadataCardComponent
    ],
    providers: [
        ContentMetadataService,
        PropertyDescriptorsService,
        PropertyDescriptorLoaderService,
        ContentMetadataConfigFactory,
        AspectOrientedConfigService,
        IndifferentConfigService,
        BasicPropertiesService,
        PropertyGroupTranslatorService,
        FileSizePipe
    ]
})
export class ContentMetadataModule {}
