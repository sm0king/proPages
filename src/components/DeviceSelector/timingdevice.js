import React, { Component } from 'react';
import { Modal, Table } from 'antd';
// import { querytDeviceAndGro } from '../../services/api';

const { Column } = Table;

/**
 * 弹出框选择设备
 */
export default class TimingDevice extends Component {
  state = {
    // list: [],
    modalProps: {},
  }

  componentDidMount = async () => {
    // const { data: list } = await querytDeviceAndGro();
    // this.setState({ list });
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
    const { modalProps } = this.state;

    return (
      <Modal footer={null} onCancel={this.modalCancel} {...modalProps} {...props.modalProps} destroyOnClose >
        <Table dataSource={props.list} rowKey="deviceIdOrGroupId" onRow={this.getRowProps} >
          <Column title="对外ID" dataIndex="deviceCodeOrGroup" />
          <Column title="SYS/DTU" dataIndex="dtuOrSysName" />
          <Column title="设备名称" dataIndex="deviceOrGroupName" />
          <Column title="设备ID" dataIndex="deviceIdOrGroupId" />
          <Column title="设备位置" dataIndex="deviceLocation" />
        </Table>
      </Modal>
    );
  }
}
