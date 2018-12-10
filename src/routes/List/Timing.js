import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Popconfirm, Calendar, Modal, Card, Table } from 'antd';
import moment from 'moment';

import styles from '../Profile/AdvancedProfile.less';
import EditModel from './EditModel';
// import WeekView from './WeekView';
import NewWeekView from './NewWeekView';
import { timingDel } from '../../services/api';
import ProjectBreadcrumb from '../../components/GlobalHeader/ProjectBreadcrumb';

const { confirm } = Modal;

const operationTabList = [{
  key: 'tab1',
  tab: '普通时序',
}, {
  key: 'tab2',
  tab: '指定日时序',
}, {
  key: 'tab3',
  tab: '指定全关日',
}, {
  key: 'tab4',
  tab: '查看',
}];

const weekStr = ['', '一', '二', '三', '四', '五', '六', '日'];

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))

export default class Timing extends Component {
  state = {
    operationkey: 'tab1',
    timeMode: 'year',
    calKay: `${Date.now()}`,
    editData: {},
  }
  componentDidMount() {
    // 页面初始化 加载普通节点数据
    const { dispatch } = this.props;
    // 请求普通节点
    dispatch({
      type: 'list/ordinaryNode',
      data: {
        nodeType: 1,
        pageNo: 0,
      },
    });
    // 请求选定日节点
    dispatch({
      type: 'list/specifiedNode',
      data: {
        nodeType: 2,
        pageNo: 0,
      },
    });
  }
  onOperationTabChange = (key) => {
    this.setState({ operationkey: key });
  }
  onPanelChange = (value, mode) => {
    this.setState({
      timeMode: mode,
    });
    if (mode === 'month') {
      this.queryHolidayData(value.format('YYYY-MM'));
    }
  }
  onSelect = (value) => {
    if (this.state.timeMode === 'year') {
      this.setState({
        timeMode: 'month',
        calKay: `${Date.now()}`,
      });
    }
    if (this.state.timeMode === 'month') {
      // 当前为月份。
      // 当前未设置假日
      const setDate = Array.from(this.props.list.isSet);
      const thisSetDate = moment(value).format('YYYY-MM-DD');
      if (setDate.indexOf(thisSetDate) < 0) {
        this.showConfirm(thisSetDate, true);
      } else {
        // 当前日期为假日
        this.showConfirm(thisSetDate, false);
      }
    }
  }
  queryHolidayData = (time) => {
    // const { data } = await getTimingHoliday(time);
    /*  console.log('getTimingHoliday:', data);
    this.setState({
      quHoliday: data,
    }); */
    this.props.dispatch({
      type: 'list/getHolidayData',
      time,
    });
  }
  /* setCal = (el) => {
    this.cal = el;
  } */
  showConfirm = (value, alySet) => {
    const { dispatch } = this.props;
    confirm({
      title: alySet ? '确认设定' : '取消设定',
      content: alySet ? 'set as假日（设定）！！！' : '取消the假日设定！！！',
      onOk() {
        dispatch({
          type: alySet ? 'list/setCalendar' : 'list/celCalendar',
          data: {
            time: [value],
          },
        });
      },
      onCancel() {},
    });
  }
  dateCellRender = (value) => {
    const setDate = Array.from(this.props.list.isSet);
    // setDate = [...setDate, this.state.quHoliday];
    if (setDate.length > 0) {
      return (
        setDate.map((item) => {
          const itemTime = moment(item);
          if (itemTime.date() === value.date() && value.month() === itemTime.month()) {
            return <div key={`${moment()}${Math.random()}`} style={{ width: '100%', height: '100%', backgroundColor: 'orange' }} />;
          } else {
            return <div key={`${moment()}${Math.random()}`} />;
          }
        })
      );
    }
  }
  edit = (e, id) => {
    e.preventDefault();
    if (this.state.operationkey === 'tab1') {
      const editData = this.props.list.advancedOperation1.find(item => item.id === id);
      this.setState({
        editData,
        title: '普通节点设定',
        isShow: true,
        modelKey: +moment(),
      });
    }
    if (this.state.operationkey === 'tab2') {
      const editData = this.props.list.advancedOperation2.find(item => item.id === id);

      this.setState({
        editData,
        title: '指定日节点编辑',
        isShow: true,
        modelKey: +moment(),
      });
    }
  };
  remove = async (id) => {
    const { code } = await timingDel(id);
    if (code === 0) {
      this.refresh();
    }
  }
  hideModel = () => {
    this.setState({
      isShow: false,
    });
    this.refresh();
  }
  refresh = () => {
    const { dispatch } = this.props;
    // 请求普通节点
    dispatch({
      type: 'list/ordinaryNode',
      data: {
        nodeType: 1,
        pageNo: 0,
      },
    });
    // 请求选定日节点
    dispatch({
      type: 'list/specifiedNode',
      data: {
        nodeType: 2,
        pageNo: 0,
      },
    });
  }
  render() {
    const { list, loading } = this.props;
    const { advancedOperation2, advancedOperation1 } = list;

    const dateTitle = this.state.operationkey === 'tab1' ? '星期' : '日期';

    const column1 = [{
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
    }, {
      title: '设备编号',
      dataIndex: 'device',
      width: 150,
    }, {
      title: '功能',
      dataIndex: 'features',
    }, {
      title: dateTitle,
      dataIndex: 'week',
      render: text => {
        return (
          this.state.operationkey === 'tab1' ? text.map(item => weekStr[+item]).join(', ') : text.join(', ')
        )
      },
    }, {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      render: (text, record) => {
        return (
          <span>
            <a onClick={e => this.edit(e, record.id)} style={{marginRight: 8}}>编辑</a>
            {/* <Divider type="vertical" /> */}
            <Popconfirm title="是否要删除？" onConfirm={() => this.remove(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        );
      },
    }];
    const contentList = {
      tab1: (
        <div>
          <Button icon="plus" onClick={e => this.edit(e, 0)} >
            新增节点
          </Button>
          <Table
            scroll={{ x: 1000 }}
            pagination={false}
            loading={loading}
            dataSource={advancedOperation1}
            rowKey="id"
            columns={column1}
          />
        </div>),
      tab2: (
        <div>
          <Button icon="plus" onClick={e => this.edit(e, 0)} >
            新增节点
          </Button>
          <Table
            scroll={{ x: 1000 }}
            pagination={false}
            loading={loading}
            rowKey="id"
            dataSource={advancedOperation2}
            columns={column1}
          />
        </div>),
      tab3: <Calendar
        mode={this.state.timeMode}
        onPanelChange={this.onPanelChange}
        onSelect={this.onSelect}
        key={this.state.calKay}
        dateCellRender={this.dateCellRender}
        disabledDate={current => current && current <= moment().endOf('day').subtract(1, 'd')}
      />,
      tab4: <NewWeekView
        columns={column1}
        // pagination={false}
        // loading={loading}
        // dataSource={advancedOperation4}
      />,
    };
    return (
      <div>
        <ProjectBreadcrumb arrBread={[]} />
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>时序设定</h3>
        <Card
          className={styles.tabsCard}
          bordered={false}
          tabList={operationTabList}
          onTabChange={this.onOperationTabChange}
        >
          {contentList[this.state.operationkey]}
        </Card>
        <EditModel
          value={this.state.editData}
          title={this.state.title}
          isShow={this.state.isShow}
          hideModel={this.hideModel}
          key={this.state.modelKey}
        />
      </div>
    );
  }
}
