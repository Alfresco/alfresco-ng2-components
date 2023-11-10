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

import { AssociationBody } from './associationBody';
import { ChildAssociationBody } from './childAssociationBody';
import { Definition } from './definition';
import { NodeBodyCreateAssociation } from './nodeBodyCreateAssociation';
import { PermissionsBody } from './permissionsBody';

export class NodeBodyCreate {
    /**
     * The name must not contain spaces or the following special characters: * \" < > \\ / ? : and |.
The character . must not be used at the end of the name.

     */
    name: string;
    nodeType: string;
    aspectNames?: string[];
    properties?: any;
    permissions?: PermissionsBody;
    definition?: Definition;
    relativePath?: string;
    association?: NodeBodyCreateAssociation;
    secondaryChildren?: ChildAssociationBody[];
    targets?: AssociationBody[];

    constructor(input?: Partial<NodeBodyCreate>) {
        if (input) {
            Object.assign(this, input);
            this.permissions = input.permissions ? new PermissionsBody(input.permissions) : undefined;
            this.definition = input.definition ? new Definition(input.definition) : undefined;
            this.association = input.association ? new NodeBodyCreateAssociation(input.association) : undefined;
            if (input.secondaryChildren) {
                this.secondaryChildren = input.secondaryChildren.map((item) => {
                    return new ChildAssociationBody(item);
                });
            }
            if (input.targets) {
                this.targets = input.targets.map((item) => {
                    return new AssociationBody(item);
                });
            }
        }
    }
}
