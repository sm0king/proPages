import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Modal, Form, Input, Checkbox, Radio, Row, Col, message, Switch, TimePicker } from 'antd';

// import options from './cityOption';

import TimingDevice from '../../components/DeviceSelector/timingdevice';
import DTU from '../../components/DeviceSelector/dtu';
import CalendrSelect from '../../components/CalendrSelect/';
import { submitordinaryNode, submitspecifiedNode, querytDeviceAndGro } from '../../services/api';
import AreaSelector from '../../components/AreaSelector';

const FormItem = Form.Item;
// const { Option } = Select;
// const reOption = (len) => {
//   const opNode = [];
//   for (let i = 0; i < len; i += 1) {
//     const sti = i < 10 ? (`0${i}`) : `${i}`;
//     opNode.push(<Option value={sti} key={sti}>{sti}</Option>);
//   }
//   return opNode;
// };

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.rule,
}))
@Form.create()

export default class EditModel extends PureComponent {
  state = {
    isGroup: true,
    selectOption: {},
    dtu: {},
    deviceList: [],
    timeMode: true,
  }
  componentDidMount = async () => {
    // 请求设备群组
    const { data: deviceList } = await querytDeviceAndGro();
    const { value } = this.props;
    let selectOption = {};

    if(value && value.device) {
      selectOption = deviceList.find(item => item.deviceLocation === value.device);
    }

    this.setState({
      deviceList,
      selectOption,
    });
  }
  handleOk = () => {
    // console.log('保存');
  }
  handleCancel = () => {
    this.props.hideModel();
  }
  changeDeviceSet = (value) => {
    // 根据改变的值请求响应的值
    // 当是群组的时候，禁止修改
    const { DeviceSelect } = this.props.list;
    const thisSelectOption = DeviceSelect.find(item => item.deviceIdOrGroupId === value);
    this.setState({
      isGroup: thisSelectOption.itemType === 1,
    });
    this.props.dispatch({
      type: 'list/getDeviceSeltctValue',
      data: value,
    });
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const submitData = values;
        if (values.cityId) {
          submitData.cityId = !values.cityId['1'] ? values.cityId['0'] : values.cityId['1'];
        }
        if (this.props.title === '指定日节点编辑') {
          submitData.monthList = values.weekList.map((item) => {
            return item.format('YYYY-MM-DD');
          });
          delete submitData.weekList;
        }
        if (!values.startTimeType) {
          submitData.startTimeType = 1;
          // submitData.startTime = `${values.startTimeHH}:${values.startTimeMM}:00`;
          submitData.startTime = `${values.startTime.format('HH:mm')}:00`;
          if (!values.startTime) submitData.startTime = false;
        }
        submitData.runId = this.state.selectOption.deviceIdOrGroupId;
        submitData.runVar = this.state.dtu.id;
        if (!(submitData.startTime || submitData.cityId)) {
          message.error('开始时间信息不完整');
          return;
        }
        submitData.runType = this.state.selectOption.itemType;
        submitData.stopWorkOnHoliday = values.stopWorkOnHoliday ? 1 : 0;
        if (this.props.title === '指定日节点编辑') {
          const { code } = await submitspecifiedNode(submitData);
          if (code === 0) {
            this.handleCancel();
          }
        } else {
          const { code } = await submitordinaryNode(submitData);
          if (code === 0) {
            this.handleCancel();
          }
        }
      }
    });
  }
  goselectOption = async (e) => {
    e.preventDefault();
    const device = await this.timingdevice.show();
    this.setState({
      selectOption: device,
      isGroup: device.itemType === 1,
    });
  }
  goselectDTU = async (e) => {
    e.preventDefault();
    const dtu = await this.selectDTU.show(this.state.selectOption.deviceIdOrGroupId);
    this.setState({
      dtu,
    });
  }
  changeTimeMode = (checked) => {
    this.setState({
      timeMode: checked,
    });
  }
  renderTimeMode = () => {
    const { getFieldDecorator/* , getFieldValue */ } = this.props.form;
    return this.state.timeMode ? (
      <div>
        <Col span={8} >
          <FormItem>
            {getFieldDecorator('startTime', {
              rules: [{ type: 'object'}],
              initialValue: moment(this.props.value ? this.props.value.nodeTime : new Date(), 'HH:mm'),
            })(
              <TimePicker format="HH:mm" />
            )}
            {/* <span className="ant-form-text">HH</span> */}
          </FormItem>
        </Col>
        {/* <Col span={4} >
          <FormItem>
            {getFieldDecorator('startTimeMM', {
              rules: [{
              }],
            })(
              <Select
                style={{ width: 64 }}
              >
                {reOption(60)}
              </Select>
            )}
            <span className="ant-form-text">MM</span>
          </FormItem>
        </Col> */}
      </div>
    ) : (
      <div>
        <Col span={8} >
          <FormItem>
            {getFieldDecorator('startTimeType', {
              rules: [{}],
            })(
              <Radio.Group>
                <Radio value="2">天亮</Radio>
                <Radio value="3">天黑</Radio>
              </Radio.Group>
            )}
          </FormItem>
        </Col>
        <Col span={8} >
          <FormItem>
            {getFieldDecorator('cityId', {
            })(
              <AreaSelector />
            )}
          </FormItem>
        </Col>
      </div>
    );
  }
  render() {
    const { title, isShow } = this.props;
    const nodeValue = this.props.value || {};
    const { getFieldDecorator } = this.props.form;
    const { nodeName } = nodeValue || {};
    let { week } = nodeValue || {};
    const formItemLayout = {
      labelCol: {
        md: { span: 4 },
      },
      wrapperCol: {
        md: { span: 20 },
      },
    };

    if(title === '指定日节点编辑' && week) {
      week = week.map(item => {return moment(item)})
    }

    const { isGroup, dtu, selectOption, deviceList } = this.state;
    return (
      <Modal
        title={title}
        visible={isShow}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        width={960}
        okText="存储"
        cancelText="取消"
      >
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
          style={{ marginTop: 8 }}
        >
          {nodeName ? (
            <FormItem
              {...formItemLayout}
              label="节点:"
            >
              <p>{nodeName}</p>
            </FormItem>
          ) : '' }
          <FormItem
            {...formItemLayout}
            label="week list"
          >
            {getFieldDecorator('weekList', {
                rules: [{ required: true, message: '请选择' }],
                initialValue: week || [],
              })(
                title === '普通节点设定' ? (
                  <Checkbox.Group style={{ width: '100%' }}>
                    <Row>
                      <Col span={3} ><Checkbox value="7">SUN</Checkbox></Col>
                      <Col span={3} ><Checkbox value="1">MON</Checkbox></Col>
                      <Col span={3} ><Checkbox value="2">TUE</Checkbox></Col>
                      <Col span={3} ><Checkbox value="3">WED</Checkbox></Col>
                      <Col span={3} ><Checkbox value="4">THU</Checkbox></Col>
                      <Col span={3} ><Checkbox value="5">FRI</Checkbox></Col>
                      <Col span={3} ><Checkbox value="6">SAT</Checkbox></Col>
                    </Row>
                  </Checkbox.Group>) : (
                    <CalendrSelect />
                  )
              )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="时间"
          >
            <Row gutter={8}>
              <Col span={4}>
                <Switch
                  checkedChildren="精确"
                  unCheckedChildren="动态"
                  defaultChecked
                  onChange={this.changeTimeMode}
                />
              </Col>
              {this.renderTimeMode()}
            </Row>
          </FormItem>
          {/* <Select style={{ width: 160 }} onChange={this.changeDeviceSet} >
                {selectOption}
            </Select> */}
          <FormItem
            {...formItemLayout}
            label="设备位置/群组"
          >
            {getFieldDecorator('runVar', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: selectOption.deviceOrGroupName,
            })(
              <Input placeholder="请选择" onClick={this.goselectOption} />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="变数显示名称"
          >
            {getFieldDecorator('runId', {
              rules: [{ required: true, message: '请选择' }],
              initialValue: isGroup ? selectOption.deviceLocation : dtu.varName,
            })(
              <Input disabled={isGroup} onClick={this.goselectDTU} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="功能"
          >
            {getFieldDecorator('runVarlue', { 
              rules: [{ required: true, message: '请选择' }],
              initialValue: isNaN(nodeValue.features) ? '' : nodeValue.features,
            })(
              <Input type="number" style={{ width: 80 }} />
          )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label=" "
          >
            {getFieldDecorator('stopWorkOnHoliday', {})(
              <Checkbox setFieldsValue="1">Stop Work at 假日（设定）</Checkbox>
          )}
          </FormItem>
        </Form>
        <TimingDevice ref={(timingdevice) => { this.timingdevice = timingdevice; }} list={deviceList} />
        <DTU ref={(selectDTU) => { this.selectDTU = selectDTU; }} />
      </Modal>
    );
  }
}
