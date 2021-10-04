import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { StartTaskCloudComponent } from './start-task-cloud.component';

export default {
  title: 'StartTaskCloudComponent',
  component: StartTaskCloudComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<StartTaskCloudComponent>;

const Template: Story<StartTaskCloudComponent> = (args: StartTaskCloudComponent) => ({
  component: StartTaskCloudComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    appName:  '',
    maxNameLength:  StartTaskCloudComponent.MAX_NAME_LENGTH,
    name:  '',
}