import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Icon, List, Card, Form, Modal, message, Input, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';

import ProjectBreadcrumb from '../../components/GlobalHeader/ProjectBreadcrumb';
import { queryDelgroup } from '../../services/api';
import styles from './style.less';

const FormItem = Form.Item;

const CreateForm = Form.create()((props) => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建群组"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="群组名称"
      >
        {form.getFieldDecorator('groupName', {
          rules: [{ required: true, message: '请输入群组名称' }],
        })(
          <Input placeholder="请输入项目名称" />
        )}
      </FormItem>
    </Modal>
  );
});

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))

export default class Group extends PureComponent {
  state = {
    modalVisible: false,
  };
  componentDidMount() {
    // console.log('......');
    this.props.dispatch({
      type: 'list/getGroupList',
      data: {},
    });
  }
  handleAdd = async (fields) => {
    const addData = await this.props.dispatch({
      type: 'list/addGroupName',
      data: fields,
    });
    if (addData.code === 0) {
      message.success('添加成功');
      this.props.dispatch({
        type: 'list/getGroupList',
        data: {},
      });
    }
    this.setState({
      modalVisible: false,
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  delGroup = async (e, id) => {
    e.preventDefault();
    const reson = await queryDelgroup(id);
    if (reson.code === 0) {
      this.props.dispatch({
        type: 'list/getGroupList',
        data: {},
      });
    }
  }
  render() {
    const { group, loading } = this.props.list;
    return (
      <div>
        <ProjectBreadcrumb arrBread={[]} />
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>群组列表</h3>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 2, lg: 6, md: 6, sm: 4, xs: 4 }}
          dataSource={['', ...group]}
          renderItem={item => (item ? (
            <List.Item key={item.id} className={styles.cardList}>
              <Link to={`/groupEdit/${item.id}/${item.groupName}`} title={item.groupName}>
                <Card className="CardList">
                  {item.groupName}
                </Card>
                <Popconfirm title="是否要删除此群组？" onConfirm={e => this.delGroup(e, item.id)}>
                  <Icon type="delete" className={styles.delBtn} />
                </Popconfirm>
              </Link>
            </List.Item>
            ) : (
              <List.Item>
                {/* <Link to="/groupEdit/add"> */}
                <Button
                  type="dashed"
                  className={styles.newButton}
                  onClick={() => this.handleModalVisible(true)}
                >
                  <Icon type="plus" /> 新增群组
                </Button>
                {/* </Link> */}
              </List.Item>
            )
          )}
        />
        <CreateForm
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleModalVisible}
          modalVisible={this.state.modalVisible}
        />
      </div>
    );
  }
}
