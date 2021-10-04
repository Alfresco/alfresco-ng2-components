import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AppDetailsCloudComponent } from './app-details-cloud.component';

export default {
  title: 'AppDetailsCloudComponent',
  component: AppDetailsCloudComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<AppDetailsCloudComponent>;

const Template: Story<AppDetailsCloudComponent> = (args: AppDetailsCloudComponent) => ({
  component: AppDetailsCloudComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    applicationInstance: undefined ,
}