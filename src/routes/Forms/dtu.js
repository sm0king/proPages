import React, { PureComponent } from 'react';
import { Card, Form } from 'antd';
import { connect } from 'dva';
import DTUForm from './dtuForm';
import styles from './style.less';
import ProjectBreadcrumb from '../../components/GlobalHeader/ProjectBreadcrumb';

@connect(({ list, loading }) => ({
  list: list.dtuList,
  loading: loading.models.list,
}))

class DTU extends PureComponent {
  state = {
    width: '100%',
  };
  componentDidMount() {
    const { dispatch, match } = this.props;
    dispatch({
      type: 'list/getdtuList',
      id: match.params.deviceId,
    });
    window.addEventListener('resize', this.resizeFooterToolbar);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }
  resizeFooterToolbar = () => {
    const sider = document.querySelectorAll('.ant-layout-sider')[0];
    const width = `calc(100% - ${sider.style.width})`;
    if (this.state.width !== width) {
      this.setState({ width });
    }
  }
  saveRow = async (data) => {
    const target = data;
    if (target.isNew) {
      delete target.isNew;
      const addData = await this.props.dispatch({
        type: 'list/addDTU',
        params: target,
      });
      if (addData.code === 0) {
        this.props.dispatch({
          type: 'list/getdtuList',
          id: this.props.match.params.deviceId,
        });
      }
    } else {
      const upData = await this.props.dispatch({
        type: 'list/upDTU',
        params: target,
      });
      if (upData.code === 0) {
        this.props.dispatch({
          type: 'list/getdtuList',
          id: this.props.match.params.deviceId,
        });
      }
    }
  }
  rmDow = (id) => {
    this.props.dispatch({
      type: 'list/rmDTU',
      id,
    });
  }
  render() {
    const { list, loading } = this.props;
    const deviceList = list;
    const arrBread = [{
      id: 1,
      url: '/device',
      title: 'DTU设备设定',
    }];
    return (
      <div>
        <ProjectBreadcrumb arrBread={arrBread} />
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>DTU串口设定</h3>
        <Card className={styles.card} bordered={false}>
          <DTUForm
            value={deviceList}
            changeData={this.saveRow}
            rowKey="id"
            loading={loading}
            rmData={this.rmDow}
            device={this.props.match.params.device}
            deviceId={this.props.match.params.deviceId}
          />
        </Card>
      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(DTU));
