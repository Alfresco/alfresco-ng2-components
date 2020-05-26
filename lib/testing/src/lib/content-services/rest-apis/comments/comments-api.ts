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

import { RepoApi } from '../repo-api';
import { CommentsApi as AdfCommentsApi, CommentPaging, CommentEntry } from '@alfresco/js-api';

export class CommentsApi extends RepoApi {
  commentsApi = new AdfCommentsApi(this.alfrescoJsApi);

  constructor(username: string, password: string) {
    super(username, password);
  }

  async getNodeComments(nodeId: string): Promise<CommentPaging> {
    try {
      await this.apiLogin();
      return await this.commentsApi.listComments(nodeId);
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.getNodeComments.name}`, error);
      return null;
    }
  }

  async addComment(nodeId: string, comment: string): Promise<CommentEntry> {
    try {
      await this.apiLogin();
      return await this.commentsApi.createComment(nodeId, { 'content': comment });
    } catch (error) {
      this.handleError(`${this.constructor.name} ${this.addComment.name}`, error);
      return null;
    }
  }
}
