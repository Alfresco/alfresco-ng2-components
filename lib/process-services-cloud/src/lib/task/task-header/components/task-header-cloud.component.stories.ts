import { TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TaskHeaderCloudComponent } from './task-header-cloud.component';
import { TaskCloudServiceMock } from '../mocks/task-cloud.service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TaskHeaderCloudModule } from '../task-header-cloud.module';

export default {
    title: 'Process Services Cloud/Components/Task Header',
    component: TaskHeaderCloudComponent,
    decorators: [
        moduleMetadata({
            imports: [TaskHeaderCloudModule, BrowserAnimationsModule],
            providers: [
                {
                    provide: TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'adf-process-services-cloud',
                        source: 'assets/adf-process-services-cloud'
                    }
                },
                { provide: TaskCloudService, useClass: TaskCloudServiceMock }
            ],
        })
    ],
    argTypes: {
        appName: { table: { disable: true } },
        taskId: { table: { disable: true } }
    }
} as Meta<TaskHeaderCloudComponent>;

const Template: Story<TaskHeaderCloudComponent> = (args: TaskHeaderCloudComponent) => ({
    props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    appName: 'applicationName',
    taskId: '68d54a8f-01f3-11e9-8e36-0a58646002ad',
    showTitle: false,
}

export const NotEditable = Template.bind({});
NotEditable.args = {
    appName: 'applicationName',
    taskId: 'mock-task-id',
    showTitle: false,
};

export const ShowTitle = Template.bind({});
ShowTitle.args = {
    appName: 'applicationName',
    taskId: '68d54a8f-01f3-11e9-8e36-0a58646002ad',
    showTitle: true,
};
