import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ProcessHeaderCloudComponent } from './process-header-cloud.component';

export default {
  title: 'ProcessHeaderCloudComponent',
  component: ProcessHeaderCloudComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<ProcessHeaderCloudComponent>;

const Template: Story<ProcessHeaderCloudComponent> = (args: ProcessHeaderCloudComponent) => ({
  component: ProcessHeaderCloudComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    appName:  '',
    processInstanceId:  '',
}