/*!
 * @license
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
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

import { QuestionModel } from '../model/questionModel';
import { BaseApi } from '../../hxi-connector-api/api/base.api';
import { QuestionRequest } from '../model/questionRequest';
import { AiAnswerPaging } from '../model/aiAnswerPaging';

/**
 * Search AI API.
 */
export class SearchAiApi extends BaseApi {
    /**
     * Ask a question to the AI.
     *
     * @param questions QuestionRequest array containing questions to ask.
     * @returns QuestionModel object containing information about questions.
     */
    ask(questions: QuestionRequest[]): Promise<QuestionModel> {
        const agentId = questions[0].agentId;
        return this.post({
            path: `agents/${agentId}/questions`,
            bodyParam: questions.map((questionRequest) => ({
                question: questionRequest.question,
                restrictionQuery: { nodesIds: questionRequest.nodeIds }
            }))
        }).then((response) => response.entry);
    }

    /**
     * Get an answer to specific question.
     *
     * @param questionId The ID of the question to get an answer for.
     * @returns AiAnswerPaging object containing the answer.
     */
    getAnswer(questionId: string): Promise<AiAnswerPaging> {
        return this.get({
            path: `questions/${questionId}/answers`
        });
    }
}
