import React, { Component } from 'react';
import { Modal, Table, DatePicker } from 'antd';
import moment from 'moment';
import { qeuryHistory } from '../../services/api';

const { Column } = Table;
const { RangePicker } = DatePicker;

/**
 * 弹出框选择设备
 */
export default class History extends Component {
  state = {
    list: [],
    modalProps: {},
  }

  componentDidMount = async () => {
    // const { data: list } = await qeuryHistory({});
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

  show = async (id, type) => {
    // 设置 Promise
    const { data: list } = await qeuryHistory({
      varId: id,
      startTime: moment().subtract(30, 'd').format('YYYY-MM-DD'),
      endTime: moment().add(1, 'd').format('YYYY-MM-DD'),
      varType: type,
    });
    this.setState({
      varId: id,
      varType: type,
      list,
    });
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
  changeSelect = async (value) => {
    // console.log(value);
    const { data: list } = await qeuryHistory({
      varId: this.state.varId,
      startTime: value[0].format('YYYY-MM-DD'),
      endTime: value[1].add(1, 'd').format('YYYY-MM-DD'),
      varType: this.state.varType,
    });
    this.setState({ list });
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
    const dateFormat = 'YYYY-MM-DD';

    return (
      <Modal footer={null} onCancel={this.modalCancel} {...modalProps} {...props.modalProps} destroyOnClose >
        <RangePicker
          defaultValue={[moment().subtract(30, 'd'), moment()]}
          format={dateFormat}
          onChange={this.changeSelect}
        />
        <Table dataSource={list} rowKey="id" >
          <Column title="DTU设备" dataIndex="dtuName" />
          <Column title="设备编号" dataIndex="deviceName" />
          <Column title="变数名称" dataIndex="regisName" />
          <Column title="值" dataIndex="varValue" />
          <Column title="happen" dataIndex="createTime" />
          <Column title="修改人" dataIndex="createBy" />
        </Table>
      </Modal>
    );
  }
}
