/*!
 * @license
 * Copyright 2019 Alfresco Software, Ltd.
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

import { Api } from './api';
import { Application } from './application';
import { Descriptor } from './descriptor';
import { Logger } from '../utils/logger';
import { browser } from 'protractor';
import { ResultSetPaging } from '@alfresco/js-api';
import { ProjectDetailsModel } from './project-details-model';

export class DeploymentAPI extends Api {
    public application: Application;
    public descriptor: Descriptor;

    constructor(ROOT: string = 'deployment-service') {
        super(ROOT);
    }

    async setUp(): Promise<DeploymentAPI> {
        await this.login();
        this.application = new Application(this);
        this.descriptor = new Descriptor(this);
        return this;
    }

    async tearDown(): Promise<void> {
        await this.api.logout();
    }

    private async login(): Promise<void> {
        try {
            await this.api.login(
                browser.params.adminapp.devops,
                browser.params.adminapp.devops_password
            );
        } catch (error) {
            Logger.error(error);
        }
    }

    async deploy(releasedProject: any): Promise<void> {
        await this.application.deploy(releasedProject);
    }

    async deleteDescriptor(name: string): Promise<void> {
        await this.application.deleteDescriptor(name);
    }

    async getDescriptors(): Promise<ResultSetPaging> {
        const descriptors = await this.application.getDescriptors();
        return descriptors;
    }

    async getApplicationByStatus(status: string): Promise<ResultSetPaging> {
        const applications =  this.application.getApplicationsByStatus(status);
        return applications;
    }

    async createDescriptor(project: ProjectDetailsModel, descriptorName: string): Promise<any> {

        return this.descriptor.create({
            releaseId: project.releaseProjectResponse.entry.id,
            security: project.security,
            name: descriptorName
          });
      }
}
