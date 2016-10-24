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

import { RaphaelIconServiceDirective } from './raphael-icon-service.component';
import { RaphaelIconSendDirective } from './raphael-icon-send.component';
import { RaphaelIconUserDirective } from './raphael-icon-user.component';
import { RaphaelIconManualDirective } from './raphael-icon-manual.component';
import { RaphaelIconCamelDirective } from './raphael-icon-camel.component';
import { RaphaelIconMuleDirective } from './raphael-icon-mule.component';
import { RaphaelIconAlfrescoPublishDirective } from './raphael-icon-alfresco-publish.component';
import { RaphaelIconRestCallDirective } from './raphael-icon-rest-call.component';
import { RaphaelIconGoogleDrivePublishDirective } from './raphael-icon-google-drive-publish.component';

// primitives
export * from './raphael-icon-service.component';
export * from './raphael-icon-send.component';
export * from './raphael-icon-user.component';
export * from './raphael-icon-manual.component';
export * from './raphael-icon-camel.component';
export * from './raphael-icon-mule.component';
export * from './raphael-icon-alfresco-publish.component';
export * from './raphael-icon-rest-call.component';
export * from './raphael-icon-google-drive-publish.component';

export const RAPHAEL_ICONS_DIRECTIVES: any[] = [
    RaphaelIconServiceDirective,
    RaphaelIconSendDirective,
    RaphaelIconUserDirective,
    RaphaelIconManualDirective,
    RaphaelIconCamelDirective,
    RaphaelIconMuleDirective,
    RaphaelIconAlfrescoPublishDirective,
    RaphaelIconRestCallDirective,
    RaphaelIconGoogleDrivePublishDirective
];
