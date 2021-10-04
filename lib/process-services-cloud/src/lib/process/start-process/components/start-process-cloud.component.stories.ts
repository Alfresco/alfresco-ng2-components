import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { StartProcessCloudComponent } from './start-process-cloud.component';

export default {
  title: 'StartProcessCloudComponent',
  component: StartProcessCloudComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<StartProcessCloudComponent>;

const Template: Story<StartProcessCloudComponent> = (args: StartProcessCloudComponent) => ({
  component: StartProcessCloudComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    appName:  '',
    maxNameLength:  StartProcessCloudComponent.MAX_NAME_LENGTH,
    name:  '',
    processDefinitionName:  '',
    variables:  ,
    values:  ,
    showSelectProcessDropdown:  true,
}