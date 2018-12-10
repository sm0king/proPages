import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, Card, Form, Modal, message } from 'antd';

import treeStyle from './TreeItem.less';
import { queryaddCustomize, addDevice } from '../../services/api';

const { Search } = Input;
const FormItem = Form.Item;
const { confirm } = Modal;

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i += 1) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))

export default class TreeItem extends PureComponent {
  state = {
    searchValue: '',
    deviceExpand: false,
    dustExpand: false,
    // editType: '',
    editData: {},
  };
  onChange = (e) => {
    const { value } = e.target;
    this.setState({
      searchValue: value,
      deviceExpand: true,
      dustExpand: true,
    });
  }
  chnageItem = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();
    // 弹窗编辑
    this.props.dispatch({
      type: 'list/changeSelectTree',
      editType: type,
    });
    this.setState({
      editData: item,
    });
    this.handleModalVisible(true);
  }
  deleteItem = (e, item, type) => {
    e.preventDefault();
    e.stopPropagation();
    const thisProps = this.props;
    const { dispatch } = thisProps;
    confirm({
      title: '确认',
      content: '确认删除当前设定？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const code = await dispatch({
          type: type === 'dust' ? 'list/delPanel' : 'list/rmDevice',
          id: item.panelId,
        });
        if (code === 0) {
          thisProps.changeTree();
        }
      },
      onCancel() {
      },
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }
  addCustomize = async (project) => {
    const { code } = await queryaddCustomize(project);
    if (code === 0) {
      message.success('添加成功');
      this.props.changeTree();
    }
    this.setState({
      modalVisible: false,
      dustExpand: true,
    });
  }
  addDataDevice = async (project) => {
    const { code } = await addDevice({ deviceName: project.panelName });
    if (code === 0) {
      message.success('添加成功');
      this.props.changeTree();
    }
    this.setState({
      modalVisible: false,
      deviceExpand: true,
    });
  }
  handleAdd = async (fields) => {
    const project = this.state.editData;
    const { editType } = this.props.list;
    project.panelName = fields.desc;
    // 根据编辑的不同，请求接口也不同
    if (editType === 'dust') {
      this.addCustomize(project);
    }
    if (editType === 'device') {
      this.addDataDevice(project);
    }
  }

  render() {
    const { searchValue, deviceExpand, dustExpand } = this.state;
    const testDev = [{
      panelName: '测试数据01',
      online: true,
      panelId: 1,
    }, {
      panelName: '测试数据02',
      online: false,
      panelId: 2,
    }, {
      panelName: '测试数据03',
      online: true,
      panelId: 3,
    }];
    const { dataDevice, dataDustomize } = this.props.list;
    const loop = (data, type) => data.map((item) => {
      const index = item.panelName.indexOf(searchValue);
      const beforeStr = item.panelName.substr(0, index);
      const afterStr = item.panelName.substr(index + searchValue.length);
      const searchLen = searchValue.length;
      const title = index > -1 ? (
        <span>
          {beforeStr}
          <span style={{ color: '#f50' }}>{searchValue}</span>
          {afterStr}
        </span>
      ) : <span>{item.panelName}</span>;
      let showClassName = treeStyle.treeItem;
      if (type === 'dust') {
        showClassName += ` ${treeStyle.dust}`;
      } else {
        showClassName += item.online ? ` ${treeStyle.online}` : ` ${treeStyle.unOnline}`;
      }
      const editNode = type === 'dust' ? (
        <div className={treeStyle.edit}>
          <Icon type="edit" onClick={e => this.chnageItem(e, item, type)} />
          <Icon type="delete" onClick={e => this.deleteItem(e, item, type)} />
        </div>
      ) : (<div />);
      return (
        (searchLen > 0 && index < 0) ? null : (
          <Card
            key={item.panelId}
            className={showClassName}
            onClick={e => this.props.setTabTitle(e, item, type)}
            style={{ paddingRight: '14px' }}
          >
            {title}
            {editNode}
          </Card>)
      );
    });
    const CreateForm = Form.create()((props) => {
      const { modalVisible, form, handleAdd, handleModalVisible } = props;
      const { editData } = this.state;
      const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          handleAdd(fieldsValue);
        });
      };
      return (
        <Modal
          title={!Object.keys(editData).length ? '新建' : '编辑'}
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
              rules: [{ required: true, message: '请输入' }],
              initialValue: editData.panelName,
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
        </Modal>
      );
    });
    return (
      <div>
        <Search style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
        <div>
          {/* minus */}
          <div
            className={treeStyle.treeItemTitle}
            onClick={() => this.setState({ deviceExpand: !deviceExpand })}
          >
            <Icon type={deviceExpand ? 'minus' : 'plus'} style={{ paddingRight: '8px' }} />设备
          </div>
          <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '10px' }} >
            {!deviceExpand ? '' : loop(dataDevice || testDev, 'device')}
          </div>
        </div>
        <div>
          <div
            className={treeStyle.treeItemTitle}
            onClick={() => this.setState({ dustExpand: !dustExpand })}
          >
            <Icon type={dustExpand ? 'minus' : 'plus'} style={{ paddingRight: '8px' }} />自定义控制界面
            <Icon type="file-add" className={treeStyle.titleEdit} onClick={e => this.chnageItem(e, {}, 'dust')} />
          </div>
          <div style={{ maxHeight: '350px', overflowY: 'auto', marginBottom: '10px' }} >
            {!dustExpand ? '' : loop(dataDustomize, 'dust')}
          </div>
        </div>
        <CreateForm
          handleAdd={this.handleAdd}
          handleModalVisible={this.handleModalVisible}
          modalVisible={this.state.modalVisible}
        />
      </div>
    );
  }
}
