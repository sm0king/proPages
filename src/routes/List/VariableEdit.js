import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, message, Select, Button, Cascader } from 'antd';
import StandardTable from '../../components/StandardTable';
import ProjectBreadcrumb from '../../components/GlobalHeader/ProjectBreadcrumb';
import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;
// const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))
@Form.create()
export default class TableList extends PureComponent {
  state = {
    // expandForm: false,
    // selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/saveValList',
      payload: [],
    });
    dispatch({
      type: 'rule/getdeviceData',
    });
  }

  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const { dispatch } = this.props;
    targetOption.loading = true;
    const tagData = await dispatch({
      type: 'rule/getTagOpt',
      id: selectedOptions[0].value,
    });
    targetOption.loading = false;
    targetOption.children = tagData.map((item) => {
      return {
        label: item.code,
        value: item.id,
      };
    });
    this.forceUpdate();
  };
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
  };
  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (!fieldsValue.no || fieldsValue.no[1] === undefined) {
        message.error('请选择搜索条件');
        return;
      }
      const values = {
        ...fieldsValue,
      };
      this.setState({
        formValues: { id: values.no[1] },
      });
      dispatch({
        type: 'rule/getRegisterValue',
        data: {
          id: values.no[1],
          regisType: values.regisType,
        },
      });
    });
  };
  handleStandardTableChange = (pagination) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    // const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //   const newObj = { ...obj };
    //   newObj[key] = getValue(filtersArg[key]);
    //   return newObj;
    // }, {});

    const params = {
      pageNo: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      // ...filters,
    };
    // if (sorter.field) {
    //   params.sorter = `${sorter.field}_${sorter.order}`;
    // }

    dispatch({
      type: 'rule/getRegisterValue',
      data: params,
    });
  };

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { optData } = this.props.rule;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={12}>
            <FormItem label="设备/类别">
              {getFieldDecorator('no')(
                <Cascader
                  placeholder="设备/类别"
                  options={optData}
                  loadData={this.loadData}
                  onChange={this.onChange}
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类别">
              {getFieldDecorator('regisType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="AI">AI</Option>
                  <Option value="AV">AV</Option>
                  <Option value="BI">BI</Option>
                  <Option value="BV">BV</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="">
              <span className={styles.submitButtons}>
                <Button type="primary" htmlType="submit">
                  查询
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
    const { rule, loading } = this.props;
    const { data } = rule;

    return (
      <div style={{ overflow: 'scroll' }}>
        <ProjectBreadcrumb arrBread={[]} />
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>变量编辑</h3>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              // selectedRows={selectedRows}
              loading={loading}
              data={data}
              // onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </div>
    );
  }
}
