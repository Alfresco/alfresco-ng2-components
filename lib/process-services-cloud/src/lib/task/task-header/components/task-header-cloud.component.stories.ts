import { MaterialModule, TranslateLoaderService, UserPreferencesService } from '@alfresco/adf-core';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TaskHeaderCloudComponent } from './task-header-cloud.component';
import { TaskCloudServiceMock } from '../mocks/task-cloud.service.mock';
import { of } from 'rxjs';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProcessServicesCloudModule } from '../../../process-services-cloud.module';
import { TaskCloudService } from '../../services/task-cloud.service';

export default {
  title: 'TaskHeaderCloudComponent',
  component: TaskHeaderCloudComponent,
  decorators: [
    moduleMetadata({
      imports: [TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderService,
        },
    }), MaterialModule, BrowserAnimationsModule, ProcessServicesCloudModule.forRoot()],
      providers: [
        TranslateService,
        { provide: TaskCloudService, useClass: TaskCloudServiceMock },
        { provide: UserPreferencesService, useValue: { select: () => of() } }
      ]
    })
  ],
} as Meta<TaskHeaderCloudComponent>;

const Template: Story<TaskHeaderCloudComponent> = (args: TaskHeaderCloudComponent) => ({
  component: TaskHeaderCloudComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    appName:  'applicationName',
    taskId:  'taskId',
    showTitle:  true,
}