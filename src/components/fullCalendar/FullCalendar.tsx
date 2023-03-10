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

type State = {
  selectedMonth: number,
  selectedYear: number,
}

export default class FullCalendar extends ControlledComponent<any, State> {
  private calendarData: any[];
  private days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Ahad"];

  private currentMonth: number;
  private currentYear: number;

  private begin = { week: 1, day: 3, dayCount: 31, info: "" };
  private begin_old = { week: 0, day: 0, dayCount: 0, info: "" };

  private running_month: number;
  private running_year: number;

  constructor(props: any) {
    super(props);
    this.state = {
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
    }

    this.calendarData = [];
    this.currentMonth = 7;// 0; 
    this.begin = { week: 1, day: 3, dayCount: 31, info: "" };
    this.begin_old = { week: 0, day: 0, dayCount: 0, info: "" };
    this.currentYear = 1945;
    this.running_month = 7;
    this.running_year = 1945;
  }
  get date_info() {
    return document.getElementById("date-info") as HTMLInputElement;
  }
  componentDidMount() {
    this.loadCalendar();
  }
  createTable = () => {
    //console.log("BUAT this.tabel"); 
    let calendarData = [];
    for (let r = 1; r <= 6; r++) {
      for (let i = 1; i <= 7; i++) {
        calendarData.push({ day: i, week: r });
      }
    }
    this.calendarData = calendarData;
  }
  getEventByDate = (month: number, year: number) => {
    if (this.props.getEventByDate)
      this.props.getEventByDate(month, year);
  }
  getEventDetail = (day: number): any[] => {
    if (this.props.getEventDetail) {
      return this.props.getEventDetail(day);
    }
    return [];
  }
  loadCalendar = () => {
    this.createTable();
    this.begin_old = this.begin;
    this.begin = this.fillDay(this.currentMonth, this.begin);

    this.setCalendar();
    this.setState({ selectedMonth: new Date().getMonth() + 1, selectedYear: new Date().getFullYear() });
  }
  setCalendar = () => {
    this.doSetCalendar();
  }
  doSetCalendar = () => {
    console.log('--Start--');

    this.running_month = this.state.selectedMonth;
    this.running_year = this.state.selectedYear ? this.state.selectedYear : new Date().getFullYear();
    let diff_year = Math.abs(this.running_year - this.currentYear);
    // alert("diff_year year:" + diff_year);
    let monthCount = 0;
    if (diff_year > 0)
      monthCount = (11 - this.currentMonth) + (diff_year > 1 ? ((diff_year - 1) * 12) : 0) + (+this.running_month);
    else
      monthCount = this.running_month - this.currentMonth;
    let less = false;
    if (this.running_year - this.currentYear > 0) {
      less = false;
    } else if (this.running_year - this.currentYear < 0) {
      less = true;
    } else {
      if (this.running_month - this.currentMonth > 0) {
        less = false;
      } else {
        less = true;
      }
    }
    monthCount = Math.abs(monthCount);
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
      let pastMonthCount = (this.currentMonth) + (diff_year > 1 ? ((diff_year - 1) * 12) : 0) + (11 - this.running_month);
      endMonth = (pastMonthCount + this.currentMonth);
      //console.log("month now", this.month_now, "diff_year", monthCount, "from", to);
      let begin_month = this.currentMonth;
      for (let b = endMonth + 1; b >= begin_month + 1; b--) {
        if (current_month < 0) {
          current_month = 11;
        }
        this.currentMonth = current_month;
        let end = this.prevMonth();
        if (end) {
          break;
        }
        ////console.log("b",b,"month",current_month);
        current_month--;
      }
    }

    this.fillInfo();
    console.log("==end==")
  }
  fillInfo = () => {
    if (this.date_info)
      this.date_info.value = timeLineConstant.month[this.currentMonth].name + " " + this.currentYear;
    this.refresh();
  }
  detail = (day: number, month: number, year: number) => {
    if (this.props.detail) {
      this.props.detail(day, month, year);
    }
  }
  prevMonth = () => {
    // this.forceUpdate();
    return this.doPrevMonth(false);
  }
  doPrevMonth = (prev: boolean) => {
    this.currentMonth--;
    if (prev) {
      this.running_month--;
    }
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
      if (prev) {
        this.running_month = 11;
        this.running_year--;
      }
    }
    let begin_prev = this.findBegin(this.begin_old, this.begin_old.dayCount);

    this.begin_old = {
      week: begin_prev.week,
      day: begin_prev.day,
      dayCount: begin_prev.dayCount,
      info: '',
    }
    let switch_ = this.fillDay(this.currentMonth, begin_prev);
    this.begin = {
      week: switch_.week,
      day: switch_.day,
      dayCount: switch_.dayCount,
      info: '',
    }
    this.refresh();
    return switch_.info == "NOW";
  }

  nextMonth = () => {
    return this.doNextMonth(false);
  }

  refresh = () => {
    if (this.props.refresh) {
      this.props.refresh(this.currentMonth, this.currentYear);
    }
    this.forceUpdate();
  }

  doNextMonth = (next: boolean) => {
    console.log("NEXT")
    this.currentMonth++;
    if (next) {
      this.running_month++;
    }
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
      if (next) {
        this.running_month = 0;
        this.running_year++;
      }
    }

    let switch_ = this.fillDay(this.currentMonth, this.begin);
    this.begin_old = {
      week: this.begin.week,
      day: this.begin.day,
      dayCount: this.begin.dayCount,
      info: '',
    }
    this.begin = {
      week: switch_.week,
      day: switch_.day,
      dayCount: switch_.dayCount,
      info: '',
    }
    this.refresh();
    return switch_.info == "NOW";

  }

  findBegin = (begin_old_: typeof this.begin, totalday: number) => {
    let M = this.currentMonth - 1;
    if (M < 0) {
      M = 11;
    }
    let day = begin_old_.day;
    let week = 6;
    let begin_prev_ = {
      week: 0,
      day: 0,
      dayCount: timeLineConstant.month[M].day,
      info: '',
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

  setElementByAttr = (val: number, val2: number, day: number) => {
    for (let i = 0; i < this.calendarData.length; i++) {
      let data = this.calendarData[i];

      if (data.week == val && data.day == val2) {
        if (new Date().getDate() == day &&
          new Date().getMonth() == this.currentMonth &&
          new Date().getFullYear() == this.currentYear) {

          console.log("NOW", i);
          this.calendarData[i].now = true;
        } else {
          //   console.log("NOT NOW", i);
          this.calendarData[i].now = false;
        }
        this.calendarData[i].text = day;
      }
    }
  }

  clear = () => {
    for (let i = 0; i < this.calendarData.length; i++) {
      this.calendarData[i].text = "";
    }
    timeLineConstant.month[1].day = 28 + (+this.currentYear % 4 == 0 ? 1 : 0);
  }

  fillDay = (current_month: number, begin: typeof this.begin) => {
    this.clear();
    let begin_new = {
      week: begin.week,
      day: begin.day,
      dayCount: begin.dayCount,
      info: '',
    };
    let week_ = begin_new.week;
    if (begin_new.week > 1 && begin_new.day > 1) {
      week_ = 1;
    }
    let day_ = begin_new.day;
    let isNow = this.running_month == current_month && this.running_year == this.currentYear;
    //  console.log("isNow", isNow,this.running_month,'=',current_month, this.running_month == current_month,this.running_year,'=',this.year_now, this.running_year == this.year_now)
    for (let d = 1; d <= timeLineConstant.month[current_month].day; d++) {
      if (day_ > 7) {
        day_ = 1;
        week_++;
      }
      if (isNow) {
        this.setElementByAttr(week_, day_, d);
      }
      day_++;
    }
    begin_new.week = week_ >= 5 ? 2 : 1;
    begin_new.day = day_;
    begin_new.dayCount = timeLineConstant.month[current_month].day;
    //console.log("old", begin_old_.day, begin_old_.week);
    //console.log("   ");
    //console.log("new", begin_new.day, begin_new.week);
    this.fillInfo();
    if (isNow) {
      // this.detail(null, (+this.running_month + 1), this.running_year);
      begin_new.info = "NOW";
      this.getEventByDate(this.running_month + 1, this.running_year);
    } else {
      begin_new.info = "SOME-DAY";
    }
    return begin_new;
  }

  render() {
    //validate division
    const { selectedYear } = this.state;

    let totalCalendarData = this.days.map(day => {
      return ({ text: day, title: true, now: false })
    })

    this.calendarData.forEach(element => {
      totalCalendarData.push(element);
    });

    const calendarData = totalCalendarData.map((data) => {
      if (data.text == null || data.text == "") {
        return <div key={uniqueId()}></div>
      }
      let style: React.CSSProperties = { width: '80%', minHeight: '150px', marginBottom: '15px' };
      if (data.title == true) {
        return (<div key={uniqueId()}>{data.text}</div>)
      }
      if (data.now == true) {
        style = {
          ...style,
          backgroundColor: 'lightgreen'
        }
      }

      const events = this.getEventDetail(+data.text);
      const eventList = events.map((event, i) => {
        if (i <= 3) {
          return <p key={"EVT_" + i}>{event.name}</p>
        } else if (i == 4) {
          return <ActionButton key={uniqueId()} onClick={() => { }}>More</ActionButton>
        } else {
          return null;
        }
      });

      return (
        <div key={uniqueId()} style={style}>
          <p>{data.text}</p>
          <button type="button" onClick={() => this.detail(parseInt(data.text), this.currentMonth, this.currentYear)}>
            Detail
          </button>
          {eventList}
        </div>
      );
    }
    )

    const dateInfoText = timeLineConstant.month[this.currentMonth].name + ' ' + this.currentYear;
    return (
      <div className="calendar-wrapper">
        <div className="period-selection mt-2 mb-2">
          <select
            className="form-control"
            name="selectedMonth"
            defaultValue={this.state.selectedMonth}
            onChange={this.handleInputChange}
          >
            {timeLineConstant.month.map((m, i) => {
              return <option key={m.name} value={i}>{m.name}</option>
            })}
          </select>
          <input className="form-control" type="number" name="inputYearValue" value={selectedYear} onChange={this.handleInputChange} />
          <button type="button" className="btn btn-dark" onClick={this.setCalendar}>Go</button>
        </div>
        <div className="period-selection mb-5">
          <button type="button" className="btn btn-dark" onClick={(e) => this.doPrevMonth(true)}>Prev</button>
          <input value={dateInfoText} className="form-control" id="date-info" disabled />
          <button type="button" className="btn btn-dark" onClick={(e) => this.doNextMonth(true)}>Next</button>
        </div>
        <GridComponent cols={7} items={calendarData} style={{}} />
      </div>
    );
  }
}
