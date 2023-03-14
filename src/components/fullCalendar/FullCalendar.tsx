import React from 'react';
import ControlledComponent from '../../pages/ControlledComponent';
import ActionButton from '../buttons/ActionButton';
import GridComponent from '../grid/GridComponent';
import './FullCalendar.scss';

const timeLineConstant = {
  month: [
    { name: "Januari", day: 31, text: "Januari", value: "1" },
    { name: "Februari", day: 28, text: "Februari", value: "2" },
    { name: "Maret", day: 31, text: "Maret", value: "3" },
    { name: "April", day: 30, text: "April", value: "4" },
    { name: "Mei", day: 31, text: "Mei", value: "5" },
    { name: "Juni", day: 30, text: "Juni", value: "6" },
    { name: "Juli", day: 31, text: "Juli", value: "7" },
    { name: "Agustus", day: 31, text: "Agustus", value: "8" },
    { name: "September", day: 30, text: "September", value: "9" },
    { name: "Oktober", day: 31, text: "Oktober", value: "10" },
    { name: "November", day: 30, text: "November", value: "11" },
    { name: "Desember", day: 31, text: "Desember", value: "12" },
  ],
};

let idSeq = 0;
const uniqueId = () => new Date().getTime().toString() + (++idSeq);

type Week = { dayOfWeek: number, week: number, dayOfMonth: number, now: boolean }
type State = { selectedMonth: number, selectedYear: number }
type Pointer = { week: number, day: number, dayCount: number, now: boolean }
type Props = {
  render(d: number, monthFromZero: number, year: number, now: boolean): any,
  onLoad(monthFromZero: number, y: number): any,
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default class FullCalendar extends ControlledComponent<Props, State> {
  private calendarData: Week[];

  private currentMonth: number;
  private currentYear: number;

  private begin: Pointer;
  private begin_old: Pointer;

  private runningMonth: number;
  private runningYear: number;

  constructor(props: Props) {
    super(props);
    const now = new Date();
    this.state = {
      selectedMonth: now.getMonth(),
      selectedYear: now.getFullYear(),
    };

    this.calendarData = [];
    this.currentMonth = 7;// 0; 
    this.begin = { week: 1, day: 3, dayCount: 31, now: false };
    this.begin_old = { week: 0, day: 0, dayCount: 0, now: false };
    this.currentYear = 1945;
    this.runningMonth = 7;
    this.runningYear = 1945;
  }
  componentDidMount() {
    this.loadCalendar();
  }
  createTable = () => {
    let calendarData: Week[] = [];
    for (let r = 1; r <= 6; r++) {
      for (let i = 1; i <= 7; i++) {
        calendarData.push({ dayOfWeek: i, week: r, dayOfMonth: NaN, now: false });
      }
    }
    this.calendarData = calendarData;
  }
  loadCalendar = () => {
    this.createTable();
    this.begin_old = this.begin;
    this.begin = this.fillDay(this.currentMonth, this.begin);

    this.setCalendar();
  }
  setCalendar = () => {
    this.doSetCalendar();
  }
  doSetCalendar = () => {
    console.log('--Start--');

    this.runningMonth = this.state.selectedMonth;
    this.runningYear = this.state.selectedYear ?? new Date().getFullYear();
    let diff_year = Math.abs(this.runningYear - this.currentYear);

    let monthCount = 0;
    if (diff_year > 0)
      monthCount = Math.abs((11 - this.currentMonth) + (diff_year > 1 ? ((diff_year - 1) * 12) : 0) + (+this.runningMonth));
    else
      monthCount = Math.abs(this.runningMonth - this.currentMonth);

    let less = false;
    if (this.runningYear - this.currentYear > 0) {
      less = false;
    } else if (this.runningYear - this.currentYear < 0) {
      less = true;
    } else {
      if (this.runningMonth - this.currentMonth > 0) {
        less = false;
      } else {
        less = true;
      }
    }
    //console.log("kurang dari: ", less);
    let current_month = this.currentMonth;
    let endMonth = (monthCount + this.currentMonth);

    if (monthCount <= 0)
      return;

    if (!less) {
      for (let m = this.currentMonth + 1; m <= endMonth + 1; m++) {
        if (current_month > 11) {
          current_month = 0;
        }
        this.currentMonth = current_month;
        let end = this.nextMonth();
        if (end) {
          break;
        }
        ////console.log("month",current_month,"this.running_year",this.year_now);
        current_month++;
      }
    } else if (less) {
      let pastMonthCount = (this.currentMonth) + (diff_year > 1 ? ((diff_year - 1) * 12) : 0) + (11 - this.runningMonth);
      endMonth = (pastMonthCount + this.currentMonth);
      //console.log("month now", this.month_now, "diff_year", monthCount, "from", to);
      const begin_month = this.currentMonth;
      for (let b = endMonth + 1; b >= begin_month + 1; b--) {
        if (current_month < 0) {
          current_month = 11;
        }
        this.currentMonth = current_month;
        const end = this.prevMonth();
        if (end) {
          break;
        }
        current_month--;
      }
    }
    console.log("--End--")
  }
  prevMonth = () => this.doPrevMonth(false);
  doPrevMonth = (prev: boolean) => {
    this.currentMonth--;
    if (prev) {
      this.runningMonth--;
    }
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
      if (prev) {
        this.runningMonth = 11;
        this.runningYear--;
      }
    }
    let begin_prev = this.findBegin(this.begin_old, this.begin_old.dayCount);

    this.begin_old = {
      week: begin_prev.week,
      day: begin_prev.day,
      dayCount: begin_prev.dayCount,
      now: false,
    }
    const switch_ = this.fillDay(this.currentMonth, begin_prev);
    this.begin = {
      week: switch_.week,
      day: switch_.day,
      dayCount: switch_.dayCount,
      now: false,
    }
    this.refresh();
    return switch_.now;
  }

  nextMonth = () => {
    return this.doNextMonth(false);
  }

  refresh = () => {
    this.forceUpdate(() => this.props.onLoad(this.currentMonth, this.currentYear));
  }

  doNextMonth = (next: boolean) => {
    console.log("NEXT")
    this.currentMonth++;
    if (next) {
      this.runningMonth++;
    }
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
      if (next) {
        this.runningMonth = 0;
        this.runningYear++;
      }
    }

    const switch_ = this.fillDay(this.currentMonth, this.begin);
    this.begin_old = {
      week: this.begin.week,
      day: this.begin.day,
      dayCount: this.begin.dayCount,
      now: false,
    }
    this.begin = {
      week: switch_.week,
      day: switch_.day,
      dayCount: switch_.dayCount,
      now: false,
    }
    this.refresh();
    return switch_.now;

  }

  findBegin = (begin_old_: typeof this.begin, totalday: number) => {
    let M = this.currentMonth - 1;
    if (M < 0) {
      M = 11;
    }
    let day = begin_old_.day;
    let week = 6;
    let begin_prev_: Pointer = {
      week: 0,
      day: 0,
      dayCount: timeLineConstant.month[M].day,
      now: false,
    }

    for (let D = totalday; D >= 0; D--) {
      if (day <= 0) {
        day = 7;
        week--;
      }
      day--;
    }
    begin_prev_.week = week;
    begin_prev_.day = day + 1;
    return begin_prev_;
  }

  setElementByAttr = (week: number, dayOfWeek: number, dayOfMonth: number) => {
    const now = new Date();
    for (let i = 0; i < this.calendarData.length; i++) {
      let data = this.calendarData[i];

      if (data.week == week && data.dayOfWeek == dayOfWeek) {
        if (now.getDate() == dayOfMonth && now.getMonth() == this.currentMonth && now.getFullYear() == this.currentYear) {
          this.calendarData[i].now = true;
        } else {
          this.calendarData[i].now = false;
        }
        this.calendarData[i].dayOfMonth = dayOfMonth;
      }
    }
  }

  clear = () => {
    for (let i = 0; i < this.calendarData.length; i++) {
      this.calendarData[i].dayOfMonth = NaN;
    }
    timeLineConstant.month[1].day = 28 + (+this.currentYear % 4 == 0 ? 1 : 0);
  }

  fillDay = (current_month: number, begin: typeof this.begin): Pointer => {
    this.clear();
    const begin_new: Pointer = {
      week: begin.week,
      day: begin.day,
      dayCount: begin.dayCount,
      now: false,
    };
    let weekOfMonth = begin_new.week;
    if (begin_new.week > 1 && begin_new.day > 1) {
      weekOfMonth = 1;
    }
    let dayOfWeek = begin_new.day;
    let isNow = this.runningMonth == current_month && this.runningYear == this.currentYear;
    const currentMonthDayCount = timeLineConstant.month[current_month].day;
    for (let dayOfMonth = 1; dayOfMonth <= currentMonthDayCount; dayOfMonth++) {
      if (dayOfWeek > 7) {
        dayOfWeek = 1;
        weekOfMonth++;
      }
      if (isNow) {
        this.setElementByAttr(weekOfMonth, dayOfWeek, dayOfMonth);
      }
      dayOfWeek++;
    }
    begin_new.week = weekOfMonth >= 5 ? 2 : 1;
    begin_new.day = dayOfWeek;
    begin_new.dayCount = currentMonthDayCount;
    begin_new.now = isNow;

    return begin_new;
  }

  render() {
    const { selectedYear } = this.state;
    const { month } = timeLineConstant;
    const calendarTitles = days.map((d) => <div key={`title-${d}`}>{d}</div>);
    const dateInfoText = month[this.currentMonth].name + ' ' + this.currentYear;

    const calendarComponent = this.calendarData.map((data) => {
      if (isNaN(data.dayOfMonth) || data.dayOfMonth < 0) {
        return <area />;
      }
      return this.props.render(data.dayOfMonth, this.currentMonth, this.currentYear, data.now);
    });
    return (
      <div className="calendar-wrapper">
        <div className="period-selection mt-2 mb-2">
          <select
            className="form-control"
            name="selectedMonth"
            defaultValue={this.state.selectedMonth}
            onChange={this.handleInputChange}
          >
            {month.map((m, i) => <option key={m.name} value={i}>{m.name}</option>)}
          </select>
          <input className="form-control" type="number" name="selectedYear" value={selectedYear} onChange={this.handleInputChange} />
          <button type="button" className="btn btn-secondary" onClick={this.setCalendar}>Go</button>
        </div>
        <div className="period-selection mb-5">
          <ActionButton
            iconClass="fas fa-arrow-left"
            className="btn btn-dark"
            onClick={() => this.doPrevMonth(true)}
          />
          <h4 className="text-center">{dateInfoText}</h4>
          <ActionButton
            iconClass="fas fa-arrow-right"
            className="btn btn-dark"
            onClick={() => this.doNextMonth(true)}
          />
        </div>
        <GridComponent cols={7} items={[...calendarTitles, ...calendarComponent]} style={{}} />
      </div>
    );
  }
}
