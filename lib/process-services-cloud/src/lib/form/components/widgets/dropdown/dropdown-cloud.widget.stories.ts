import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DropdownCloudWidgetComponent } from './dropdown-cloud.widget';

export default {
  title: 'DropdownCloudWidgetComponent',
  component: DropdownCloudWidgetComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<DropdownCloudWidgetComponent>;

const Template: Story<DropdownCloudWidgetComponent> = (args: DropdownCloudWidgetComponent) => ({
  component: DropdownCloudWidgetComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}