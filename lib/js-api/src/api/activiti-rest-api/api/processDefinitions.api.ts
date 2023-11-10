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

import { FormDefinitionRepresentation } from '../model/formDefinitionRepresentation';
import { FormValueRepresentation } from '../model/formValueRepresentation';
import { IdentityLinkRepresentation } from '../model/identityLinkRepresentation';
import { ResultListDataRepresentationProcessDefinitionRepresentation } from '../model/resultListDataRepresentationProcessDefinitionRepresentation';
import { ResultListDataRepresentationRuntimeDecisionTableRepresentation } from '../model/resultListDataRepresentationRuntimeDecisionTableRepresentation';
import { ResultListDataRepresentationRuntimeFormRepresentation } from '../model/resultListDataRepresentationRuntimeFormRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';

/**
 * ProcessDefinitionsApi service.
 * @module ProcessDefinitionsApi
 */
export class ProcessDefinitionsApi extends BaseApi {
    /**
     * Add a user or group involvement to a process definition
     *
     * @param processDefinitionId processDefinitionId
     * @param identityLinkRepresentation identityLinkRepresentation
     * @return Promise<IdentityLinkRepresentation>
     */
    createIdentityLink(processDefinitionId: string, identityLinkRepresentation: IdentityLinkRepresentation): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(processDefinitionId, 'processDefinitionId');
        throwIfNotDefined(identityLinkRepresentation, 'identityLinkRepresentation');

        const pathParams = {
            processDefinitionId
        };

        return this.post({
            path: '/api/enterprise/process-definitions/{processDefinitionId}/identitylinks',
            pathParams,
            bodyParam: identityLinkRepresentation,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * Remove a user or group involvement from a process definition
     *
     * @param processDefinitionId Process definition ID
     * @param family Identity type
     * @param identityId User or group ID
     * @return Promise<{}>
     */
    deleteIdentityLink(processDefinitionId: string, family: string, identityId: string): Promise<void> {
        throwIfNotDefined(processDefinitionId, 'processDefinitionId');
        throwIfNotDefined(family, 'family');
        throwIfNotDefined(identityId, 'identityId');

        const pathParams = {
            processDefinitionId,
            family,
            identityId
        };

        return this.delete({
            path: '/api/enterprise/process-definitions/{processDefinitionId}/identitylinks/{family}/{identityId}',
            pathParams
        });
    }

    /**
     * Get a user or group involvement with a process definition
     *
     * @param processDefinitionId Process definition ID
     * @param family Identity type
     * @param identityId User or group ID
     * @return Promise<IdentityLinkRepresentation>
     */
    getIdentityLinkType(processDefinitionId: string, family: string, identityId: string): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(processDefinitionId, 'processDefinitionId');
        throwIfNotDefined(family, 'family');
        throwIfNotDefined(identityId, 'identityId');

        const pathParams = {
            processDefinitionId,
            family,
            identityId
        };

        return this.get({
            path: '/api/enterprise/process-definitions/{processDefinitionId}/identitylinks/{family}/{identityId}',
            pathParams,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * List either the users or groups involved with a process definition
     *
     * @param processDefinitionId processDefinitionId
     * @param family Identity type
     * @return Promise<IdentityLinkRepresentation>
     */
    getIdentityLinksForFamily(processDefinitionId: string, family: string): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(processDefinitionId, 'processDefinitionId');
        throwIfNotDefined(family, 'family');

        const pathParams = {
            processDefinitionId,
            family
        };

        return this.get({
            path: '/api/enterprise/process-definitions/{processDefinitionId}/identitylinks/{family}',
            pathParams,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * List the users and groups involved with a process definition
     *
     * @param processDefinitionId processDefinitionId
     * @return Promise<IdentityLinkRepresentation>
     */
    getIdentityLinks(processDefinitionId: string): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(processDefinitionId, 'processDefinitionId');

        const pathParams = {
            processDefinitionId
        };

        return this.get({
            path: '/api/enterprise/process-definitions/{processDefinitionId}/identitylinks',
            pathParams,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * List the decision tables associated with a process definition
     *
     * @param processDefinitionId processDefinitionId
     * @return Promise<ResultListDataRepresentationRuntimeDecisionTableRepresentation>
     */
    getProcessDefinitionDecisionTables(processDefinitionId: string): Promise<ResultListDataRepresentationRuntimeDecisionTableRepresentation> {
        throwIfNotDefined(processDefinitionId, 'processDefinitionId');

        const pathParams = {
            processDefinitionId
        };

        return this.get({
            path: '/api/enterprise/process-definitions/{processDefinitionId}/decision-tables',
            pathParams,
            returnType: ResultListDataRepresentationRuntimeDecisionTableRepresentation
        });
    }

    /**
     * List the forms associated with a process definition
     *
     * @param processDefinitionId processDefinitionId
     * @return Promise<ResultListDataRepresentationRuntimeFormRepresentation>
     */
    getProcessDefinitionForms(processDefinitionId: string): Promise<ResultListDataRepresentationRuntimeFormRepresentation> {
        throwIfNotDefined(processDefinitionId, 'processDefinitionId');

        const pathParams = {
            processDefinitionId
        };

        return this.get({
            path: '/api/enterprise/process-definitions/{processDefinitionId}/forms',
            pathParams,
            returnType: ResultListDataRepresentationRuntimeFormRepresentation
        });
    }

    /**
     * Retrieve the start form for a process definition
     *
     * @param processDefinitionId processDefinitionId
     * @return Promise<FormDefinitionRepresentation>
     */
    getProcessDefinitionStartForm(processDefinitionId: string): Promise<FormDefinitionRepresentation> {
        const pathParams = {
            processDefinitionId
        };

        return this.get({
            path: '/api/enterprise/process-definitions/{processDefinitionId}/start-form',
            pathParams,
            returnType: FormDefinitionRepresentation
        });
    }

    /**
     * Retrieve a list of process definitions
     *
     * Get a list of process definitions (visible within the tenant of the user)
     *
     * @param opts Optional parameters
     * @return Promise<ResultListDataRepresentationProcessDefinitionRepresentation>
     */
    getProcessDefinitions(opts?: { latest?: boolean; appDefinitionId?: number; deploymentId?: string }): Promise<ResultListDataRepresentationProcessDefinitionRepresentation> {
        return this.get({
            path: '/api/enterprise/process-definitions',
            queryParams: opts,
            returnType: ResultListDataRepresentationProcessDefinitionRepresentation
        });
    }

    /**
     * Retrieve field values (e.g. the typeahead field)
     *
     * @param processDefinitionId processDefinitionId
     * @param field
     * @return Promise<FormValueRepresentation[]>
     */
    getRestFieldValues(processDefinitionId: string, field: string): Promise<FormValueRepresentation[]> {
        const pathParams = {
            processDefinitionId,
            field
        };

        return this.get({
            path: '/api/enterprise/process-definitions/{processDefinitionId}/start-form-values/{field}',
            pathParams,
            returnType: FormValueRepresentation
        });
    }

    /**
     * Retrieve field values (eg. the table field)
     *
     * @param processDefinitionId processDefinitionId
     *
     * @param field
     * @param column
     * @return Promise<FormValueRepresentation []>
     */
    getRestTableFieldValues(processDefinitionId: string, field: string, column: string): Promise<FormValueRepresentation[]> {
        const pathParams = {
            processDefinitionId,
            field,
            column
        };

        return this.get({
            path: '/api/enterprise/process-definitions/{processDefinitionId}/start-form-values/{field}/{column}',
            pathParams,
            returnType: FormValueRepresentation
        });
    }
}
