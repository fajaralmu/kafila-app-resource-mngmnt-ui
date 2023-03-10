import FullCalendar from '../../../components/fullCalendar/FullCalendar';
import { ViewTemplate } from '../../../layout/ViewTemplate';
import { BasePage } from '../../BasePage';

export default class CalendarEventManagement extends BasePage<any, any> {
  constructor(props: any) {
    super(props, true, 'Academic Calendar')
  }
  render() {
    return (
      <ViewTemplate title="Academic Calendar" back="/admin">
        <FullCalendar />
      </ViewTemplate>
    );
  }
}
