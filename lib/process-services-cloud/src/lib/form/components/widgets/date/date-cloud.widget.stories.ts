import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DateCloudWidgetComponent } from './date-cloud.widget';

export default {
  title: 'DateCloudWidgetComponent',
  component: DateCloudWidgetComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<DateCloudWidgetComponent>;

const Template: Story<DateCloudWidgetComponent> = (args: DateCloudWidgetComponent) => ({
  component: DateCloudWidgetComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}