import React, { PureComponent } from 'react';
import { Layout, Icon, Menu, Dropdown } from 'antd';
// import moment from 'moment';
// import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
// import NoticeIcon from '../NoticeIcon';
// import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { userInfo } from '../../utils/storage';
import { getAuthority } from '../../utils/authority';

const { Header } = Layout;

@connect(({ project, global }) => ({
  project,
  global,
}))
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  goBack = () => {
    const { dispatch } = this.props
    dispatch(routerRedux.goBack());
  } 

  render() {
    const {
      /* currentUser,  */collapsed, onMenuClick,
    } = this.props;
    const userName = userInfo.getUserName();
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="changepass"><Icon type="edit" />修改密码</Menu.Item>
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );
    return (
      <Header className={styles.header}>
        { getAuthority() === 'admin' ? (
          <Icon
            className={styles.trigger}
            type={collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
        ) : null}

        <a onClick={this.goBack} style={{'marginLeft': '12px'}}>
          <Icon type="left" />返回
        </a>
        <div className={styles.right} style={{ cursor: 'pointer' }} >
          <Dropdown overlay={menu}>
            <a>
              <Icon type="user" style={{ marginRight: '6px' }} />
              <span style={{ marginRight: '16px' }}>{userName}</span>
            </a>
          </Dropdown>
        </div>
      </Header>
    );
  }
}
