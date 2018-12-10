import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Icon, Button, Form, Modal, Input, Select, message } from 'antd';

import ListTableData from './ListTableData';
import Source from '../../components/DeviceSelector/Source';
import DTU from '../../components/DeviceSelector/dtu';
import { queryMonitorAdd, queryMonitorUpdate, queryDelMonitor } from '../../services/api';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    md: { span: 4 },
  },
  wrapperCol: {
    md: { span: 20 },
  },
};
const CreateForm = Form.create()((props) => {
  // const { modalVisible, form, handleAdd, handleModalVisible,
  // canSelt, changeState, source, variable } = props;
  const { fromState, handleAdd, handleModalVisible, changeState, form, itemType, itemId } = props;
  const { modalVisible, canSelt, source, variable, editData } = fromState;
  const { getFieldDecorator } = form;
  const isEdit = Object.keys(editData).length > 0;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const sumitData = fieldsValue;
      if (itemType === 'device') {
        sumitData.sourceType = 1;
        sumitData.sourceId = variable.id;
        sumitData.monitorType = 1;
        sumitData.panelId = itemId;
      } else {
        if (source.itemType === 1) { // 单个设备
          sumitData.sourceId = variable.id;
        } else { sumitData.sourceId = source.deviceIdOrGroupId; }
        sumitData.monitorType = 2;
        sumitData.sourceType = source.itemType;
        sumitData.panelId = itemId;
      }
      delete sumitData.source;
      delete sumitData.variable;
      handleAdd(sumitData);
    });
  };
  const changeTag = (value) => {
    changeState({
      canSelt: value === 'BI' || value === 'BV',
    });
  };
  const goselectSource = async (e) => {
    e.preventDefault();
    const resource = await this.selSource.show(itemType, itemId);
    changeState({
      source: resource,
    });
  };
  const goselectVariable = async (e) => {
    e.preventDefault();
    const revariable = await this.selectDTU.show(source.deviceIdOrGroupId);
    form.setFieldsValue({ valueType: revariable.regisType });
    changeTag(revariable.regisType);
    changeState({
      variable: revariable,
    });
  };
  const del = async (data) => {
    // 删除
    const { code } = await queryDelMonitor(data.monitorId);
    if (code === 0) {
      message.success('删除成功');
      handleModalVisible();
    }
  };
  const footerButton = () => {
    if (!isEdit) {
      return [
        <Button key="back" onClick={() => handleModalVisible()}>取消</Button>,
        <Button key="submit" type="primary" onClick={okHandle}>
        存储
        </Button>];
    } else {
      return [
        <Button key="del" type="primary" onClick={() => del(editData)}>
                删除
        </Button>,
        <Button key="back" onClick={() => handleModalVisible()}>取消</Button>,
        <Button key="submit" type="primary" onClick={okHandle}>
            存储
        </Button>];
    }
  };
  const variableRules = {
    required: source.itemType === 1,
    message: '请输入',
  };
  return (
    <div>
      <Modal
        title="添加数据"
        visible={modalVisible}
        // onOk={okHandle}
        onCancel={() => handleModalVisible()}
        // okText="存储"
        destroyOnClose
        footer={footerButton()}
      >
        <FormItem
          {...formItemLayout}
          label="Caption"
        >
          {getFieldDecorator('caption', {
            rules: [{ required: true, message: '请选择' }],
            initialValue: editData.caption,
          })(
            <Input placeholder="请输入" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Source"
        >
          {getFieldDecorator('source', {
            rules: [{ required: true, message: '请选择' }],
            initialValue: editData.sourceName || editData.name || source.deviceOrGroupName,
          })(
            <Input placeholder="请选择" onClick={goselectSource} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Variable"
        >
          {getFieldDecorator('variable', {
            rules: [variableRules],
            initialValue: editData.varName || variable.varName,
          })(
            <Input placeholder="请选择" onClick={goselectVariable} disabled={source.itemType !== 1} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="类别"
        >
          {getFieldDecorator('valueType', {
            rules: [{ }],
            initialValue: editData.valueType,
          })(
            <Select
              onChange={changeTag}
              style={{ width: '90px' }}
              disabled={itemType === 'device'}
            >
              {/* BI，BV，AI，AV */}
              <Option value="BI">BI</Option>
              <Option value="BV">BV</Option>
              <Option value="AI" disabled={itemType === 'dust'}>AI</Option>
              <Option value="AV" disabled={itemType === 'dust'} >AV</Option>
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="单位"
        >
          {getFieldDecorator('unit', {
            rules: [],
            initialValue: editData.unit,
          })(
            <Input placeholder="请输入" disabled={canSelt} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Factor"
        >
          {getFieldDecorator('factor', {
            rules: [{}],
            initialValue: `${editData.factor || ''}`,
          })(
            <Input placeholder="请输入" disabled={canSelt} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Max"
        >
          {getFieldDecorator('max', {
            rules: [{}],
            initialValue: `${editData.max || ''}`,
          })(
            <Input placeholder="请输入" disabled={canSelt} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Min"
        >
          {getFieldDecorator('min', {
            rules: [{}],
            initialValue: `${editData.min || ''}`,
          })(
            <Input placeholder="请输入" disabled={canSelt} />
          )}
        </FormItem>
      </Modal>
      <Source ref={(selSource) => { this.selSource = selSource; }} />
      <DTU ref={(selectDTU) => { this.selectDTU = selectDTU; }} />
    </div>
  );
});
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))


export default class EditTable extends PureComponent {
  state = {
    modalVisible: false,
    canSelt: true,
    source: '',
    variable: '',
    editData: {},
  };
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
      source: '',
      variable: '',
    });
  }
  modelChangeState = (sta) => {
    this.setState(sta);
  }
  handleAdd = async (fields) => {
    // project.panelName = fields.desc;
    // 添加. or 修改
    if (Object.keys(this.state.editData).length === 0) {
      const { code } = await queryMonitorAdd(fields);
      if (code === 0) {
        message.success('添加成功');
      }
      this.setState({
        modalVisible: false,
      });
      this.props.refresh();
    } else {
      const { code } = await queryMonitorUpdate(fields);
      if (code === 0) {
        message.success('修改成功');
      }
      this.setState({
        modalVisible: false,
      });
      this.props.refresh();
    }
  }
  changeVarData = (item) => {
    this.handleModalVisible(true);
    this.setState({
      editData: item,
    });
  }
  render() {
    const addData = (e) => {
      e.preventDefault();
      this.setState({
        editData: {},
      });
      this.handleModalVisible(true);
    };
    const { switchData, varData } = this.props.list;
    if (this.props.title.length > 0) {
      return (
        <div style={{ padding: '0 14px' }} >
          <Row style={{ padding: '10px' }}>
            <Col span={8} style={{ fontWeight: 'bold' }}>{this.props.title}</Col>
            <Col span={8} />
            <Col span={8} style={{ textAlign: 'right' }} >
              <Icon
                type="sync"
                onClick={e => this.props.refresh(e)}
                style={{ cursor: 'pointer', marginRight: '12px' }}
              />
              <Button icon="plus" onClick={e => addData(e)}>添加数据</Button>
            </Col>
          </Row>
          <Card title="开关量数据">
            <ListTableData
              varDataList={switchData}
              dataType="switch"
              changeVarData={this.changeVarData}
            />
          </Card>
          <Card title="模拟量数据">
            <ListTableData
              varDataList={varData}
              dataType="var"
              changeVarData={this.changeVarData}
            />
          </Card>
          <CreateForm
            // canSelt={this.state.canSelt}
            handleAdd={this.handleAdd}
            handleModalVisible={this.handleModalVisible}
            // modalVisible={this.state.modalVisible}
            changeState={this.modelChangeState}
            // source={this.state.source}
            // variable={this.state.variable}
            fromState={this.state}
            itemType={this.props.list.editType}
            itemId={this.props.id}
          />
        </div>
      );
    } else {
      return <div style={{ padding: '20px 14px', textAlign: 'center' }} >请在左边选择设备</div>;
    }
  }
}
