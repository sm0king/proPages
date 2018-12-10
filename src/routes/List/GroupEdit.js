import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Button, Card } from 'antd';

import ProjectBreadcrumb from '../../components/GlobalHeader/ProjectBreadcrumb';
import TableGroup from './TableGroup';
import styles from './style.less';


@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))

export default class CroupEdit extends PureComponent {
  state = {
    groupName: '',
  };
  componentDidMount() {
    const { dispatch } = this.props;
      dispatch({
        type: 'list/getGroupDevice',
        id: this.props.match.params.groId,
      });
  }
  changeInput = (e) => {
    const { value } = e.target;
    this.setState({ groupName: value });
  }
  saveName = () => {
    this.props.dispatch({
      type: 'list/addGroupName',
      data: {
        groupName: this.state.groupName,
      },
    });
  }
  saveRow = async (data) => {
    const target = data;
    const groupId = this.props.match.params.groId;
    /* if (this.isAdd()) {
      groupId = this.props.match.params.groId;
    } else {
      groupId = this.props.list.groupid;
    } */
    const action = {
      type: 'list/groAddDevice',
      data: {
        ...target,
        groupId,
      },
    };

    if (!target.isNew) {
      action.type = 'list/groUpdateDevice';
    }
    delete target.isNew;
    await this.props.dispatch(action);
    this.props.dispatch({
      type: 'list/getGroupDevice',
      id: groupId,
    });
  }
  rmDow = async (id) => {
    await this.props.dispatch({
      type: 'list/rmGroupDevice',
      id,
    });
    this.props.dispatch({
      type: 'list/getGroupDevice',
      id: this.props.match.params.groId,
    });
  }
  render() {
    const { list, loading, match } = this.props;
    const InputGroup = Input.Group;
    // console.log(list.groupDevice);
    const title = (
      // this.isAdd() ? (
      <InputGroup compact>
        <h3 type="primary">群组名称：</h3>
        <Input
          style={{ width: '20%' }}
          placeholder="请输入群组名"
          defaultValue={match.params.groName}
          onChange={this.changeInput}
        />
        <Button type="primary" onClick={this.saveName} >修改</Button>
      </InputGroup>
      // ) : (
      //   <InputGroup compact>
      //     <Button type="primary">群组名称</Button>
      //     <Input
      //       style={{ width: '20%' }}
      //       placeholder="此处无法修改群组名"
      //       defaultValue={match.params.groName}
      //     />
      //   </InputGroup>
      // )
    );
    const arrBread = [{
      id: 1,
      url: '/group',
      title: '群组列表',
    }];
    return (
      <div style={{ overflow: 'scroll' }}>
        <ProjectBreadcrumb arrBread={arrBread} />
        {/* {} */}
        <Card className={styles.card} bordered={false} title={title}>
          <TableGroup
            value={list.groupDevice}
            changeData={this.saveRow}
            loading={loading}
            rmData={this.rmDow}
          />
        </Card>
      </div>
    );
  }
}
