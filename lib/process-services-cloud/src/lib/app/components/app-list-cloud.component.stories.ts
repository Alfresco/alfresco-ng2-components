import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AppListCloudComponent } from './app-list-cloud.component';

export default {
  title: 'AppListCloudComponent',
  component: AppListCloudComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<AppListCloudComponent>;

const Template: Story<AppListCloudComponent> = (args: AppListCloudComponent) => ({
  component: AppListCloudComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    layoutType:  AppListCloudComponent.LAYOUT_GRID,
}