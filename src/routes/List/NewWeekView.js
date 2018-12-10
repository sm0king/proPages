import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { DatePicker, Table } from 'antd';
import moment from 'moment';

import style from './style.less';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class NewWeekView extends PureComponent {
  state = {
    // weeks: moment(),
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'list/queryTimingViewNode',
      time: moment().format('YYYY-MM-DD'),
    });
  }
  onSelect = async (value) => {
    await this.props.dispatch({
      type: 'list/queryTimingViewNode',
      time: value.format('YYYY-MM-DD'),
    });
  }
  render() {
    const { list: { weekList }, loading } = this.props;
    const tabCols = [{
      title: '节点',
      dataIndex: 'nodeName',
      width: 100,
    }, {
      title: '时间点',
      dataIndex: 'nodeTime',
      width: 100,
    }, {
      title: '城市',
      dataIndex: 'city',
      width: 100,
    }, {
      title: '设备编号',
      dataIndex: 'device',
      width: 150,
    }, {
      title: '功能',
      dataIndex: 'features',
      width: 60,
    }];
    return (
      <div className={style.weekList}>
        <DatePicker onChange={this.onSelect} />
        <Table
          scroll={{x: 1000}}
          loading={loading}
          rowKey={record => record.id}
          dataSource={weekList}
          columns={tabCols}
        />
      </div>
    );
  }
}
