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
import { Project } from './project';
import { Logger } from '../utils/logger';
import { browser } from 'protractor';
import { NodeEntry, ResultSetPaging } from '@alfresco/js-api';

export class ModelingAPI extends Api {
    public project: Project;

    constructor(ROOT: string = 'modeling-service') {
        super(ROOT);
    }

    async setUp(): Promise<ModelingAPI> {
        await this.login();
        this.project = new Project(this);
        return this;
    }

    async tearDown(): Promise<void> {
        await this.api.logout();
    }

    private async login(): Promise<void> {
        try {
            await this.api.login(
                browser.params.adminapp.modeler,
                browser.params.adminapp.modeler_password
            );
        } catch (error) {
            Logger.error(error);
        }
    }

    async createProject(): Promise<NodeEntry> {
        const project = await this.project.create();
        return project;
    }

    async releaseProject(project: any): Promise<NodeEntry> {
        const releasedProject = await this.project.release(project.entry.id);
        return releasedProject;
    }

    async getProjectRelease(projectId: string): Promise<ResultSetPaging> {
        const releasedProject = await this.project.getProjectRelease(projectId);
        return releasedProject;
    }

    async importAndReleaseProject(absoluteFilePath: string): Promise<NodeEntry> {
        const project = await this.project.import(absoluteFilePath);
        const releasedProject = await this.project.release(project.entry.id);
        return releasedProject;
    }

    async getProjects(): Promise<ResultSetPaging> {
        const projects = await this.project.searchProjects();
        return projects;
    }

}
