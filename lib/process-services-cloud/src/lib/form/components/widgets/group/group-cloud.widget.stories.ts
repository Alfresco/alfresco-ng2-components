import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { GroupCloudWidgetComponent } from './group-cloud.widget';

export default {
  title: 'GroupCloudWidgetComponent',
  component: GroupCloudWidgetComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<GroupCloudWidgetComponent>;

const Template: Story<GroupCloudWidgetComponent> = (args: GroupCloudWidgetComponent) => ({
  component: GroupCloudWidgetComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}