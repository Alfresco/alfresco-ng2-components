import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { EditProcessFilterCloudComponent } from './edit-process-filter-cloud.component';

export default {
  title: 'EditProcessFilterCloudComponent',
  component: EditProcessFilterCloudComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<EditProcessFilterCloudComponent>;

const Template: Story<EditProcessFilterCloudComponent> = (args: EditProcessFilterCloudComponent) => ({
  component: EditProcessFilterCloudComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    appName:  '',
    role:  '',
    id:  '',
    filterProperties:  EditProcessFilterCloudComponent.DEFAULT_PROCESS_FILTER_PROPERTIES,
    sortProperties:  EditProcessFilterCloudComponent.DEFAULT_SORT_PROPERTIES,
    actions:  EditProcessFilterCloudComponent.DEFAULT_ACTIONS,
    showFilterActions:  true,
    showTitle:  true,
    showProcessFilterName:  true,
    processFilter:  '',
}