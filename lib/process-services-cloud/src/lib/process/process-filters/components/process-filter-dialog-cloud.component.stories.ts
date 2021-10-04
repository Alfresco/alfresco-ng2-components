import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ProcessFilterDialogCloudComponent } from './process-filter-dialog-cloud.component';

export default {
  title: 'ProcessFilterDialogCloudComponent',
  component: ProcessFilterDialogCloudComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<ProcessFilterDialogCloudComponent>;

const Template: Story<ProcessFilterDialogCloudComponent> = (args: ProcessFilterDialogCloudComponent) => ({
  component: ProcessFilterDialogCloudComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
}