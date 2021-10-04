import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ProcessListCloudComponent } from './process-list-cloud.component';

export default {
  title: 'ProcessListCloudComponent',
  component: ProcessListCloudComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<ProcessListCloudComponent>;

const Template: Story<ProcessListCloudComponent> = (args: ProcessListCloudComponent) => ({
  component: ProcessListCloudComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    appName:  '',
    appVersion: '' ,
    initiator:  '',
    id:  '',
    name:  '',
    processDefinitionId:  '',
    processDefinitionName:  '',
    processDefinitionKey:  '',
    status:  '',
    businessKey:  '',
    lastModifiedFrom: '' ,
    lastModifiedTo: '' ,
    startFrom:  '',
    startTo:  '',
    completedFrom:  '',
    completedTo:  '',
    completedDate:  '',
    suspendedFrom:  '',
    suspendedTo:  '',
    selectionMode:  'single',
    multiselect:  false,
    sorting: '' ,
    showActions:  false,
    actionsPosition:  'right',
    stickyHeader:  false,
    showContextMenu:  false,
}