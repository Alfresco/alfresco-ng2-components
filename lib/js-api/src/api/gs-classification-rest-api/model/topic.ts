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

import { ClassificationGuideInTopic } from './classificationGuideInTopic';
import { DateAlfresco } from '../../content-custom-api/model/dateAlfresco';
import { Instruction } from './instruction';
import { Path } from './path';

export class Topic {
    id: string;
    name: string;
    description?: string;
    /**
     * Flag indicating whether the topic has an instruction or not.
     */
    hasInstruction: boolean;
    instruction?: Instruction;
    createdAt: Date;
    /**
     * Flag indicating whether the topic has subtopics. This field is only included when requested.
     */
    hasSubtopics?: boolean;
    path?: Path;
    classificationGuide?: ClassificationGuideInTopic;

    constructor(input?: Partial<Topic>) {
        if (input) {
            Object.assign(this, input);
            this.instruction = input.instruction ? new Instruction(input.instruction) : undefined;
            this.createdAt = input.createdAt ? DateAlfresco.parseDate(input.createdAt) : undefined;
            this.path = input.path ? new Path(input.path) : undefined;
            this.classificationGuide = input.classificationGuide ? new ClassificationGuideInTopic(input.classificationGuide) : undefined;
        }
    }
}
