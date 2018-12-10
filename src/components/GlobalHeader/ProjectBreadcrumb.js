import React, { PureComponent } from 'react';
import { Breadcrumb } from 'antd';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { userInfo } from '../../utils/storage';

@connect(({ project, global }) => ({
  project,
  global,
}))
export default class ProjectBreadcrumb extends PureComponent {
  chrenBreadcrumb = () => {
    const { arrBread } = this.props;
    return arrBread.map(item =>
      <Breadcrumb.Item key={item.id}><Link to={item.url}>{item.title}</Link></Breadcrumb.Item>
    );
  };

  goBack = () => {
    const { dispatch } = this.props
    dispatch(routerRedux.goBack());
  } 

  render() {
    const projectId = userInfo.getDefaltPro();
    const projectName = userInfo.getDefaltProName();
    return (
      <div>
        <Breadcrumb style={{ marginBottom: '16px' }}>
          <Breadcrumb.Item><Link to="/">首页</Link></Breadcrumb.Item>
          <Breadcrumb.Item><Link to={`/dashboard/workplace/${projectId}`}>{projectName || '工作台'}</Link></Breadcrumb.Item>
          {this.chrenBreadcrumb()}
        </Breadcrumb>
      </div>
    );
  }
}

