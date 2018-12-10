import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, List, Modal, Form, message, Input, Pagination } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import CardEdit from './CardEdit';
import styles from './CardList.less';

import { userInfo } from '../../utils/storage';

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
      title="新建项目"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="项目名称"
      >
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: '请输入项目名称' }],
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
export default class CardList extends PureComponent {
  state = {
    modalVisible: false,
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'list/getProjectList',
      params: {
        pageNo: 0,
        pageSize: 10,
      },
    });
  }
  ListChange = (item) => {
    this.props.dispatch({
      type: 'list/edit',
      data: item,
    });
  }
  upLoad = () => {
    this.props.dispatch({
      type: 'list/getProjectList',
      params: {
        pageNo: 0,
        pageSize: 10,
      },
    });
  }
  delProject = async (id) => {
    const code = await this.props.dispatch({
      type: 'list/getDelProject',
      id,
    });
    if (code === 0) {
      this.upLoad();
    }
  }
  changeProject = (id) => {
    const { list } = this.props.list;
    const changeItem = list.find((item) => {
      return item.projectId === id;
    });
    // changeItem.projectName = '';
    // changeItem.updateBy = ;
    this.props.dispatch({
      type: 'list/setProjectId',
      data: changeItem,
    });
  }
  handleAdd = async (fields) => {
    const project = {
      projectName: fields.desc,
    };
    const addData = await this.props.dispatch({
      type: 'list/addProject',
      project,
    });
    if (addData.code === 0) {
      message.success('添加成功');
      this.upLoad();
    }
    this.setState({
      modalVisible: false,
    });
  }
  changePagin = (page, pageSize) => {
    this.props.dispatch({
      type: 'list/getProjectList',
      params: {
        pageNo: page,
        pageSize,
      },
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  render() {
    const { list: { list, paginNation }, loading } = this.props;
    paginNation.current = paginNation.pageNo;
    if (list[0]) { userInfo.setDefaltPro(list[0].projectId); }
    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          这里显示项目列表，根据后台返回不同的项目。
        </p>
      </div>
    );

    const extraContent = (
      <div>
        <Button type="primary" icon="plus" onClick={() => this.handleModalVisible(true)}>新增项目</Button>
        {/* <img alt="这是一个标题" src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png" /> */}
      </div>
    );

    return (
      <PageHeaderLayout
        title="项目列表"
        content={content}
        extraContent={extraContent}
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[...list]}
            renderItem={item => (
              <List.Item key={item.projectId}>
                <CardEdit
                  source={item}
                  action={this.ListChange}
                  changeProject={this.changeProject}
                  upLoad={this.upLoad}
                  delProject={this.delProject}
                />
              </List.Item>
              )}
          />
          <Pagination {...paginNation} onChange={this.changePagin} />
        </div>
        <CreateForm
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleModalVisible}
          modalVisible={this.state.modalVisible}
        />
      </PageHeaderLayout>
    );
  }
}
