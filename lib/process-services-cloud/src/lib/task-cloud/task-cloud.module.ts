import { NgModule } from '@angular/core';
import { CoreModule } from '@alfresco/adf-core';
import { TaskFiltersCloudComponent } from './task-filters-cloud/task-filters-cloud.component';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [
    CoreModule.forChild(),
    MaterialModule
  ],
  declarations: [
    TaskFiltersCloudComponent
  ],

  exports: [
    TaskFiltersCloudComponent
  ]
})
export class TaskCloudModule { }
