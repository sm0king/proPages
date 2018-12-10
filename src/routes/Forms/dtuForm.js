import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider, Upload, Icon } from 'antd';
import styles from './style.less';
import { userInfo } from '../../utils/storage';

export default class DTUForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: props.value,
    };
  }
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      this.setState({
        data: nextProps.value,
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
    this.props.rmData(key);
  }
  newMember = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    const { device } = this.props;
    newData.push({
      externalId: '',
      dtuName: device,
      name: '',
      code: '',
      isNew: true,
      editable: true,
    });
    this.index += 1;
    this.setState({ data: newData });
  }
  handleFieldChange(e, fieldName, key) {
    const newData = this.state.data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }
  fileChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败`);
    }
  }
  saveRow(e, key) {
    e.preventDefault();
    // this.props.loading = true;
    // save field when blur input
    if (document.activeElement.tagName === 'INPUT' &&
        document.activeElement !== e.target) {
      return;
    }
    if (this.clickedCancel) {
      this.clickedCancel = false;
      return;
    }
    const target = this.getRowByKey(key) || {};
    if (!target.externalId
        || !target.dtuName
        || !target.name
        || !target.code) {
      message.error('请填写完整设备信息。');
      e.target.focus();
      return;
    }
    // delete target.isNew;
    this.toggleEditable(e, key);
    target.dtuId = this.props.deviceId;
    this.props.changeData(target);
    // this.props.onChange(this.state.data);
    /* this.setState({
      loading: false,
    }); */
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
  render() {
    const fileAction = {
      // action: `/light/device/point/table/upload/${this.props.deviceId}`,
      onChange: this.fileChange,
      name: 'file',
      headers: {
        token: userInfo.getToken(),
      },
    };
    const columns = [{
      title: '对外ID',
      dataIndex: 'externalId',
      key: 'externalId',
      width: '10%',
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <Input
              onChange={e => this.handleFieldChange(e, 'externalId', record.id)}
              placeholder="对外ID"
              value={text}
            />
          );
        }
        return text;
      },
    }, {
      title: '所属DTU',
      dataIndex: 'dtuName',
      key: 'dtuName',
      width: '20%',
      render: (text/* , record */) => {
        /* if (record.isNew || record.editable) {
          return (
            <Input
              onChange={e => this.handleFieldChange(e, 'dtuName', record.id)}
              placeholder="所属DTU"
            />
          );
        } */
        return text;
      },
    }, {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <Input
              onChange={e => this.handleFieldChange(e, 'name', record.id)}
              placeholder="设备名称"
              value={text}
            />
          );
        }
        return text;
      },
    }, {
      title: '设备ID',
      dataIndex: 'code',
      key: 'code',
      width: '10%',
      render: (text, record) => {
        if (record.isNew || record.editable) {
          return (
            <Input
              onChange={e => this.handleFieldChange(e, 'code', record.id)}
              placeholder="设备ID"
              value={text}
            />
          );
        }
        return text;
      },
    }, {
      title: '设备通讯点表文件',
      dataIndex: 'model',
      key: 'model',
      width: '20%',
      render: (text/* , record */) => {
        /* if (record.editable) {
          return (
            <Upload
              {...fileAction}
              action={`/light/device/point/table/upload/${record.id}`}
            >
              <Icon type="upload" />上传
            </Upload>
          );
        } */
        return text;
      },
    }, {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (text, record) => {
        if (!!record.editable && this.props.loading) {
          return null;
        }
        if (record.editable) {
          if (record.isNew) {
            return (
              <span>
                <Popconfirm title="是否要增加设备？" onConfirm={e => this.saveRow(e, record.id)}>
                  <a>保存</a>
                </Popconfirm>
                <Divider type="vertical" />
                <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
                  <a>删除</a>
                </Popconfirm>
              </span>
            );
          }
          return (
            <span>
              <Popconfirm title="是否要保存修改？" onConfirm={e => this.saveRow(e, record.id)}>
                <a>保存</a>
              </Popconfirm>
              <Divider type="vertical" />
              <a onClick={e => this.cancel(e, record.id)}>取消</a>
            </span>
          );
        }
        return (
          <div>
            <Upload
              {...fileAction}
              action={`/light/device/point/table/upload/${record.id}`}
            >
              <Icon type="upload" />上传
            </Upload>
            <a onClick={e => this.toggleEditable(e, record.id)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </div>
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
          pagination={false}
          rowClassName={(record) => {
            return record.editable ? styles.editable : '';
          }}
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
