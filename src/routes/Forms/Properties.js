import React, { PureComponent } from 'react';
import moment from 'moment';
import { Card, Button, Form, Icon, Col, Row, DatePicker, Input, Select, Checkbox, Popover, Modal } from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';
import styles from './style.less';

const { Option } = Select;
const { confirm } = Modal;

const fieldLabels = {
  BanudRate: 'Baud Rate',
  DataLength: 'Data Length',
  Parity: 'Parity',
  StopBit: 'Stop Bit',
  TimeOut: 'Time Out (ms)',
  PollingDelay: 'Polling delay (ms)',
  NextBoard: 'Next board Delay (ms)',
  PollingByte: 'Polling Bytes',
  CreateCom: 'Create Com1.txt',
  SetDate: 'Set Date',
  MDT: 'Modify Date Time',
};

class AdvancedForm extends PureComponent {
  state = {
    width: '100%',
  };
  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  }
  render() {
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsError } = form;
    const collen = {
      lg: 6,
      md: 12,
      sm: 24,
    };
    const itemLen = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const validate = () => {
      validateFieldsAndScroll((error, values) => {
        if (!error) {
          confirm({
            title: '确认',
            content: '请问确认保存吗？',
            onOk() {
              dispatch({
                type: 'form/submitAdvancedForm',
                payload: values,
              });
            },
          });
        }
      });
    };
    const errors = getFieldsError();
    const getErrorInfo = () => {
      const errorCount = Object.keys(errors).filter(key => errors[key]).length;
      if (!errors || errorCount === 0) {
        return null;
      }
      const scrollToField = (fieldKey) => {
        const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
        if (labelNode) {
          labelNode.scrollIntoView(true);
        }
      };
      const errorList = Object.keys(errors).map((key) => {
        if (!errors[key]) {
          return null;
        }
        return (
          <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
            <Icon type="cross-circle-o" className={styles.errorIcon} />
            <div className={styles.errorMessage}>{errors[key][0]}</div>
            <div className={styles.errorField}>{fieldLabels[key]}</div>
          </li>
        );
      });
      return (
        <span className={styles.errorIcon}>
          <Popover
            title="表单校验信息"
            content={errorList}
            overlayClassName={styles.errorPopover}
            trigger="click"
            getPopupContainer={trigger => trigger.parentNode}
          >
            <Icon type="exclamation-circle" />
          </Popover>
          {errorCount}
        </span>
      );
    };

    function range(start, end) {
      const result = [];
      for (let i = start; i < end; i += 1) {
        result.push(i);
      }
      return result;
    }
    // function disabledDate(current) {
    //   // Can not select days before today and today
    //   return current && current < moment().endOf('day');
    // }

    function disabledDateTime() {
      return {
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
      };
    }
    return (
      <PageHeaderLayout
        title="系统参数 Properties"
        content="系统参数设定主要是针对下挂设备通讯参数配置；还有针对上位机IP, Port的设定。"
        wrapperClassName={styles.advancedForm}
      >
        <Card title="参数管理" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col {...collen}>
                <Form.Item {...itemLen} label={fieldLabels.BanudRate}>
                  {getFieldDecorator('BanudRate', {
                    rules: [{ required: true, message: '请选择鲍率' }],
                  })(
                    <Select placeholder="请选择鲍率">
                      <Option value="9600">9600</Option>
                      <Option value="19200">19200</Option>
                      <Option value="38400">38400</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...collen}>
                <Form.Item {...itemLen} label={fieldLabels.DataLength}>
                  {getFieldDecorator('DataLength', {
                    rules: [{ required: true, message: '请选择资料长度' }],
                    initialValue: 8,
                  })(
                    <Select placeholder="请选择资料长度">
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                      <Option value="6">6</Option>
                      <Option value="7">7</Option>
                      <Option value="8">8</Option>
                      <Option value="9">9</Option>
                      <Option value="10">10</Option>
                      <Option value="11">11</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...collen}>
                <Form.Item {...itemLen} label={fieldLabels.Parity}>
                  {getFieldDecorator('Parity', {
                    rules: [{ required: true, message: '请选择校验' }],
                  })(
                    <Select placeholder="请选择校验">
                      <Option value="none">none</Option>
                      <Option value="even">even</Option>
                      <Option value="odd">odd</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col {...collen}>
                <Form.Item {...itemLen} label={fieldLabels.DataLength}>
                  {getFieldDecorator('DataLength', {
                    rules: [{ required: true, message: '请选择停止位' }],
                    initialValue: 1,
                  })(
                    <Select placeholder="请选择停止位">
                      <Option value="1">1</Option>
                      <Option value="2">2</Option>
                      <Option value="3">3</Option>
                      <Option value="4">4</Option>
                      <Option value="5">5</Option>
                      <Option value="6">6</Option>
                      <Option value="7">7</Option>
                      <Option value="8">8</Option>
                      <Option value="9">9</Option>
                      <Option value="10">10</Option>
                      <Option value="11">11</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...collen}>
                <Form.Item {...itemLen} label={fieldLabels.TimeOut}>
                  {getFieldDecorator('TimeOut', {
                    rules: [{ required: true, message: '请输入单位为ms' }],
                  })(
                    <Input
                      type="number"
                      style={{ width: '100%' }}
                      addonAfter="ms"
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...collen}>
                <Form.Item {...itemLen} label={fieldLabels.PollingDelay}>
                  {getFieldDecorator('PollingDelay', {
                    rules: [{ required: true, message: '请输入单位为ms' }],
                  })(
                    <Input
                      type="number"
                      style={{ width: '100%' }}
                      addonAfter="ms"
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...collen}>
                <Form.Item {...itemLen} label={fieldLabels.NextBoard}>
                  {getFieldDecorator('NextBoard', {
                    rules: [{ required: true, message: '请输入单位为ms' }],
                  })(
                    <Input
                      type="number"
                      style={{ width: '100%' }}
                      addonAfter="ms"
                      placeholder="请输入"
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...collen}>
                <Form.Item
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 14 }}
                  label={fieldLabels.CreateCom}
                  help="如勾选则会产生除错文档,会将通讯资料封包存成文档以供除错判断用。"
                >
                  <div>
                    {getFieldDecorator('CreateCom', {
                      initialValue: '1',
                    })(
                      <Checkbox />
                    )}
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col {...collen}>
                <Form.Item {...itemLen} label={fieldLabels.SetDate}>
                  {getFieldDecorator('SetDate', {
                    rules: [{ required: true, message: '请选择日期' }],
                  })(
                    <DatePicker
                      format="YYYY-MM-DD HH:mm:ss"
                      // disabledDate={disabledDate}
                      disabledTime={disabledDateTime}
                      showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...collen}>
                <Form.Item
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 14 }}
                  label={fieldLabels.MDT}
                  help="须与前两项结合使用"
                >
                  <div>
                    {getFieldDecorator('MDT', {
                      initialValue: '1',
                    })(
                      <Checkbox />
                    )}
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <FooterToolbar style={{ width: this.state.width }}>
          {getErrorInfo()}
          <Button type="primary" onClick={validate} loading={submitting}>
            保存
          </Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(AdvancedForm));
