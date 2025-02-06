/*!
 * @license
 * Copyright © 2005-2025 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { Directive, ElementRef, inject } from '@angular/core';
import { RaphaelService } from './raphael.service';

@Directive()
export class RaphaelBase {
    private raphaelService = inject(RaphaelService);
    private element = inject(ElementRef);

    paper: any;

    constructor() {
        this.paper = this.raphaelService.getInstance(this.element);
    }
}
