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

import { Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DiagramComponent } from '@alfresco/adf-insights';

@Component({
    selector: 'app-show-diagram',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, DiagramComponent],
    templateUrl: './show-diagram.component.html'
})
export class ShowDiagramComponent {
    processDefinitionId: string;
    appId: string;

    constructor(private route: ActivatedRoute, private router: Router) {
        this.route.params.subscribe((params: Params) => {
            this.processDefinitionId = params['processDefinitionId'];
            this.appId = params['appId'];
        });
    }

    onClickBack() {
        this.router.navigate(['/activiti/apps/' + this.appId + '/processes']);
    }
}
