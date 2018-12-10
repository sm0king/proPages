import React, { PureComponent } from 'react';
import { Form, Input, Modal, Checkbox } from 'antd';

import DeviceSelector from '../../components/DeviceSelector';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

@Form.create()
export default class WarinSelectForm extends PureComponent {
  state = {
    Source: '',
  };
  render() {
    const { modalVisible, form, handleAdd, handleModalVisible, modalEdit, editData } = this.props;
    const okHandle = () => {
      form.validateFields((err, fieldsValue) => {
        const subValue = fieldsValue;
        if (err) return;
        if (fieldsValue.enableAlarm.length > 0) {
          fieldsValue.enableAlarm.forEach(item => {
            subValue[`enableAlarm${item}`] = 1;
          });
        }
        if (fieldsValue.enableClear.length > 0) {
          fieldsValue.enableClear.forEach(item => {
            subValue[`enableClear${item}`] = 1;
          });
        }
        subValue.alarmCompareValue = `${fieldsValue.alarmCompareValueMin  }-${ fieldsValue.alarmCompareValueMax}`
        handleAdd(subValue, modalEdit);
      });
    };
    const dodeviceSelector = async e => {
      e.preventDefault();
      const res = await this.selDevice.show();
      this.setState({
        SourceValue: res ? res.id : '',
      })
    };
    const CheckOptions = [
      { label: '短信', value: 'Phone' },
      { label: '语音短信', value: 'Sound' },
      { label: '邮件', value: 'Email' },
    ];
    const disItem = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const initSource = editData ? editData.Source || '' : '';
    return (
      <div>
        <Modal
          title={`${modalEdit ? '编辑' : '新建'}`}
          visible={modalVisible}
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
        >
          <FormItem {...disItem} label="Source">
            {form.getFieldDecorator('id', {
              rules: [],
              initialValue: this.state.SourceValue,
            })(<Input placeholder="请输入" onClick={dodeviceSelector} />)}
          </FormItem>
          <FormItem {...disItem} label="Variable">
            {form.getFieldDecorator('alarmRegisterId', {
              rules: [],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...disItem} label="手机号">
            {form.getFieldDecorator('alarmPhone', {
              rules: [],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...disItem} label="邮箱账号">
            {form.getFieldDecorator('alarmEmail', {
              rules: [],
            })(<Input placeholder="请输入" />)}
          </FormItem>
          <FormItem {...disItem} label="警告激活简讯">
            {form.getFieldDecorator('enableAlarm', {
              rules: [],
            })(<CheckboxGroup options={CheckOptions} />)}
          </FormItem>
          <FormItem {...disItem} label="激活内容">
            {form.getFieldDecorator('alarmCotent', {
              rules: [],
            })(<TextArea />)}
          </FormItem>
          <FormItem {...disItem} label="警告清除简讯">
            {form.getFieldDecorator('enableClear', {
              rules: [],
            })(<CheckboxGroup options={CheckOptions} />)}
          </FormItem>
          <FormItem {...disItem} label="清楚内容">
            {form.getFieldDecorator('clearAlarmCotent', {
              rules: [],
            })(<TextArea />)}
          </FormItem>
          <FormItem {...disItem} label="Compare">                 
            {form.getFieldDecorator('alarmCompareValueMin', {
              rules: [],
            })(<Input style={{ width: 100, textAlign: 'center' }} placeholder="请输入" />)}
            <Input
              style={{
                width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff', borderRadius: 0, margin: '0 -4px',
              }}
              placeholder="~"
              disabled
            />
            {form.getFieldDecorator('alarmCompareValueMax', {
              rules: [],
            })(<Input style={{ width: 100, textAlign: 'center',borderLeft: 0, borderBottomLeftRadius: 0, borderTopRightRadius: 0 }} placeholder="请输入" />)}
          </FormItem>
          <FormItem {...disItem} label="Delay Second">
            {form.getFieldDecorator('alarmCompareType', {
              rules: [],
            })(<Input placeholder="请输入" />)}
          </FormItem>
        </Modal>
        <DeviceSelector
          ref={selDevice => {
            this.selDevice = selDevice;
          }}
        />
      </div>
    );
  }
}
