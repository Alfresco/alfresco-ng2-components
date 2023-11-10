/*!
 * @license
 * Copyright © 2005-2023 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { AbstractClassAssociationSource } from './abstractClassAssociationSource';

export class AbstractClassAssociation {
    id: string;
    title?: string;
    description?: string;
    isChild?: boolean;
    isProtected?: boolean;
    source?: AbstractClassAssociationSource;
    target?: AbstractClassAssociationSource;

    constructor(input?: Partial<AbstractClassAssociation>) {
        if (input) {
            Object.assign(this, input);
            this.source = input.source ? new AbstractClassAssociationSource(input.source) : undefined;
            this.target = input.target ? new AbstractClassAssociationSource(input.target) : undefined;
        }
    }

}
