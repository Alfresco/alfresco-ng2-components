import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DateRangeFilterComponent } from './date-range-filter.component';

export default {
  title: 'DateRangeFilterComponent',
  component: DateRangeFilterComponent,
  decorators: [
    moduleMetadata({
      imports: [],
    })
  ],
} as Meta<DateRangeFilterComponent>;

const Template: Story<DateRangeFilterComponent> = (args: DateRangeFilterComponent) => ({
  component: DateRangeFilterComponent,
  props: args,
});


export const Primary = Template.bind({});
Primary.args = {
    processFilterProperty:  ,
    options:  ,
}