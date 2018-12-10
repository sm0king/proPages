import React, { PureComponent } from 'react';
import moment from 'moment';
import { Input, Table /* , Badge, Divider */, Popconfirm, Divider } from 'antd';
import styles from './index.less';

import { qeuryUpSysVar, queryDelSysVar } from '../../services/api';
import History from '../DeviceSelector/history';

class StandardTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    // clean state
    if ('data' in nextProps) {
      this.setState({
        data: nextProps.data,
      });
    }
  }

  // handleRowSelectChange = (selectedRowKeys, selectedRows) => {

  //   if (this.props.onSelectRow) {
  //     this.props.onSelectRow(selectedRows);
  //   }
  // this.setState({ selectedRowKeys });
  // }

  getRowByKey(key, newData) {
    return (newData || this.state.data.list).filter(item => item.id === key)[0];
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }
  edit = (e, id, flag) => {
    e.preventDefault();
    const editList = this.state.data.list.find(item => item.id === id);
    editList.isEd = flag;
    this.forceUpdate();
  }

  remove = async (id) => {
    await queryDelSysVar(id);
  }
  save = async (e, id, varId) => {
    e.preventDefault();
    if (document.activeElement.tagName === 'INPUT' &&
        document.activeElement !== e.target) {
      return;
    }
    const target = this.getRowByKey(id) || {};
    const reson = await qeuryUpSysVar({
      varId,
      varValue: target.varValue,
      sysVarType: target.itemType,
      id,
    });
    if (reson.code === 0) {
      this.edit(e, id, false);
    }
  }

  cacheOriginData = {};
  handleFieldChange(e, fieldName, key) {
    e.preventDefault();
    const target = this.getRowByKey(key, this.state.data.list);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.isEd) {
        this.cacheOriginData[key] = { ...target };
      }
      target.varValue = e.target.value;
      this.forceUpdate();
    }
  }

  showhistory = (e, id, type) => {
    e.preventDefault();
    this.history.show(id, type);
  }

  render() {
    // const { selectedRowKeys } = this.state;
    const { loading } = this.props;
    const { pagination, list } = this.state.data;
    // console.log(list);
    // const status = ['关闭', '运行中', '已上线', '异常'];

    const columns = [
      {
        title: '变数显示名称',
        dataIndex: 'varNameView',
      },
      {
        title: '变量名称',
        dataIndex: 'varName',
      },
      {
        title: '变数位址',
        dataIndex: 'varAddr',
        width: 100,
      },
      {
        title: '值',
        dataIndex: 'varValue',
        render: (text, record) => {
          if (record.isEd) {
            return (
              <Input
                value={text}
                placeholder="值"
                onChange={e => this.handleFieldChange(e, 'varV·alue', record.id)}
              />);
          }
          return text;
        },
      },
      {
        title: 'Time',
        dataIndex: 'varTime',
        width: 120,
        render: (text) => {
          return moment(text).format('YYYY/MM/DD HH:MM:SS');
        },
      },
      {
        title: '类别',
        dataIndex: 'varType',
      },
      {
        title: '符号(负值)',
        dataIndex: 'tag',
        width: 72,
      },
      {
        title: 'Factor',
        dataIndex: 'Factor',
        width: 84,
      },
      {
        title: '单位',
        dataIndex: 'aa',
      },
      {
        title: 'Low',
        dataIndex: 'low',
      },
      {
        title: 'High',
        dataIndex: 'high',
      },
      {
        title: '历史资料',
        dataIndex: 'history',
        width: 100,
        render: (text, record) => {
          return <a onClick={e => this.showhistory(e, record.id, record.itemType)}>查看</a>;
        },
      },
      {
        title: '控制',
        dataIndex: 'action',
        width: 120,
        render: (text, record) => {
          return !record.isEd ? (
            <span>
              <a onClick={e => this.edit(e, record.id, true)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm title="是否要删除？" onConfirm={() => this.remove(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </span>
          ) : (
            <span>
              <a onClick={e => this.save(e, record.id, record.varId)}>保存</a>
              <Divider type="vertical" />
              <a onClick={e => this.edit(e, record.id, false)}>取消</a>
            </span>
          );
        },
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    // const rowSelection = {
    //   // selectedRowKeys,
    //   onChange: this.handleRowSelectChange,
    //   getCheckboxProps: record => ({
    //     disabled: record.disabled,
    //   }),
    // };

    return (
      <div className={styles.standardTable}>
        <Table
          scroll={{x: 1000}}
          loading={loading}
          rowKey={record => record.id}
          // rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          // style={{ minWidth: '600px' }}
        />
        <History ref={(history) => { this.history = history; }} />
      </div>
    );
  }
}

export default StandardTable;
