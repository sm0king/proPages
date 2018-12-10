import React, { PureComponent } from 'react';
import { Icon, Table, Button } from 'antd';
// import { connect } from 'dva';

import ProjectBreadcrumb from '../../components/GlobalHeader/ProjectBreadcrumb';

import { deviceStat, queryRefreshStat } from '../../services/api';
/* @connect(({ loading }) => ({
  loading,
})) */
export default class Online extends PureComponent {
  state ={
    list: [],
    loading: false,
  }
  componentDidMount = async () => {
    this.setState({
      loading: true,
    });
    const { data: list, paginNation } = await deviceStat({
      pageSize: 10,
      pageNo: 0,
    });
    paginNation.current = paginNation.pageNo;
    this.setState({
      list,
      loading: false,
      paginNation,
      pageNo: paginNation.pageNo,
      pageSize: paginNation.pageSize,
    });
  }
  changePagin = (page, pageSize) => {
    this.setState({
      pageNo: page,
      pageSize,
    }, this.refresh);
  }
  refresh = async () => {
    this.setState({
      loading: true,
    });
    const { data: list, paginNation } = await queryRefreshStat({
      pageSize: this.state.pageSize,
      pageNo: this.state.pageNo,
    });
    paginNation.current = paginNation.pageNo;
    this.setState({
      list,
      loading: false,
      paginNation,
      pageNo: paginNation.pageNo,
      pageSize: paginNation.pageSize,
    });
  }
  render() {
    const columns = [{
      title: '对外ID',
      dataIndex: 'externalId',
    }, {
      title: 'DTU',
      dataIndex: 'dtuName',
    }, {
      title: '设备名称',
      dataIndex: 'deviceName',
    }, {
      title: '设备ID',
      dataIndex: 'deviceId',
    }, {
      title: 'status',
      dataIndex: 'onlineStatus',
      render: (text) => {
        return text === 1 ? '在线' : '离线';
      },
    }, {
      title: 'Last Call',
      dataIndex: 'lastCall',
    }, {
      title: 'Use Times',
      dataIndex: 'useTimes',
    }, {
      title: 'Connect',
      dataIndex: 'connectCount',
    }, {
      title: 'Disconnect',
      dataIndex: 'disconnectCount',
    }];
    const paginNation = {
      ...this.state.paginNation,
      onChange: this.changePagin,
    };
    return (
      <div style={{ overflow: 'scroll' }}>
        <ProjectBreadcrumb arrBread={[]} />
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>
          连线状态
          <Button style={{marginLeft: '12px'}} size="small" onClick={() => this.refresh()} >
            <Icon type="reload" />
          </Button>
        </h3>
        
        <Table
          scroll={{x: 1000}}
          loading={this.state.loading}
          dataSource={this.state.list}
          pagination={paginNation}
          rowKey="id"
          columns={columns}
          // style={{ minWidth: '600px' }}
        />
      </div>
    );
  }
}
