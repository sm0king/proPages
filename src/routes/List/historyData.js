import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, message, Select, Button, Cascader, DatePicker } from 'antd';
// import StandardTable from '../../components/StandardTable';
import moment from 'moment';
import ProjectBreadcrumb from '../../components/GlobalHeader/ProjectBreadcrumb';
import styles from './TableList.less';
import HistoryFrom from './historyFrom'
import { exportHistoryData } from '../../services/api';



const FormItem = Form.Item;
// const RangePicker = DatePicker.RangePicker;
// const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ history, loading }) => ({
  history,
  loading: loading.models.history,
}))
@Form.create()
export default class HistoryData extends PureComponent {
  state = {
  };

  componentDidMount() {
  }

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };
  handleSearch = (e) => {
    e.preventDefault();

    const { form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fieldsValue.time || fieldsValue.time[1] === undefined) {
        message.error('请选择导出条件');
        return;
      }
      const subTime = fieldsValue.time[1].diff(fieldsValue.time[0], 'days');
      if(subTime>30) {
        message.error('最大只能选择导出30天的数据');
        return;
      }
      const values = {
        startTime: fieldsValue.time[0],
        endTime: fieldsValue.time[1],
        varbles: [
          {
            "varId": 0,
            "varType": 0,
          },
        ],
      };
      this.exportExcl(values);
      // this.setState({
      //   formValues: { id: values.no[1] },
      // });
      // dispatch({
      //   type: 'rule/getRegisterValue',
      //   data: {
      //     id: values.no[1],
      //     regisType: values.regisType,
      //   },
      // });
    });
  };
  exportExcl = async (values) => {
    const faileBlob = await exportHistoryData(values);
    const url = window.URL.createObjectURL(faileBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "历史数据.xlsx";
    a.click();
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="选择时间">
              {getFieldDecorator('time')(
                <DatePicker.RangePicker
                  placeholder={['开始时间', '结束时间']}
                  oshowTime
                  format="YYYY/MM/DD HH:mm:ss"
                />
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="">
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  导出
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                  重置
                </Button>
              </span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    // const { history } = this.props;
    // const { data } = history;
    const { getFieldDecorator} = this.props.form;

    return (
      <div style={{ overflow: 'scroll' }}>
        <ProjectBreadcrumb arrBread={[]} />
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>历史数据记录</h3>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {getFieldDecorator('members', {
            initialValue: [],
          })(<HistoryFrom />)}
          </div>
        </Card>
      </div>
    );
  }
}
