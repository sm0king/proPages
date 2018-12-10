import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Calendar, Card, List } from 'antd';
import moment from 'moment';

import style from './style.less';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class WeekView extends PureComponent {
  state = {
    // timeMode: 'month',
    // calKay: `${moment()}`,
    weeks: moment(),
  }
  // queryTimingViewNode
  componentDidMount() {
    this.props.dispatch({
      type: 'list/queryTimingViewNode',
      time: moment().format('YYYY-MM-DD'),
    });
  }
  /* onPanelChange = (value, mode) => {
    this.setState({
      timeMode: mode,
    });
  } */
  onSelect = async (value) => {
    await this.props.dispatch({
      type: 'list/queryTimingViewNode',
      time: value.format('YYYY-MM-DD'),
    });
    /* if (this.state.timeMode === 'year') {
      this.setState({
        timeMode: 'month',
        // calKay: `${moment()}`,
      });
    } */
    // if (this.state.timeMode === 'month') {
    this.setState({
      weeks: value,
    });
    // 当前为月份。
    // this.showConfirm(moment(value).format('YYYY-MM-DD'));
    // }
  }
  getDayContent = (day) => {
    const wk = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'staturday'][day];
    const conList = this.props.list.weekList[wk] || [];
    return conList.map((item) => {
      return <div key={`${moment()}${Math.random()}`}>{item.nodeContet}</div>;
    });
  }
  listWeek = () => {
    const weeks = moment(this.state.weeks);
    const weekDay = weeks.day();
    const thisDay = weeks.subtract(weekDay - 1, 'd');
    const weeksArry = [];
    for (let i = 0; i < 7; i += 1) {
      const dayItem = {
        id: +thisDay,
        title: `${thisDay.date()}(${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sta'][thisDay.day()]})`,
        isSelect: weekDay === thisDay.day(),
        content: this.getDayContent(thisDay.day()),
      };
      thisDay.add(1, 'd');
      weeksArry.push(dayItem);
    }
    return (
      <List
        grid={{ gutter: 1, column: 7 }}
        dataSource={weeksArry}
        renderItem={item => (
          <List.Item>
            <Card title={item.title} bordered={item.isSelect}>
              {item.content}
            </Card>
          </List.Item>
        )}
      />
    );
  };
  render() {
    return (
      <div className={style.weekList}>
        <div className={style.listLeft}>
          {this.listWeek()}
        </div>
        <div className={style.listRight} style={{ width: 300, border: '1px solid #d9d9d9', borderRadius: 4 }}>
          <Calendar
            fullscreen={false}
            // onPanelChange={this.onPanelChange}
            // key={this.state.calKay}
            // mode={this.state.timeMode}
            onSelect={this.onSelect}
          />
        </div>
      </div>
    );
  }
}
