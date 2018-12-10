import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import TreeItem from './TreeItem';
import EditTable from './EditTable';
import ProjectBreadcrumb from '../../components/GlobalHeader/ProjectBreadcrumb';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))

export default class Monitor extends PureComponent {
  state ={
    tableTitle: '',
    tableId: '',
    // isRefresh: '',
  }
  componentDidMount() {
    const { dispatch } = this.props;
    clearInterval(this.isRefresh);
    // 请求设备的数据
    dispatch({
      type: 'list/treeDevice',
    });
    // 请求自定义的数据
    dispatch({
      type: 'list/treeCustomize',
    });
  }
  componentWillUnmount() {
    clearInterval(this.isRefresh);
  }
  setTabTitle = (e, item, type) => {
    e.preventDefault();
    // 点击选中左边菜单
    this.props.dispatch({
      type: 'list/changeSelectTree',
      editType: type,
    });
    this.props.dispatch({
      type: 'list/getTableData',
      queryData: {
        type: type === 'dust' ? 2 : 1,
        id: item.id || item.panelId,
      },
    });
    this.setState({
      tableTitle: item.panelName,
      tableId: item.id || item.panelId,
    }, this.timeless);
    // this.timeless();
  }
  timeless = () => {
    clearInterval(this.isRefresh);
    if (this.props.list.editType && this.state.tableId) {
      this.isRefresh = setInterval(() => {
        this.refresh();
      }, 60000);
    }
  }
  refresh = () => {
    // e.preventDefault();
    // 刷新
    this.props.dispatch({
      type: 'list/getTableData',
      queryData: {
        type: this.props.list.editType === 'dust' ? 2 : 1,
        id: this.state.tableId,
      },
    });
  }
  changeTree = () => {
    const { dispatch } = this.props;
    // 请求设备的数据
    dispatch({
      type: 'list/treeDevice',
    });
    // 请求自定义的数据
    dispatch({
      type: 'list/treeCustomize',
    });
  }

  render() {
    return (
      <div style={{ overflow: 'scroll' }}>
        <ProjectBreadcrumb arrBread={[]} />
        <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>设备监控</h3>
        <Row style={{ minWidth: '600px' }}>
          <Col span={3}>
            <TreeItem
              changeTree={this.changeTree}
              setTabTitle={this.setTabTitle}
            />
          </Col>
          <Col span={21}>
            <EditTable
              title={this.state.tableTitle}
              id={this.state.tableId}
              refresh={this.refresh}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
