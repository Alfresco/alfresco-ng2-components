import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AttachFileCloudWidgetComponent } from './attach-file-cloud-widget.component';

export default {
  title: 'AttachFileCloudWidgetComponent',
  component: AttachFileCloudWidgetComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<AttachFileCloudWidgetComponent>;

const Template: Story<AttachFileCloudWidgetComponent> = (args: AttachFileCloudWidgetComponent) => ({
  component: AttachFileCloudWidgetComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}