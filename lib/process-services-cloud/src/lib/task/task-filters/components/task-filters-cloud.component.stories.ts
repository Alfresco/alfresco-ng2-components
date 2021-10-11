import { FilterParamsModel } from '@alfresco/adf-process-services';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { TRANSLATION_PROVIDER } from '@alfresco/adf-core';
import { TaskFiltersCloudModule } from '../task-filters-cloud.module';
import { TaskFilterCloudService } from '../services/task-filter-cloud.service';
import { TaskFiltersCloudComponent } from './task-filters-cloud.component';
import { TaskFilterCloudServiceMock } from '../services/task-filter-cloud.service.mock';

export default {
    component: TaskFiltersCloudComponent,
    title: 'Process Services Cloud/Components/Task filters',
    decorators: [
        moduleMetadata({
            imports: [TaskFiltersCloudModule],
            providers: [
                {
                    provide: TRANSLATION_PROVIDER,
                    multi: true,
                    useValue: {
                        name: 'adf-process-services-cloud',
                        source: 'assets/adf-process-services-cloud'
                    },
                },
                { provide: TaskFilterCloudService, useClass: TaskFilterCloudServiceMock }
            ],
        })
    ],
    argTypes: {
        appName: { table: { disable: true } },
        taskId: { table: { disable: true } },
        filterParam: {
            options: ['my', 'queued', 'completed'],
            mapping: {
                my: new FilterParamsModel({ name: 'My tasks' }),
                queued: new FilterParamsModel({ name: 'Queued tasks' }),
                completed: new FilterParamsModel({ name: 'Completed tasks' })
            },
            defaultValue: new FilterParamsModel({ name: 'Queued tasks' })
        }
    }
} as Meta;


const Template: Story<TaskFiltersCloudComponent> = (args: TaskFiltersCloudComponent) => ({
    props: args
});

export const Default = Template.bind({});
Default.args = {
    appName: 'app',
    filterParam: undefined,
    showIcons: false
};

export const FilterParams = Template.bind({});
FilterParams.args = {
    appName: 'app',
    filterParam: new FilterParamsModel({ name: 'Queued tasks' }),
    showIcons: true
};
