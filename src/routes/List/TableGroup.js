import React, { PureComponent } from 'react';
import { Table, Button, Input, message, Popconfirm, Divider } from 'antd';
import styles from './style.less';
import DeviceSelector from '../../components/DeviceSelector';
import VariableSelector from '../../components/DeviceSelector/variable';

export default class TableForm extends PureComponent {
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
    // const newData = this.state.data.filter(item => item.key !== key);
    // console.log(newData);
    // this.setState({ data: newData });
    // this.props.onChange(newData);
    this.props.rmData(key);
  }

  newMember = () => {
    const newData = this.state.data.map(item => ({ ...item }));
    newData.push({
      devicePlace: '',
      varName: '',
      regisName: '',
      externalId: '',
      beatTime: '',
      regisType: '',
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
  saveRow(e, key) {
    e.persist();
    // this.props.loading = true;
    // save field when blur input
    // setTimeout(() => {
    // if (document.activeElement.tagName === 'INPUT' &&
    //     document.activeElement !== e.target) {
    //   return;
    // }
    // if (this.clickedCancel) {
    //   this.clickedCancel = false;
    //   return;
    // }
    const target = this.getRowByKey(key) || {};
    if (!target.deviceId || !target.regisId) {
      message.error('请填写完整设备信息。');
      // e.target.focus();
      return;
    }
    // delete target.isNew;
    this.toggleEditable(e, key);
    this.props.changeData(target);
    // this.props.onChange(this.state.data);
    /* this.setState({
        loading: false,
      }); */
    // }, 500);
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

  doSelectDTU = async (e, id) => {
    e.preventDefault();
    const device = await this.deviceSelector.show();
    // console.log(this.state.data);
    const eidtData = this.state.data.find(item => !item.id || item.id === id);
    eidtData.externalId = device.externalId;
    eidtData.devicePlace = device.deviceLocation;

    // 由于“变数”是跟设备关联的，所以当设备改变时，要清空“变数”信息，让用户重新选择
    if (device.id !== eidtData.deviceId) {
      eidtData.regisId = null;
      eidtData.regisName = '';
      eidtData.regisType = '';
    }

    eidtData.deviceId = device.id;
    // eidtData.id = device.id;
    this.setState(
      ...this.state,
      eidtData,
    );
  }

  doselectVariable = async (e, { id, deviceId }) => {
    e.preventDefault();
    const device = await this.variableSelector.show(deviceId);
    // console.log(this.state.data);
    const eidtData = this.state.data.find(item => !item.id || item.id === id);
    eidtData.regisType = device.regisType;
    eidtData.varName = device.varName;
    eidtData.regisName = device.regisName;
    eidtData.regisId = device.id;
    this.setState(
      ...this.state,
      eidtData,
    );
  }


  render() {
    const columns = [{
      title: '设备位置',
      dataIndex: 'devicePlace',
      width: '12%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <a onClick={(e) => { this.doSelectDTU(e, record.id); }}>{ text || '选择设备' }</a>
          );
        }
        return text;
      },
    }, {
      title: '变数显示名称',
      dataIndex: 'varName',
      key: 'varName',
      width: '15%',
      render: (text) => {
        return text;
      },
    }, {
      title: '变数名称',
      dataIndex: 'regisName',
      key: 'regisName',
      width: '15%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <a onClick={(e) => { this.doselectVariable(e, record); }}>{ text || '编辑变量' }</a>
          );
        }
        return text;
      },
    }, {
      title: '对外ID',
      dataIndex: 'externalId',
      key: 'externalId',
      width: '15%',
      render: (text) => {
        return text;
      },
    }, {
      title: 'Point Add',
      dataIndex: 'beatTime',
      key: 'beatTime',
      width: '10%',
      render: (text, record) => {
        if (record.editable) {
          return (
            <Input
              value={text}
              onChange={e => this.handleFieldChange(e, 'beatTime', record.id)}
              // onBlur={e => this.saveRow(e, record.key)}
              // onKeyPress={e => this.handleKeyPress(e, record.key)}
              placeholder="Point Add"
            />
          );
        }
        return text;
      },
    }, {
      title: '类别',
      dataIndex: 'regisType',
      key: 'regisType',
      width: '10%',
      render: (text) => {
        return text;
      },
    }, {
      title: '操作',
      key: 'action',
      width: '23%',
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
            {/* <Link to={`/dtu/${record.id}`} >编辑DTU串口</Link> */}
          </span>
        );
      },
    }];

    return (
      <div>
        <Table
          bordered
          loading={this.props.loading}
          columns={columns}
          rowKey="id"
          dataSource={this.state.data}
          pagination={false}
          style={{ minWidth: '600px' }}
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
          新增
        </Button>
        <DeviceSelector ref={(deviceSelector) => { this.deviceSelector = deviceSelector; }} />
        <VariableSelector
          ref={(variableSelector) => { this.variableSelector = variableSelector; }}
        />
      </div>
    );
  }
}
