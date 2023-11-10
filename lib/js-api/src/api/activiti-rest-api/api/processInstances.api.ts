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

import { CreateProcessInstanceRepresentation } from '../model/createProcessInstanceRepresentation';
import { FormDefinitionRepresentation } from '../model/formDefinitionRepresentation';
import { HistoricProcessInstanceQueryRepresentation } from '../model/historicProcessInstanceQueryRepresentation';
import { IdentityLinkRepresentation } from '../model/identityLinkRepresentation';
import { ProcessInstanceAuditInfoRepresentation } from '../model/processInstanceAuditInfoRepresentation';
import { ProcessInstanceFilterRequestRepresentation } from '../model/processInstanceFilterRequestRepresentation';
import { ProcessInstanceQueryRepresentation } from '../model/processInstanceQueryRepresentation';
import { ProcessInstanceRepresentation } from '../model/processInstanceRepresentation';
import { ProcessInstanceVariableRepresentation } from '../model/processInstanceVariableRepresentation';
import { ResultListDataRepresentationProcessContentRepresentation } from '../model/resultListDataRepresentationProcessContentRepresentation';
import { ResultListDataRepresentationProcessInstanceRepresentation } from '../model/resultListDataRepresentationProcessInstanceRepresentation';
import { BaseApi } from './base.api';
import { throwIfNotDefined } from '../../../assert';
import { ResultListDataRepresentationDecisionTaskRepresentation } from '../model/resultListDataRepresentationDecisionTaskRepresentation';

/**
 * Process Instances service.
 * @module ProcessInstancesApi
 */
export class ProcessInstancesApi extends BaseApi {
    /**
     * Activate a process instance
     *
     * @param processInstanceId processInstanceId
     * @return Promise<ProcessInstanceRepresentation>
     */
    activateProcessInstance(processInstanceId: string): Promise<ProcessInstanceRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.put({
            path: '/api/enterprise/process-instances/{processInstanceId}/activate',
            pathParams,
            returnType: ProcessInstanceRepresentation
        });
    }

    /**
     * Add a user or group involvement to a process instance
     *
     * @param processInstanceId processInstanceId
     * @param identityLinkRepresentation identityLinkRepresentation
     * @return Promise<IdentityLinkRepresentation>
     */
    createIdentityLink(processInstanceId: string, identityLinkRepresentation: IdentityLinkRepresentation): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');
        throwIfNotDefined(identityLinkRepresentation, 'identityLinkRepresentation');

        const pathParams = {
            processInstanceId
        };

        return this.post({
            path: '/api/enterprise/process-instances/{processInstanceId}/identitylinks',
            pathParams,
            bodyParam: identityLinkRepresentation,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * Remove a user or group involvement from a process instance
     *
     * @param processInstanceId processInstanceId
     * @param family family
     * @param identityId identityId
     * @param type type
     * @return Promise<{}>
     */
    deleteIdentityLink(processInstanceId: string, family: string, identityId: string, type: string): Promise<void> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');
        throwIfNotDefined(family, 'family');
        throwIfNotDefined(identityId, 'identityId');
        throwIfNotDefined(type, 'type');

        const pathParams = {
            processInstanceId,
            family,
            identityId,
            type
        };

        return this.delete({
            path: '/api/enterprise/process-instances/{processInstanceId}/identitylinks/{family}/{identityId}/{type}',
            pathParams
        });
    }

    /**
     * Cancel or remove a process instance
     *
     * If the process instance has not yet been completed, it will be cancelled. If it has already finished or been cancelled then the process instance will be removed and will no longer appear in queries.
     *
     * @param processInstanceId processInstanceId
     * @return Promise<{}>
     */
    deleteProcessInstance(processInstanceId: string): Promise<void> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.delete({
            path: '/api/enterprise/process-instances/{processInstanceId}',
            pathParams
        });
    }

    /**
     * List process instances using a filter
     *
     * The request body provided must define either a valid filterId value or filter object
     *
     * @param filterRequest filterRequest
     * @return Promise<ResultListDataRepresentationProcessInstanceRepresentation>
     */
    filterProcessInstances(filterRequest: ProcessInstanceFilterRequestRepresentation): Promise<ResultListDataRepresentationProcessInstanceRepresentation> {
        throwIfNotDefined(filterRequest, 'filterRequest');

        return this.post({
            path: '/api/enterprise/process-instances/filter',
            bodyParam: filterRequest,
            returnType: ResultListDataRepresentationProcessInstanceRepresentation
        });
    }

    /**
     * Get decision tasks in a process instance
     *
     * @param processInstanceId processInstanceId
     * @return Promise<ResultListDataRepresentationDecisionTaskRepresentation>
     */
    getHistoricProcessInstanceDecisionTasks(processInstanceId: string): Promise<ResultListDataRepresentationDecisionTaskRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/decision-tasks',
            pathParams,
            returnType: ResultListDataRepresentationDecisionTaskRepresentation
        });
    }
    /**
     * Get historic variables for a process instance
     *
     * @param processInstanceId processInstanceId
     * @return Promise<ProcessInstanceVariableRepresentation>
     */
    getHistoricProcessInstanceVariables(processInstanceId: string): Promise<ProcessInstanceVariableRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/historic-variables',
            pathParams,
            returnType: ProcessInstanceVariableRepresentation
        });
    }

    /**
     * Query historic process instances
     *
     * @param queryRequest queryRequest
     * @return Promise<ResultListDataRepresentationProcessInstanceRepresentation>
     */
    getHistoricProcessInstances(queryRequest: HistoricProcessInstanceQueryRepresentation): Promise<ResultListDataRepresentationProcessInstanceRepresentation> {
        throwIfNotDefined(queryRequest, 'queryRequest');

        return this.post({
            path: '/api/enterprise/historic-process-instances/query',
            bodyParam: queryRequest,
            returnType: ResultListDataRepresentationProcessInstanceRepresentation
        });
    }

    /**
     * Get a user or group involvement with a process instance
     *
     * @param processInstanceId processInstanceId
     * @param family family
     * @param identityId identityId
     * @param type type
     * @return Promise<IdentityLinkRepresentation>
     */
    getIdentityLinkType(processInstanceId: string, family: string, identityId: string, type: string): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');
        throwIfNotDefined(family, 'family');
        throwIfNotDefined(identityId, 'identityId');
        throwIfNotDefined(type, 'type');

        const pathParams = {
            processInstanceId,
            family,
            identityId,
            type
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/identitylinks/{family}/{identityId}/{type}',
            pathParams,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * List either the users or groups involved with a process instance
     *
     * @param processInstanceId processInstanceId
     * @param family family
     * @return Promise<IdentityLinkRepresentation>
     */
    getIdentityLinksForFamily(processInstanceId: string, family: string): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');
        throwIfNotDefined(family, 'family');

        const pathParams = {
            processInstanceId,
            family
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/identitylinks/{family}',
            pathParams,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * List the users and groups involved with a process instance
     *
     * @param processInstanceId processInstanceId
     * @return Promise<IdentityLinkRepresentation>
     */
    getIdentityLinks(processInstanceId: string): Promise<IdentityLinkRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/identitylinks',
            pathParams,
            returnType: IdentityLinkRepresentation
        });
    }

    /**
     * List content attached to process instance fields
     *
     * @param processInstanceId processInstanceId
     * @return Promise<ResultListDataRepresentationProcessContentRepresentation>
     */
    getProcessInstanceContent(processInstanceId: string): Promise<ResultListDataRepresentationProcessContentRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/field-content',
            pathParams,
            returnType: ResultListDataRepresentationProcessContentRepresentation
        });
    }

    /**
     * Get the process diagram for the process instance
     *
     * @param processInstanceId processInstanceId
     * @return Promise<string>
     */
    getProcessInstanceDiagram(processInstanceId: string): Promise<string> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        const accepts = ['image/png'];

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/diagram',
            pathParams,
            accepts
        });
    }

    /**
     * Get a process instance start form
     *
     * The start form for a process instance can be retrieved when the process definition has a start form defined (hasStartForm = true on the process instance)
     *
     * @param processInstanceId processInstanceId
     * @return Promise<FormDefinitionRepresentation>
     */
    getProcessInstanceStartForm(processInstanceId: string): Promise<FormDefinitionRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/start-form',
            pathParams,
            returnType: FormDefinitionRepresentation
        });
    }

    /**
     * Get a process instance
     *
     * @param processInstanceId processInstanceId
     * @return Promise<ProcessInstanceRepresentation>
     */
    getProcessInstance(processInstanceId: string): Promise<ProcessInstanceRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}',
            pathParams,
            returnType: ProcessInstanceRepresentation
        });
    }

    /**
     * Query process instances
     *
     * @param processInstancesQuery processInstancesQuery
     * @return Promise<ResultListDataRepresentationProcessInstanceRepresentation>
     */
    getProcessInstances(processInstancesQuery: ProcessInstanceQueryRepresentation): Promise<ResultListDataRepresentationProcessInstanceRepresentation> {
        throwIfNotDefined(processInstancesQuery, 'processInstancesQuery');

        return this.post({
            path: '/api/enterprise/process-instances/query',
            bodyParam: processInstancesQuery,
            returnType: ResultListDataRepresentationProcessInstanceRepresentation
        });
    }

    /**
     * Get the audit log for a process instance
     *
     * @param processInstanceId processInstanceId
     * @return Promise<ProcessInstanceAuditInfoRepresentation>
     */
    getTaskAuditLog(processInstanceId: string): Promise<ProcessInstanceAuditInfoRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.get({
            path: '/api/enterprise/process-instances/{processInstanceId}/audit-log',
            pathParams,
            returnType: ProcessInstanceAuditInfoRepresentation
        });
    }

    /**
     * Retrieve the process audit in the PDF format
     *
     * @param {String} processInstanceId processId
     * @return {Blob} process audit
     */
    getProcessAuditPdf(processInstanceId: string): Promise<Blob> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        const responseType = 'blob';

        return this.get({
            path: '/app/rest/process-instances/{processInstanceId}/audit',
            pathParams,
            responseType
        });
    }

    /**
     * Start a process instance
     *
     * @param startRequest startRequest
     * @return Promise<ProcessInstanceRepresentation>
     */
    startNewProcessInstance(startRequest: CreateProcessInstanceRepresentation): Promise<ProcessInstanceRepresentation> {
        throwIfNotDefined(startRequest, 'startRequest');

        return this.post({
            path: '/api/enterprise/process-instances',
            bodyParam: startRequest,
            returnType: ProcessInstanceRepresentation
        });
    }

    /**
     * Suspend a process instance
     *
     * @param processInstanceId processInstanceId
     * @return Promise<ProcessInstanceRepresentation>
     */
    suspendProcessInstance(processInstanceId: string): Promise<ProcessInstanceRepresentation> {
        throwIfNotDefined(processInstanceId, 'processInstanceId');

        const pathParams = {
            processInstanceId
        };

        return this.put({
            path: '/api/enterprise/process-instances/{processInstanceId}/suspend',
            pathParams,
            returnType: ProcessInstanceRepresentation
        });
    }
}
