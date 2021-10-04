import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ProcessFiltersCloudComponent } from './process-filters-cloud.component';

export default {
  title: 'ProcessFiltersCloudComponent',
  component: ProcessFiltersCloudComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<ProcessFiltersCloudComponent>;

const Template: Story<ProcessFiltersCloudComponent> = (args: ProcessFiltersCloudComponent) => ({
  component: ProcessFiltersCloudComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    appName:  '',
    filterParam:  ,
    showIcons:  false,
}