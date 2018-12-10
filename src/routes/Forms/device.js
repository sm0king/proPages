import React, { PureComponent } from 'react';
import { Card, Form } from 'antd';
import { connect } from 'dva';
// import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import TableForm from './TableForm';
import styles from './style.less';
import ProjectBreadcrumb from '../../components/GlobalHeader/ProjectBreadcrumb';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))

class AdvancedForm extends PureComponent {
  state = {
    width: '100%',
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'list/getDeviceList',
      params: {
        pageNo: 0,
        pageSize: 10,
      },
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
    if (!target.isNew) {
      delete target.isNew;
      const recode = await this.props.dispatch({
        type: 'list/updateDevice',
        params: target,
      });
      if (recode === 0) {
        this.refresh();
      }
    } else {
      delete target.isNew;
      const recode = await this.props.dispatch({
        type: 'list/addDevice',
        params: target,
      });
      if (recode === 0) {
        this.refresh();
      }
    }
  }
  rmDow = async (id) => {
    const code = await this.props.dispatch({
      type: 'list/rmDevice',
      id,
    });
    if (code === 0) {
      this.refresh();
    }
  }
  refresh = () => {
    this.props.dispatch({
      type: 'list/getDeviceList',
      params: {
        pageNo: this.state.page,
        pageSize: this.state.pageSize,
      },
    });
  }
  changePagin = (page, pageSize) => {
    this.setState({
      page,
      pageSize,
    }, this.refresh);
  }
  render() {
    const { list, loading } = this.props;
    const { deviceList, paginNation } = list;
    paginNation.current = paginNation.pageNo;
    paginNation.onChange = this.changePagin;

    return (
      <div style={{ overflow: 'scroll' }}>
        <ProjectBreadcrumb arrBread={[]} />
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>DTU设备设定</h3>
        <Card className={styles.card} bordered={false}>
          <TableForm
            value={deviceList}
            changeData={this.saveRow}
            loading={loading}
            rmData={this.rmDow}
            paginNation={paginNation}
          />
        </Card>
        {/* <FooterToolbar style={{ width: this.state.width }}>
          <Button type="primary" onClick={validate} loading={submitting}>
            提交
          </Button>
        </FooterToolbar> */}
      </div>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(AdvancedForm));
