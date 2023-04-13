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

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  ComponentFactoryResolver,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';
import { ExtensionService } from '../../services/extension.service';

@Component({
  selector: 'adf-dynamic-column',
  template: `
    <ng-container #content></ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'adf-dynamic-column' },
  styles: [
    `
      .adf-dynamic-column {
        display: flex;
        align-items: center;
        width: inherit;
      }
    `
  ]
})
export class DynamicColumnComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('content', { read: ViewContainerRef, static: true })
  content: ViewContainerRef;

  @Input()
  id: string;

  @Input()
  context: any;

  private componentRef: ComponentRef<any>;

  constructor(
    private extensions: ExtensionService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit() {
    const componentType = this.extensions.getComponentById(this.id);
    if (componentType) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(
        componentType
      );
      if (factory) {
        this.content.clear();
        this.componentRef = this.content.createComponent(factory, 0);
        this.updateInstance();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.node) {
      this.updateInstance();
    }
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private updateInstance() {
    if (this.componentRef && this.componentRef.instance) {
      this.componentRef.instance.context = this.context;
    }
  }
}
