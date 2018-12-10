import React, { PureComponent } from 'react';
import { Table } from 'antd';

import { getOnlineUser } from '../../services/api';

const { Column } = Table;
export default class Online extends PureComponent {
  state ={
    list: [],
  }
  componentDidMount = async () => {
    const { data: list } = await getOnlineUser({});
    this.setState({ list });
  }
  render() {
    return (
      <Table dataSource={this.state.list} rowKey="id" >
        <Column title="用户名称" dataIndex="userName" />
        <Column title="用户ID" dataIndex="userId" />
      </Table>
    );
  }
}
