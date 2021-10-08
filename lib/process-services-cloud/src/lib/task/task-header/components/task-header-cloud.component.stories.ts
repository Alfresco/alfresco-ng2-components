import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { TaskHeaderCloudModule } from '../task-header-cloud.module';
import { TaskHeaderCloudComponent } from './task-header-cloud.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskCloudService } from '../../services/task-cloud.service';
import { TaskCloudServiceMock } from '../../services/task-cloud.service.mock';

export default {
    component: TaskHeaderCloudComponent,
    title: 'Process Services Cloud/Components/Task Header',
    decorators: [
        moduleMetadata({
            declarations: [],
            imports: [TaskHeaderCloudModule, BrowserAnimationsModule],
            providers: [
                { provide: TaskCloudService, useClass: TaskCloudServiceMock },
                {
                    provide: TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'adf-process-services-cloud',
                        source: 'assets/adf-process-services-cloud'
                    }
                },
            ]
        })
    ],
    argTypes: {
        appName: { table: { disable: true } },
        taskId: { table: { disable: true } }
    }
} as Meta;

const Template: Story<TaskHeaderCloudComponent> = (args) => ({
    props: {
        ...args
    }
});

export const AssignedAndEditable = Template.bind({});
AssignedAndEditable.args = {
    appName: 'app',
    showTitle: true,
    taskId: 'mock-assigned-task'
};

export const CompletedAndReadonly = Template.bind({});
CompletedAndReadonly.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-completed-task'
};

export const Suspended = Template.bind({});
Suspended.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-suspended-task'
};

export const WithParentId = Template.bind({});
WithParentId.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-parent-task-id'
};

export const WithoutAssignee = Template.bind({});
WithoutAssignee.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-created-task'
};

export const NotClaimableByUser = Template.bind({});
NotClaimableByUser.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-no-candidate-users'
};

export const TaskNotClaimableByGroupUser = Template.bind({});
TaskNotClaimableByGroupUser.args = {
    ...AssignedAndEditable.args,
    taskId: 'mock-no-candidate-groups'
};

export const InvalidForMissingApp = Template.bind({});
InvalidForMissingApp.args = {
    ...AssignedAndEditable.args,
    appName: undefined,
};

export const InvalidForMissingTaskId = Template.bind({});
InvalidForMissingTaskId.args = {
    ...AssignedAndEditable.args,
    taskId: undefined
};
