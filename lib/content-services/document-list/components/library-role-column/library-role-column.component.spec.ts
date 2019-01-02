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

import { LibraryRoleColumnComponent } from './library-role-column.component';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LibraryNameColumnComponent', () => {
  let fixture: ComponentFixture<LibraryRoleColumnComponent>;
  let component: LibraryRoleColumnComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibraryRoleColumnComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(LibraryRoleColumnComponent);
    component = fixture.componentInstance;
  });

  it('should render Manager', () => {
    component.context = { row: { node: { entry: { role: 'SiteManager' } } } };
    fixture.detectChanges();
    expect(component.displayText).toBe('LIBRARY.ROLE.MANAGER');
  });

  it('should render Collaborator', () => {
    component.context = {
      row: { node: { entry: { role: 'SiteCollaborator' } } }
    };
    fixture.detectChanges();
    expect(component.displayText).toBe('LIBRARY.ROLE.COLLABORATOR');
  });

  it('should render Contributor', () => {
    component.context = {
      row: { node: { entry: { role: 'SiteContributor' } } }
    };
    fixture.detectChanges();
    expect(component.displayText).toBe('LIBRARY.ROLE.CONTRIBUTOR');
  });

  it('should render Consumer', () => {
    component.context = {
      row: { node: { entry: { role: 'SiteConsumer' } } }
    };
    fixture.detectChanges();
    expect(component.displayText).toBe('LIBRARY.ROLE.CONSUMER');
  });

  it('should not render text for unknown', () => {
    component.context = {
      row: { node: { entry: { role: 'ROLE' } } }
    };
    fixture.detectChanges();
    expect(component.displayText).toBe('');
  });
});
