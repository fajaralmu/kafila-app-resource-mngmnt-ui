import { ViewTemplate } from '../../../layout/ViewTemplate';
import { BasePage } from '../../BasePage';

export default class CalendarEventManagement extends BasePage<any, any> {
  render() {
    return (
      <ViewTemplate title="Academic Calendar" back="/admin">
      </ViewTemplate>
    )
  }
}
