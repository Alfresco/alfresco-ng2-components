import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UploadCloudWidgetComponent } from './upload-cloud.widget';

export default {
  title: 'UploadCloudWidgetComponent',
  component: UploadCloudWidgetComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<UploadCloudWidgetComponent>;

const Template: Story<UploadCloudWidgetComponent> = (args: UploadCloudWidgetComponent) => ({
  component: UploadCloudWidgetComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}