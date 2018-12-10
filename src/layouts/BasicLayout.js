import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon, Form, Modal, Input, message } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import Authorized from '../utils/Authorized';
import {getAuthority} from '../utils/authority';
import { getMenuData } from '../common/menu';
import logo from '../assets/logo.jpg';
import { changeUserPass } from '../services/api';

const { Content } = Layout;
const { AuthorizedRoute } = Authorized;
const FormItem = Form.Item;
/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};
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
      title="修改密码"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      destroyOnClose
    >
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="原密码"
      >
        {form.getFieldDecorator('oldPwd', {
          rules: [{ required: true, message: '请输入原密码' }],
        })(
          <Input type="password" placeholder="请输入原密码" />
        )}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="新密码"
      >
        {form.getFieldDecorator('newPwd', {
          rules: [{ required: true, message: '请输入新密码' }],
        })(
          <Input type="password" placeholder="请输入新密码" />
        )}
      </FormItem>
    </Modal>
  );
});
let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }
  state = {
    isMobile,
    modalVisible: false,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }
  componentDidMount() {
    enquireScreen((mobile) => {
      this.setState({
        isMobile: mobile,
      });
    });

    /* this.props.dispatch({
      type: 'user/fetchCurrent',
    }); */
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '管理系统';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 管理系统`;
    }
    return title;
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {      
      return '../project';      
    }
    return redirect;
  }
  handleMenuCollapse = (collapsed) => {
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  }
  handleAdd = async (fields) => {
    const { code } = await changeUserPass(fields);
    if (code === 0) {
      message.success('修改成功');
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
  handleMenuClick = ({ key }) => {
    if (key === 'changepass') {
      // 修改密码
      // this.props.dispatch(routerRedux.push('/exception/trigger'));
      this.handleModalVisible(true);
      return;
    }
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  }
  /* handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  } */
  render() {
    const {
      currentUser, collapsed, fetchingNotices, notices, routerData, match, location,
    } = this.props;

    const bashRedirect = this.getBashRedirect();

    const layout = (
      <Layout>
        {
          getAuthority() === 'user' ? null : (
            <SiderMenu
              logo={logo}
              // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
              // If you do not have the Authorized parameter
              // you will be forced to jump to the 403 interface without permission
              Authorized={Authorized}
              menuData={getMenuData()}
              collapsed={collapsed}
              location={location}
              isMobile={this.state.isMobile}
              onCollapse={this.handleMenuCollapse}
            />
          )
        }
        
        <Layout>
          <GlobalHeader
            logo={logo}
            currentUser={currentUser || {}}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            isMobile={this.state.isMobile}
            // onNoticeClear={this.handleNoticeClear}
            onCollapse={this.handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            // onNoticeVisibleChange={this.handleNoticeVisibleChange}
          />
          <CreateForm
            handleAdd={this.handleAdd}
            handleModalVisible={this.handleModalVisible}
            modalVisible={this.state.modalVisible}
          />
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <Switch>
              {
                redirectData.map(item =>
                  <Redirect key={item.from} exact from={item.from} to={item.to} />
                )
              }
              {
                getRoutes(match.path, routerData).map(item =>
                  (
                    <AuthorizedRoute
                      key={item.key}
                      path={item.path}
                      component={item.component}
                      exact={item.exact}
                      authority={item.authority}
                      redirectPath="/exception/403"
                    />
                  )
                )
              }
              <Redirect exact from="/" to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
          <GlobalFooter
            links={[{
              key: '系统首页',
              title: '系统首页',
              href: '/',
              blankTarget: true,
            }]}
            copyright={
              <div>
                <a href="http://www.miitbeian.gov.cn" target="_blank" rel="nofollow me noopener noreferrer" style={{ color: 'rgba(0,0,0,.45)' }}>沪ICP备15020214号-1</a>  Copyright <Icon type="copyright" /> 2018 上海迪控出品
              </div>
            }
          />
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ user, global, list/* , loading */ }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  list: list.list,
  // fetchingNotices: loading.effects['global/fetchNotices'],
  // notices: global.notices,
}))(BasicLayout);
