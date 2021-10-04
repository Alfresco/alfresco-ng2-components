import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PeopleCloudWidgetComponent } from './people-cloud.widget';

export default {
  title: 'PeopleCloudWidgetComponent',
  component: PeopleCloudWidgetComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<PeopleCloudWidgetComponent>;

const Template: Story<PeopleCloudWidgetComponent> = (args: PeopleCloudWidgetComponent) => ({
  component: PeopleCloudWidgetComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}