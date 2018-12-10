import React from 'react';
import { Icon } from 'antd';
import { Link, Redirect, Switch, Route } from 'dva/router';
import DocumentTitle from 'react-document-title';
import GlobalFooter from '../components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.png';
import { getRoutes } from '../utils/utils';

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '管理系统';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 管理系统`;
    }
    return title;
  }
  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>路灯云控制系统</span>
                </Link>
              </div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <GlobalFooter
            copyright={
              <div>
                <a
                  href="http://www.miitbeian.gov.cn"
                  target="_blank"
                  rel="nofollow me noopener noreferrer"
                  style={{ color: 'rgba(0,0,0,.45)' }}
                >
                  沪ICP备15020214号-1{' '}
                </a>
                Copyright <Icon type="copyright" /> 2018 上海迪控出品
              </div>
            }
          />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
