import React, { Component } from 'react';
import { Calendar } from 'antd';

import style from './style.less';

export default class CalendrSelect extends Component {
  state = {
    selectDay: [],
  }
  render() {
    const stateHave = (time) => {
      const isHave = this.state.selectDay.findIndex((item) => {
        return item.format('YYYY-MM-DD') === time.format('YYYY-MM-DD');
      });
      return isHave;
    };
    const dateFullCellRender = (value) => {
      if (stateHave(value) >= 0) {
        return (
          <div className={style.selectday}>{value.format('DD')}</div>);
      } else {
        return <div className={style.day} >{value.format('DD')}</div>;
      }
    };
    const selectTime = (value) => {
      const { selectDay } = this.state;
      const datIndex = stateHave(value);
      if (datIndex >= 0) {
        selectDay.splice(datIndex, 1);
      } else {
        selectDay.push(value);
      }
      this.setState({
        selectDay,
      });
      this.props.onChange(this.state.selectDay);
    };
    return (
      <div className={style.CalendarBox} style={{ width: 350, border: '1px solid #d9d9d9', borderRadius: 4 }}>
        <Calendar
          fullscreen={false}
          dateFullCellRender={dateFullCellRender}
          onSelect={selectTime}
        />
      </div>
    );
  }
}
