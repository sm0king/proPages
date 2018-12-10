import React, { Component } from 'react';
import { Modal, Table } from 'antd';
import { qeuryAlarmList } from '../../services/api';

// const { Column } = Table;

/**
 * 弹出框选择设备
 */
export default class WarinPoint extends Component {
  state = {
    list: [],
    modalProps: {},
  }

  componentDidMount = async () => {
    const { data: list } = await qeuryAlarmList({pageNo:0,pageSize:10000});
    this.setState({ list });
  }

  componentWillUnmount() {
    this.waitForClickPromise = null;
  }

  getRowProps = (record) => {
    return {
      onClick: () => {
        if (this.waitForClickPromise) {
          // 通过 show 函数来选择设备
          this.waitForClickPromise.resolve(record);
        } else if (this.props.onRowClick) {
          // 调用者自定义的设备选择函数
          this.props.onRowClick(record);
        }
      },
    };
  }

  show = async () => {
    // 设置 Promise
    const promise = new Promise((resolve, reject) => {
      this.waitForClickPromise = { resolve, reject };
    });

    // 显示弹出框
    this.setState({
      modalProps: {
        ...this.state.modalProps,
        visible: true,
      },
    });

    // 等待用户选择或关闭对话框
    const selectedDTU = await promise;

    // 清理变量，关闭对话框
    this.waitForClickPromise = null;
    this.modalCancel();

    return selectedDTU;
  }

  waitForClickPromise = null;

  modalCancel = () => {
    if (this.waitForClickPromise) {
      this.waitForClickPromise.reject();
    }
    this.setState({
      modalProps: {
        ...this.state.modalProps,
        visible: undefined,
      },
    });
  }

  render() {
    const { props } = this;
    const { list, modalProps } = this.state;
    const columns = [
      {title:"简讯Context",dataIndex:"phoneAlarmContent"},
      {title:"Source", dataIndex:"deviceName"},
      {title:"变数名称", dataIndex:"registerName"},
      {title:"参数", dataIndex:"alarmValue"},
    ]

    return (
      <Modal footer={null} onCancel={this.modalCancel} {...modalProps} {...props.modalProps} >
        <Table dataSource={list} columns={columns} rowKey="id" onRow={this.getRowProps} >
          {/* <Column title="简讯Context" dataIndex="externalId" />
          <Column title="Source" dataIndex="dtuName" />
          <Column title="变数名称" dataIndex="deviceName" />
          <Column title="参数" dataIndex="id" />
          <Column title="操作" dataIndex="deviceLocation" /> */}
        </Table>
      </Modal>
    );
  }
}
