import React, { PureComponent } from 'react';
import { Card, Input, Popconfirm } from 'antd';

import { Link } from 'react-router-dom';
import styles from './CardList.less';
import Ellipsis from '../../components/Ellipsis';
// import { queryDelProject } from '../../services/api';
import { userInfo } from '../../utils/storage';

export default class CardEdit extends PureComponent {
  state = {
    isEdit: false,
  }
  setProject = (e, projectId) => {
    this.props.changeProject(projectId);
  }
  newData = this.props.source;
  toggleEditable = (e) => {
    e.preventDefault();
    this.setState({ isEdit: true });
  }
  changeValue = (e, key) => {
    e.preventDefault();
    this.newData[key] = e.target.value;
  }
  toSvae = (e) => {
    e.preventDefault();
    this.setState({ isEdit: false });
    this.props.action(this.newData);
  }
  toCancel = (e) => {
    e.preventDefault();
    this.setState({ isEdit: false });
  }
  toDelete = (id) => {
    // e.preventDefault();
    /* const reson = await queryDelProject(id);
    if (reson.code === 0) {
      this.props.upLoad();
    } */
    this.props.delProject(id);
  }
  clickName = (projectName) => {
    userInfo.setDefaltProName(projectName);
  }
  render() {
    const item = this.props.source;
    return (
      <Card
        hoverable
        className={styles.card}
        actions={
          this.state.isEdit ? [
            <a onClick={e => this.toSvae(e)} >保存</a>,
            <a onClick={e => this.toCancel(e)} >取消</a>,
          ] : [
            <a onClick={e => this.toggleEditable(e)} >编辑</a>,
            <Link
              onClick={() => this.clickName(item.projectName)}
              to={`/dashboard/workplace/${item.projectId}`}
            >
              进入
            </Link>,
            <Popconfirm title="是否要删除此项目？" onConfirm={() => this.toDelete(item.projectId)}>
              <a>删除</a>
            </Popconfirm>,
          ]
        }
      >
        <Card.Meta
          title={item.projectName}
          description={(
            this.state.isEdit ? (
              <Input.TextArea
                defaultValue={item.projectName}
                placeholder="项目名称"
                type="TextArea"
                onChange={e => this.changeValue(e, 'projectName')}
              />
              ) : (
                <Ellipsis className={styles.item} lines={3}>{item.projectName}</Ellipsis>
            )
          )}
        />
      </Card>);
  }
}

