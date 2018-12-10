import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, List, Row, Col, Checkbox, Icon, Modal, Form, Input, message, Popconfirm } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { queryUserPower, submitAddUser, queryDelUser, queryAddUserPower, queryDelUserPower, submitUpUser } from '../../services/api';
import style from './style.less';

const { Column } = Table;
const FormItem = Form.Item;

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleEdit, showPass,
    handleModalVisible, editUser, hidePass } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      const submitUser = fieldsValue;
      if (err) return;
      if (editUser) {
        submitUser.userId = editUser.userId;
        handleEdit(submitUser);
      } else {
        handleAdd(fieldsValue);
      }
    });
  };
  const initUser = editUser ? editUser.userName : '';
  return (
    <Modal
      title={editUser ? '编辑用户' : '新建用户'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      destroyOnClose={true}
      // key={+new Date()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="登录名"
      >
        {form.getFieldDecorator('userName', {
          rules: [{ required: true, message: '用户名必填' }],
          initialValue: initUser,
        })(
          <Input placeholder="输入名称" />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="登录密码"
      >
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '登录密码必填' }],
        })(
          <Input
            type={hidePass ? 'password' : 'text'}
            placeholder="输入登录密码"
            addonAfter={<Icon
              type={hidePass ? 'eye-o' : 'eye'}
              onClick={showPass}
              style={{ cursor: 'pointer' }}
            />
          }
          />
        )}
      </FormItem>
    </Modal>
  );
});
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
export default class Online extends PureComponent {
  state = {
    selectUser: '',
    modalVisible: false,
    editUser: false,
    hidePass: true,
  };
  componentDidMount() {
    // 获取用户列表
    const { dispatch } = this.props;
    dispatch({
      type: 'list/getUserList',
      page: {},
    });
    // 获取项目列表
    dispatch({
      type: 'list/getProjectList',
      params: {
        pageNo: 0,
        pageSize: 10,
      },
    });
  }
  getUserPower = async (userId) => {
    const { data } = await queryUserPower(userId);
    this.props.list.list.map((item) => {
      const thisItem = item;
      // 初始化
      thisItem.havManType = 0;
      thisItem.havConType = 0;
      // item.projectId === data.find()
      data.forEach((element) => {
        if (element.projectId === item.projectId) {
          if (element.managerTypeId === 1) thisItem.havManType = 1;
          if (element.managerTypeId === 2) thisItem.havConType = 1;
        }
      });
      return thisItem;
    });
    // return data;
    this.forceUpdate();
  }
  selectThisUser = (userId) => {
    this.setState({
      selectUser: userId,
    });
    // 根据选中的用户加载相对应的权限
    this.getUserPower(userId);
  }
  upCheckBox = () => {
    this.getUserPower(this.state.selectUser);
  }
  doChangeManage = async (e, queryData) => {
    if (e.target.checked) {
      // add
      const { code } = await queryAddUserPower(queryData);
      if (code === 0) {
        message.success('添加成功');
        this.upCheckBox();
      }
    } else {
      // del
      const { code } = await queryDelUserPower(queryData);
      if (code === 0) {
        message.success('删除成功');
        this.upCheckBox();
      }
    }
  }
  changeManage = (e, type, projectId) => {
    if (this.state.selectUser) {
      const queryData = {
        projectId,
        userId: this.state.selectUser,
        managerTypeId: type,
      };
      this.doChangeManage(e, queryData);
    } else {
      message.warn('请先选择用户');
    }
  }
  handleModalVisible = (e, flag) => {
    this.setState({
      modalVisible: !!flag,
      editUser: false,
    });
  }
  handleAdd = async (fields) => {
    const reson = await submitAddUser(fields);
    if (reson.code === 0) {
      message.success('添加成功');
      this.props.dispatch({
        type: 'list/getUserList',
        page: {},
      });
    }
    this.setState({
      modalVisible: false,
    });
  }
  handleEdit = async (fields) => {
    const reson = await submitUpUser(fields);
    if (reson.code === 0) {
      message.success('修改成功');
      this.props.dispatch({
        type: 'list/getUserList',
        page: {},
      });
    }
    this.setState({
      modalVisible: false,
    });
  }
  editUser = (e, user) => {
    e.stopPropagation();
    this.setState({
      modalVisible: true,
      editUser: user,
    });
  }
  doDelUser = async () => {
    const reson = await queryDelUser(this.state.selectUser);
    if (reson.code === 0) {
      message.success('删除成功');
      this.props.dispatch({
        type: 'list/getUserList',
        page: {},
      });
    }
  }
  delUser = () => {
    if (this.state.selectUser) {
      this.doDelUser();
    } else {
      message.warn('请先选择用户');
    }
  }
  showPass = () => {
    this.setState({
      hidePass: !this.state.hidePass,
    });
  }
  render() {
    const { list: { userList, list }, loading } = this.props;
    const userHeader = (
      <Row>
        <Col span={12}>用户列表</Col>
        <Col span={6} onClick={e => this.handleModalVisible(e, true)} style={{ cursor: 'pointer' }}>
          <Icon type="plus" />新建
        </Col>
        <Col span={6} style={{ cursor: 'pointer' }}>
          <Popconfirm title="是否要删除此用户？" onConfirm={() => this.delUser()}>
            <Icon type="delete" />删除选中
          </Popconfirm>
        </Col>
      </Row>
    );
    const checkedBg = {
      border: '1px solid #1890ff',
      background: 'rgb(0,166,90)',
      cursor: 'pointer',
    };
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
    };
    return (
      <PageHeaderLayout
        title="用户权限管理"
      >
        <div style={{ overflow: 'scroll' }}>
          <Row gutter={16} style={{ minWidth: '600px' }}>
            <Col span={12}>
              <List
                header={userHeader}
                bordered
                loading={loading}
                dataSource={userList}
                renderItem={item => (
                  <List.Item
                    onClick={() => this.selectThisUser(item.userId)}
                    className={style.editUser}
                    style={this.state.selectUser === item.userId ? checkedBg : { cursor: 'pointer' }}
                  >
                    {item.userName}
                    <Icon
                      type="edit"
                      onClick={e => this.editUser(e, item)}
                      style={{ padding: '6px' }}
                    />
                  </List.Item>)}
              />
            </Col>
            <Col span={12}>
              <Table
                rowKey="projectId"
                bordered
                dataSource={list}
              >
                <Column title="项目名称" dataIndex="projectName" />
                <Column
                  title="设备可控"
                  dataIndex="havManType"
                  render={(text, record) => {
                    return (
                      <Checkbox
                        onChange={e => this.changeManage(e, 1, record.projectId)}
                        checked={text === 1}
                      />);
                  }}
                />
                <Column
                  title="可配置"
                  dataIndex="havConType"
                  render={(text, record) => {
                    return (
                      <Checkbox
                        onChange={e => this.changeManage(e, 2, record.projectId)}
                        checked={text === 1}
                      />);
                  }}
                />
              </Table>
            </Col>
          </Row>
        </div>
        <CreateForm
          {...parentMethods}
          modalVisible={this.state.modalVisible}
          editUser={this.state.editUser}
          hidePass={this.state.hidePass}
          showPass={this.showPass}
        />
      </PageHeaderLayout>
    );
  }
}
