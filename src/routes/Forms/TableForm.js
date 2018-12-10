import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider } from 'antd';
import { Link } from 'react-router-dom';
import styles from './style.less';


export default class TableForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
      paginNation: props.paginNation,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
        paginNation: nextProps.paginNation,
      });
    }
  }
  getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.id === key)[0];
  }
  index = 0;
  cacheOriginData = {};
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submit',
          payload: values,
        });
      }
    });
  }
  toggleEditable=(e, key) => {
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  }
  remove(key) {
    // const newData = this.state.data.filter(item => item.key !== key);
    // console.log(newData);
    // this.setState({ data: newData });
    // this.props.onChange(newData);
    this.props.rmData(key);
  }
  newMember = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      device: '',
      deviceName: '',
      deviceCode: '',
      beatContent: '',
      beatTime: '60',
      onlineStatus: 0,
      isNew: true,
      editable: true,
    });
    this.index += 1;
    this.setState({
      data: newData,
      paginNation: false,
    });
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  saveRow(e, key) {
    e.persist();
    // this.props.loading = true;
    // save field when blur input
    setTimeout(() => {
      if (document.activeElement.tagName === 'INPUT' &&
          document.activeElement !== e.target) {
        return;
      }
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.deviceName
          || !target.deviceCode
          || !target.beatContent
          || !target.beatTime) {
        message.error('请填写完整设备信息。');
        e.target.focus();
        return;
      }
      // delete target.isNew;
      this.toggleEditable(e, key);
      this.props.changeData(target);
      // this.props.onChange(this.state.data);
      /* this.setState({
        loading: false,
      }); */
    }, 500);
  }
  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
  }
  checkDevice = (e, device) => {
    if (!device) {
      message.error('DTU设备为空');
      e.preventDefault();
      return false;
    }
  }
  render() {
    const columns = [{
      title: 'DTU设备',
      dataIndex: 'device',
      key: 'device',
      width: 120,
      render: (text) => {
        return text;
      },
    }, {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 100,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'deviceName', record.id)}
              autoFocus
              // onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="设备名称"
            />
          );
        }
        return text;
      },
    }, {
      title: '接入设备码',
      dataIndex: 'deviceCode',
      key: 'deviceCode',
      width: 100,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'deviceCode', record.id)}
              // onBlur={e => this.saveRow(e, record.key)}
              // onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="接入设备码"
            />
          );
        }
        return text;
      },
    }, {
      title: '心跳包内容',
      dataIndex: 'beatContent',
      key: 'beatContent',
      width: 100,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'beatContent', record.id)}
              // onBlur={e => this.saveRow(e, record.key)}
              // onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="心跳包内容"
            />
          );
        }
        return text;
      },
    }, {
      title: '心跳包时间（秒）',
      dataIndex: 'beatTime',
      key: 'beatTime',
      width: 90,
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              type="number"
              onChange={e => this.handleFieldChange(e, 'beatTime', record.id)}
              // onBlur={e => this.saveRow(e, record.key)}
              // onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="心跳包时间（秒）"
            />
          );
        }
        return text;
      },
    }, {
      title: '在线状态',
      dataIndex: 'onlineStatus',
      key: 'onlineStatus',
      width: 80,
      render: (text) => {
        return !text ? '离线' : '在线';
      },
    }, {
      title: '操作',
      key: 'action',
      width: 100,
      render: (text, record) => {
        if (!!record.editable && this.props.loading) {
          return null;
        }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.id)} >保存</a>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.saveRow(e, record.id)} >保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.id)}>取消</a>
            </span>
          );
        }
        return (
          <span>
            <a onClick={e => this.toggleEditable(e, record.id)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <Link to={`/dtu/${record.id}/${record.device}`} onClick={e => this.checkDevice(e, record.device)} >编辑DTU串口</Link>
          </span>
        );
      },
    }];

    return (
      <div>
        <Table
          loading={this.props.loading}
          columns={columns}
          rowKey="id"
          dataSource={this.state.data}
          pagination={this.state.paginNation}
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
          scroll={{ x: 1000 }}
        />
        <Button
          style={{ width: '100%', marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增设备
        </Button>
      </div>
    );
  }
}
