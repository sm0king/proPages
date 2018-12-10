import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert } from 'antd';
import Login from '../../components/Login';
import { userInfo } from '../../utils/storage';
import styles from './Login.less';

const { UserName, Password, Submit, Captcha } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
  }
  componentDidMount() {
    userInfo.clearToken();
  }

  onTabChange = (type) => {
    this.setState({ type });
  }
  onGetCaptcha = () => {
    console.log('重新发送~');
  }
  handleSubmit = (err, values) => {
    // const { type } = this.state;
    // console.log('values: ', values, typeof (values));
    if (!err) {
      this.props.dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  }

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
    );
  }
  
  renderform = ()=>{
    const { login } = this.props;
    if(login.status === 0 && login.type === "sms") {
      return <Captcha name="captcha" onGetCaptcha={this.onGetCaptcha} />
    } else {
      return (
        <div>
          <UserName name="username" placeholder="您的账号" />
          <Password name="password" placeholder="您的密码" />
        </div>
      )
    }
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          
          {
            login.status === 'error' &&
            login.type === 'account' &&
            !login.submitting &&
            this.renderMessage('请输入正确的账号密码')
          }
          {
            this.renderform()
          }
          
          {/* <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
            <a style={{ float: 'right' }} href="">忘记密码</a>
          </div> */}
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
