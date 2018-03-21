/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PermissionDisplayComponent } from './permission-display.component';
import { NodesApiService } from '@alfresco/adf-core';
import { Observable } from 'rxjs/Observable';

const fakeNodeWithPermissions: any = {
      'aspectNames': [
        'cm:auditable',
        'cm:taggable',
        'cm:author',
        'cm:titled',
        'app:uifacets'
      ],
      'createdAt': '2017-11-16T16:29:38.638+0000',
      'isFolder': true,
      'isFile': false,
      'createdByUser': {
        'id': 'System',
        'displayName': 'System'
      },
      'modifiedAt': '2018-03-21T03:17:58.783+0000',
      'permissions': {
        'inherited': [
          {
            'authorityId': 'guest',
            'name': 'Read',
            'accessStatus': 'ALLOWED'
          },
          {
            'authorityId': 'GROUP_EVERYONE',
            'name': 'Read',
            'accessStatus': 'ALLOWED'
          }
        ],
        'locallySet': [
          {
            'authorityId': 'GROUP_EVERYONE',
            'name': 'Contributor',
            'accessStatus': 'ALLOWED'
          }
        ],
        'settable': [
          'Contributor',
          'Collaborator',
          'Coordinator',
          'Editor',
          'Consumer'
        ],
        'isInheritanceEnabled': true
      },
      'modifiedByUser': {
        'id': 'admin',
        'displayName': 'PedroH Hernandez'
      },
      'name': 'test',
      'id': 'f472543f-7218-403d-917b-7a5861257244',
      'nodeType': 'cm:folder',
      'properties': {
        'cm:title': 'test',
        'cm:author': 'yagud',
        'cm:taggable': [
          'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
        ],
        'cm:description': 'sleepery',
        'app:icon': 'space-icon-default'
      }
  };

const fakeNodeInheritedOnly: any = {
    'aspectNames': [
      'cm:auditable',
      'cm:taggable',
      'cm:author',
      'cm:titled',
      'app:uifacets'
    ],
    'createdAt': '2017-11-16T16:29:38.638+0000',
    'isFolder': true,
    'isFile': false,
    'createdByUser': {
      'id': 'System',
      'displayName': 'System'
    },
    'modifiedAt': '2018-03-21T03:17:58.783+0000',
    'permissions': {
      'inherited': [
        {
          'authorityId': 'guest',
          'name': 'Read',
          'accessStatus': 'ALLOWED'
        },
        {
          'authorityId': 'GROUP_EVERYONE',
          'name': 'Read',
          'accessStatus': 'ALLOWED'
        }
      ],
      'settable': [
        'Contributor',
        'Collaborator',
        'Coordinator',
        'Editor',
        'Consumer'
      ],
      'isInheritanceEnabled': true
    },
    'modifiedByUser': {
      'id': 'admin',
      'displayName': 'PedroH Hernandez'
    },
    'name': 'test',
    'id': 'f472543f-7218-403d-917b-7a5861257244',
    'nodeType': 'cm:folder',
    'properties': {
      'cm:title': 'test',
      'cm:author': 'yagud',
      'cm:taggable': [
        'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
      ],
      'cm:description': 'sleepery',
      'app:icon': 'space-icon-default'
    }
};
const fakeNodeWithOnlyLocally: any = {
    'aspectNames': [
      'cm:auditable',
      'cm:taggable',
      'cm:author',
      'cm:titled',
      'app:uifacets'
    ],
    'createdAt': '2017-11-16T16:29:38.638+0000',
    'isFolder': true,
    'isFile': false,
    'createdByUser': {
      'id': 'System',
      'displayName': 'System'
    },
    'modifiedAt': '2018-03-21T03:17:58.783+0000',
    'permissions': {
      'locallySet': [
        {
          'authorityId': 'GROUP_EVERYONE',
          'name': 'Contributor',
          'accessStatus': 'ALLOWED'
        }
      ],
      'settable': [
        'Contributor',
        'Collaborator',
        'Coordinator',
        'Editor',
        'Consumer'
      ],
      'isInheritanceEnabled': true
    },
    'modifiedByUser': {
      'id': 'admin',
      'displayName': 'PedroH Hernandez'
    },
    'name': 'test',
    'id': 'f472543f-7218-403d-917b-7a5861257244',
    'nodeType': 'cm:folder',
    'properties': {
      'cm:title': 'test',
      'cm:author': 'yagud',
      'cm:taggable': [
        'e8c8fbba-03ba-4fa6-86b1-f7ad7c296409'
      ],
      'cm:description': 'sleepery',
      'app:icon': 'space-icon-default'
    }
};

describe('PermissionDisplayComponent', () => {

    let fixture: ComponentFixture<PermissionDisplayComponent>;
    let component: PermissionDisplayComponent;
    let element: HTMLElement;
    let nodeService: NodesApiService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PermissionDisplayComponent
            ],
            providers: [NodesApiService]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(PermissionDisplayComponent);
            component = fixture.componentInstance;
            element = fixture.nativeElement;
            nodeService = TestBed.get(NodesApiService);
        });
    }));

    afterEach(async(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
    }));

    it('should be able to render the component', async() => {
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
    });

    it('should show the node permissions', async() => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeWithPermissions));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
        expect(element.querySelectorAll('.adf-datatable-row').length).toBe(4);
    });

    it('should show inherited label for inherited permissions', async() => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeInheritedOnly));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
        expect(element.querySelector('#adf-permission-inherited-label')).toBeDefined();
        expect(element.querySelector('#adf-permission-inherited-label')).not.toBeNull();
    });

    it('should show locally set label for locally set permissions', async() => {
        component.nodeId = 'fake-node-id';
        spyOn(nodeService, 'getNode').and.returnValue(Observable.of(fakeNodeWithOnlyLocally));
        fixture.detectChanges();
        expect(element.querySelector('#adf-permission-display-container')).not.toBeNull();
        expect(element.querySelector('#adf-permission-locallyset-label')).toBeDefined();
        expect(element.querySelector('#adf-permission-locallyset-label')).not.toBeNull();
    });

});
