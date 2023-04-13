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

import { browser } from 'protractor';
import { NodeEntry, ResultSetPaging } from '@alfresco/js-api';
import { ApiUtil } from '../../../shared/api/api.util';
import { E2eRequestApiHelper, E2eRequestApiHelperOptions } from '../../../shared/api/e2e-request-api.helper';
import * as fs from 'fs';
import { StringUtil } from '../../../shared/utils/string.util';
import { Logger } from '../../core/utils/logger';
import { ApiService } from '../../../shared/api/api.service';

export class Project {
  requestApiHelper: E2eRequestApiHelper;
  endPoint = 'modeling-service/v1/projects/';
  namePrefix: string = browser.params.namePrefix;

  constructor(api: ApiService) {
    this.requestApiHelper = new E2eRequestApiHelper(api);
  }

  async create(modelName: string = this.getRandomName()): Promise<NodeEntry> {
    const project = await this.requestApiHelper.post<NodeEntry>(this.endPoint, {bodyParam: { name: modelName }});

    Logger.info(
      `[Project] Project created with name: ${project.entry.name} and id: ${
        project.entry.id
      }.`
    );
    return project;
  }

  async createAndWaitUntilAvailable(modelName: string = this.getRandomName()): Promise<NodeEntry> {
    try {
      const project = await this.create(modelName);
      await this.retrySearchProject(project.entry.id);
      return project;
    } catch (error) {
      Logger.error(`[Project] Create and wait for project to be available failed!`);
      throw error;
    }
  }

  async get(projectId: string): Promise<NodeEntry> {
    return this.requestApiHelper.get<NodeEntry>(`${this.endPoint}${projectId}`);
  }

  async delete(projectId: string): Promise<void> {
    await this.requestApiHelper.delete(`${this.endPoint}${projectId}`);
    Logger.info(
      `[Project] Project '${projectId}' was deleted successfully.`
    );
  }

  async release(projectId: string): Promise<any> {
    try {
      const release = await this.requestApiHelper
          .post(`${this.endPoint}${projectId}/releases`);
      Logger.info(`[Project] Project '${projectId}' was released.`);
      return release;
    } catch (error) {
      Logger.error(`[Project] Release project failed!`);
      throw error;
    }
  }

  async getProjectRelease(projectId: string): Promise<any> {
    try {
      return await this.requestApiHelper
          .get<ResultSetPaging>(`${this.endPoint}${projectId}/releases`);
    } catch (error) {
      Logger.error(`[Project] Not able to fetch project release!`);
      throw error;
    }
  }

  async deleteRelease(releaseId: string): Promise<void> {
    Logger.info(`[Project] Delete project release ${releaseId}`);
    try {
        await this.requestApiHelper.delete(`modeling-service/v1/releases/${releaseId}`);
        Logger.info(`[Project] Release ${releaseId} was deleted successfully`);
    } catch (error) {
        throw new Error(`Delete project release ${releaseId} failed: ${JSON.stringify(error)}`);
    }
  }

  async import(projectFilePath: string): Promise<NodeEntry> {
    const fileContent = await fs.createReadStream(projectFilePath);
    const requestOptions: E2eRequestApiHelperOptions = {
      formParams: { file: fileContent },
      contentTypes: ['multipart/form-data']
    };
    try {
      const project = await this.requestApiHelper
          .post<NodeEntry>(`${this.endPoint}import`, requestOptions);
      Logger.info(`[Project] Project imported with name '${project.entry.name}' and id '${project.entry.id}'.`);
      return project;
    } catch (error) {
      Logger.error(`[Project] Import project failed!`);
      throw error;
    }
  }

  async searchProjects(): Promise<ResultSetPaging> {
    Logger.info(`[Project] Waiting created project to be ready for listing.`);
    return this.requestApiHelper.get<ResultSetPaging>(this.endPoint, {
      queryParams: { maxItems: 1000 }
    });
  }

  private async retrySearchProject(modelId: string): Promise<any> {
    const predicate = (result: ResultSetPaging) => {
      const foundModel = result.list.entries.find(model => model.entry.id === modelId);
      return !!foundModel;
    };
    const apiCall = () => this.searchProjects();

    return ApiUtil.waitForApi(apiCall, predicate);
  }

  private getRandomName(): string {
    return this.namePrefix + StringUtil.generateRandomString(5).toLowerCase();
  }
}
