import { resolve } from 'inversify-react';
import FullCalendar from '../../../components/fullCalendar/FullCalendar';
import { ViewTemplate } from '../../../layout/ViewTemplate';
import { BasePage } from '../../BasePage';
import BaseState from './../../../models/BaseState';
import MasterDataResult from './../../../models/MasterDataResult';
import School from './../../../models/School';
import MasterDataService from './../../../services/MasterDataService';
import CalendarEventService from '../../../services/CalendarEventService';
import './CalendarEventManagement.scss';
import CalendarEventRes from './../../../models/res/CalendarEventRes';
import ActionButton from '../../../components/buttons/ActionButton';
import CalendarEventReq from './../../../models/req/CalendarEventReq';
import { useState } from 'react';
import { DialogType } from '../../../constants/DialogType';

type Period = { month: number, year: number }

type State = {
  schools: School[],
  divisions: string[],
  activityTypes: string[],
  period: Period,
  selectedSchool?: School;
  selectedDivision?: string;
  events: CalendarEventRes[];
} & BaseState

const mapEventsByDate = (events: CalendarEventRes[]) => {
  const res: CalendarEventRes[] = [];
  for (let i = 0; i < events.length; i++) {
    res[events[i].day] = events[i];
  }
  return res;
}

export default class CalendarEventManagement extends BasePage<any, State> {
  @resolve(MasterDataService)
  private masterData: MasterDataService;
  @resolve(CalendarEventService)
  private calendarService: CalendarEventService;
  constructor(props: any) {
    super(props, true, 'Academic Calendar');
    const now = new Date();
    this.state = {
      events: [],
      schools: [],
      divisions: [],
      activityTypes: [],
      selectedSchool: undefined,
      selectedDivision: undefined,
      error: undefined,
      busy: false,
      message: '',
      period: { month: now.getMonth() + 1, year: now.getFullYear() },
    };
  }
  componentDidMount() {
    this.loadSchool();
    this.loadDivisions();
    this.loadActivityTypes();
  }
  loadDivisions = () => {
    this.calendarService.getDivisions()
      .then((divisions) => this.setState({ divisions }))
      .catch(this.toast.showDanger);
  }
  loadSchool = () => {
    this.masterData.list<School>('schools', 0, 10)
      .then(this.onSchoolLoaded)
      .catch(this.toast.showDanger);
  }
  loadActivityTypes = () => {
    this.calendarService.getActivityTypes()
      .then((activityTypes) => this.setState({ activityTypes }))
      .catch(this.toast.showDanger);
  }
  setPeriod = (month: number, year: number) => {
    this.setState({ period: { month: month + 1, year } }, this.loadData);
  }
  onSchoolLoaded = (resp: MasterDataResult<School>) => {
    this.setState({ schools: resp.items });
  }
  selectSchool = (selectedSchool: School) => this.setState({ selectedSchool });
  selectDivision = (selectedDivision: string) => this.setState({ selectedDivision });
  loadData = () => {
    const { period, selectedSchool, selectedDivision } = this.state;
    if (!selectedDivision || !selectedSchool) {
      return;
    }
    this.calendarService.getEvents(period.month, period.year, selectedSchool.id, selectedDivision)
      .then(this.onEventsLoaded)
      .catch(this.toast.showDanger);
  }
  onEventsLoaded = (events: CalendarEventRes[]) => this.setState({ events: mapEventsByDate(events) });
  deleteEvent = async (id: number) => {
    const ok = await this.dialog.showConfirm('Delete Event', 'Are you sure to delete this event?', DialogType.ERROR);
    if (ok) {
      this.calendarService.delete(id)
        .then(() => {
          this.toast.showSuccess('Data successfully removed');
          this.dialog.dismissAlert();
          this.loadData();
        })
        .catch(this.toast.showDanger);
    }
  }
  editEvent = (event: CalendarEventRes) => {
    const req: CalendarEventReq = {
      day: event.day,
      month: event.month,
      year: event.year,
      schoolId: event.schoolId,
      division: event.division,
      description: event.description,
      activity: event.activity as any,
    };
    const onSubmit = (payload: CalendarEventReq) => this.submitUpdatedEvent(event.id, payload);
    this.showEventForm('Edit Event', req, event.schoolName, onSubmit);
  }
  createEvent = (day: number, month: number, year: number) => {
    const { selectedDivision, selectedSchool } = this.state;
    if (!selectedDivision || !selectedSchool) {
      this.toast.showDanger('Please select school and division!');
      return;
    }
    const event: CalendarEventReq = {
      day,
      month,
      year,
      schoolId: selectedSchool.id,
      division: selectedDivision,
      description: '',
      activity: 'ACTIVE',
    };
    this.showEventForm('Create Event', event, selectedSchool.name, this.submitNewEvent);
  }
  showEventForm = (title: string, ev: CalendarEventReq, schoolName: string, onSubmit: (ev: CalendarEventReq) => any) => {
    const { activityTypes } = this.state;
    this.dialog.showContent(title, <CreateEventForm event={ev} schoolName={schoolName} activityTypes={activityTypes} onSubmit={onSubmit} />);
  }
  submitNewEvent = (ev: CalendarEventReq) => {
    this.calendarService.insert(ev)
      .then(() => {
        this.toast.showSuccess('Data successfully inserted');
        this.dialog.dismissAlert();
        this.loadData();
      })
      .catch(this.toast.showDanger);
  }
  submitUpdatedEvent = (id: number, ev: CalendarEventReq) => {
    this.calendarService.update(id, ev)
      .then(() => {
        this.toast.showSuccess('Data successfully updated');
        this.dialog.dismissAlert();
        this.loadData();
      })
      .catch(this.toast.showDanger);
  }
  render() {
    const { schools, selectedSchool, divisions, selectedDivision, events } = this.state;
    return (
      <ViewTemplate title="Academic Calendar" back="/admin">
        <div className="row">
          <div className="col-md-3">
            <h3>Configure Event</h3>
            <SelectSchool selectedSchool={selectedSchool} schools={schools} onSelect={this.selectSchool} />
            <SelectDivision selectedDivision={selectedDivision} divisions={divisions} onSelect={this.selectDivision} />
            {selectedSchool && selectedDivision && (
              <div className="pt-2">
                <button className="btn btn-success" onClick={this.loadData}>Load Data</button>
              </div>
            )}
          </div>
          <div className="col-md-9">
            <FullCalendar
              onLoad={this.setPeriod}
              render={(d, monthFromZero, y, now) =>
                <CalendarItem
                  day={d}
                  month={monthFromZero + 1}
                  year={y}
                  now={now}
                  event={events[d]}
                  addEvent={this.createEvent}
                  edit={this.editEvent}
                  deleteEvent={this.deleteEvent}
                />
              }
            />
          </div>
        </div>
      </ViewTemplate>
    );
  }
}

const CreateEventForm: React.FC<{ event: CalendarEventReq, schoolName: string, activityTypes: string[], onSubmit(ev: CalendarEventReq): any }>
= function ({ event, schoolName, activityTypes, onSubmit }) {
  const [activity, setActivity] = useState<string>(event.activity);
  const [description, setDescription] = useState<string>(event.description);
  const onActivityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActivity(e.target.value);
  }
  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    event.activity = activity as any;
    event.description = description;
    onSubmit(event);
  };
  return (
    <form onSubmit={submit}>
      <table className="table">
        <thead>
          <tr>
            <th>Period</th>
            <th>School</th>
            <th>Division</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{event.day}-{event.month}-{event.year}</td>
            <td>{schoolName}</td>
            <td>{event.division}</td>
          </tr>
        </tbody>
      </table>
      <p>Activity</p>
      <p>
        <select className="form-control form-control-sm" onChange={onActivityChange} value={activity}>
          {activityTypes.map((a) => <option key={`activity-${a}`} value={a}>{a}</option>)}
        </select>
      </p>
      <p>Description</p>
      <p>
        <textarea className="form-control" onChange={onDescriptionChange} value={description} />
      </p>
      <button type="submit" className="btn btn-dark">Submit</button>
    </form>
  );
};

const SelectSchool: React.FC<{ selectedSchool?: School, schools: School[], onSelect(s: School): any }> = function ({ selectedSchool, schools, onSelect }) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = schools.find(s => s.id === parseInt(e.target.value));
    if (selected)
      onSelect(selected);
  };
  return (
    <div>
      <p>School</p>
      <select className="form-control" value={selectedSchool?.id} onChange={onChange}>
        <option value="">-- Select school --</option>
        {schools.map((s) => <option key={s.code} value={s.id}>{s.name}</option>)}
      </select>
    </div>
  );
};
const SelectDivision: React.FC<{ selectedDivision?: string, divisions: string[], onSelect(s: string): any }> = function ({ selectedDivision, divisions, onSelect }) {
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value.trim() !== '')
      onSelect(e.target.value);
  };
  return (
    <div>
      <p>Division</p>
      <select className="form-control" value={selectedDivision} onChange={onChange}>
        <option value="">-- Select division --</option>
        {divisions.map((d) => <option key={`cal-event-division-${d}`} value={d}>{d}</option>)}
      </select>
    </div>
  );
};

const CalendarItem: React.FC<{
  day: number,
  month: number,
  year: number,
  now: boolean,
  event: CalendarEventRes | undefined,
  addEvent(d: number, m: number, year: number): any,
  edit(event: CalendarEventRes): any,
  deleteEvent(eventId: number): any,
}> = function ({ day, month, year, now, event, addEvent, edit, deleteEvent }) {
  return (
    <div className="cal-event-item me-1 px-1 border mb-1">
      <h2>{day}{now && ' * '}</h2>
      {event && <p>{event.description}</p>}
      <div className="cal-event-item-footer">
        {event ?
          (
            <div className="cal-event-item-action">
              <ActionButton
                className="btn btn-warning btn-sm"
                iconClass="fas fa-edit"
                onClick={() => edit(event)}
              />
              <ActionButton
                className="btn btn-danger btn-sm"
                iconClass="fas fa-times"
                onClick={() => deleteEvent(event.id)}
              />
            </div>
          ) :
          (
            <div className="cal-event-item-action">
              <ActionButton
                className="btn btn-text btn-sm"
                iconClass="fas fa-plus"
                onClick={() => addEvent(day, month, year)}
              />
            </div>
          )
        }
      </div>
    </div>
  );
};
