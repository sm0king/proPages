import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, InputNumber, DatePicker, Modal, message, Table } from 'antd';
import WarinPointEdit from './warinPointEdit';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';
import ProjectBreadcrumb from '../../components/GlobalHeader/ProjectBreadcrumb';
import WarinSelectForm from './WarinSelect';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');


const CreateForm = Form.create()((props) => {
  const { modalVisible, handleModalVisible, data} = props;
  const columns =[
    {title:"变数显示名称",dataIndex:"registName",key:'registName'},
    {title:"Alarm值", dataIndex:"alarmValue",key:'alarmValue'},
    {title:"开始时间", dataIndex:"triggerTime",key:'triggerTime'},
  ]
  return (
    <div>
      <Modal
        title='Alert List'
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
      > 
        <Table
          columns={columns}
          dataSource={Array.isArray(data) ? data : []}
        />
      </Modal>
    </div>
  );
});

@connect(({ alarm, loading }) => ({
  alarm,
  loading: loading.models.alarm,
}))
@Form.create()
export default class DeviceWarin extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    seeModalVis: false,
    editData: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarm/fetchList',
      payload: {
        pageNo:0,
        pageSize: 10000,
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'alarm/fetchList',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'alarm/fetchList',
      payload: {},
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleMenuClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'alarm/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  }

  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'alarm/fetchList',
        payload: values,
      });
    });
  }
  handleEditModal() {
    this.handleModalVisible(true)
  }
  handleModalVisible = (flag, isEdit, data) => {
    this.setState({
      modalVisible: !!flag,
      modalEdit: isEdit,
      editData: data,
    });
  }
  handleSeeModalVis = (flag) => {
    this.props.dispatch({
      type: 'alarm/getHistory',
    })
    this.setState({
      seeModalVis: !!flag,
    })
  }

  handleAdd = async (fields, isEdit) => {
    const queryType = isEdit ? 'alarm/update':'alarm/add'
    const {code, msg} = await this.props.dispatch({
      type: queryType,
      payload: fields,
    });
    if(code === 0) {
      message.success('添加成功');
    } else {
      message.error(msg);
    }
    this.setState({
      modalVisible: false,
    });
  }

  reflush = () => {
    const {dispatch} = this.props;
    dispatch({
      type: 'alarm/fetchList',
      payload: {
        pageNo:0,
        pageSize: 10000,
      },
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="规则编号">
              {getFieldDecorator('no')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="调用次数">
              {getFieldDecorator('number')(
                <InputNumber style={{ width: '100%' }} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="更新日期">
              {getFieldDecorator('date')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status3')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="使用状态">
              {getFieldDecorator('status4')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const { alarm: { list }, loading, history } = this.props;
    const { selectedRows, modalVisible, modalEdit, seeModalVis, editData} = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <div style={{ overflow: 'scroll' }}>
        <ProjectBreadcrumb arrBread={[]} />
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>Alarm List</h3>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true,false,{})}>
                新建
              </Button>
              <Button icon="eye" type="primary" onClick={() => this.handleSeeModalVis(true)}>
                查看
              </Button>
            </div>
            <WarinPointEdit
              selectedRows={selectedRows}
              loading={loading}
              data={list}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              editWarin={this.handleEditModal}
            />
          </div>
        </Card>
        <WarinSelectForm
          {...parentMethods}
          modalVisible={modalVisible}
          modalEdit={modalEdit}
          editData={editData}
        />
        <CreateForm
          handleModalVisible={this.handleSeeModalVis}
          modalVisible={seeModalVis}
          data={history}
        />
        
      </div>
    );
  }
}
