import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { List, Switch, Icon, Input, Row, Col, message } from 'antd';

const ItemList = List.Item;

@connect(({ loading, list }) => ({
  list,
  loading: loading.models.list,
}))

export default class ListTableData extends PureComponent {
  state ={
    varDataList: [],
    // inputVal: '',
  }
  componentWillReceiveProps(props) {
    const { varDataList } = props;
    const staVal = [];
    varDataList.forEach((element) => {
      staVal.push({
        monitorId: element.monitorId,
        currentValue: element.currentValue,
      });
    });
    this.setState({
      varDataList,
      staVal,
    });
  }
  changeSwith = async (checked, item) => {
    //
    const { varDataList } = this.state;
    const tmItem = item;
    const changeData = {
      monitorId: item.monitorId,
      value: checked ? 1 : 0,
    };
    if (item.sourceType !== 3) {
      // 不是时序的时候
      tmItem.currentValue = checked ? 1 : 0;
      varDataList.splice(varDataList.findIndex(tm => tm.monitorId === item.monitorId), 1, tmItem);
      this.forceUpdate();
    }
    const { code, data } = await this.props.dispatch({
      type: 'list/changeMonitor',
      data: changeData,
    });
    if (code === 0) {
      if (+data.success > 0) {
        if (item.sourceType === 3) {
          tmItem.currentValue = checked ? 1 : 0;
          varDataList.splice(varDataList.findIndex(tm => tm.monitorId === item.monitorId), 1, tmItem);
        }
        this.forceUpdate();
      } else {
        message.success(`成功${data.success}个,失败${data.fail}个`);
      }
    }
  }
  editSwith = async (item) => {
    const { code, data } = await this.props.dispatch({
      type: 'list/getMonitor',
      data: item.monitorId,
    });
    if (code === 0) {
      this.props.changeVarData(data);
    }
    // this.props.changeVarData(data);
  }
  changeVar = async (item) => {
    // const tmItem = item;
    const changeData = {
      monitorId: item.monitorId,
      value: this.findValue(item.monitorId),
    };
    const { code, data } = await this.props.dispatch({
      type: 'list/changeMonitor',
      data: changeData,
    });
    if (code === 0) {
      message.success(`成功${data.success}个,失败${data.fail}个`);
    }
  }
  changeInput = (e, id) => {
    const thisVal = this.state.staVal.map((item) => {
      const tmItem = item;
      if (item.monitorId === id) {
        tmItem.currentValue = e.target.value;
      }
      return tmItem;
    });
    this.setState({
      staVal: thisVal,
    });
  }
  findValue = (id) => {
    const thisVal = this.state.staVal.find(item => item.monitorId === id);
    return thisVal.currentValue;
  }

  render() {
    const { dataType, loading } = this.props;
    return (
      <List
        rowKey="id"
        loading={loading || this.state.switchLoading}
        grid={{ gutter: 24, lg: 3, md: 3, sm: 2, xs: 2 }}
        dataSource={this.state.varDataList}
        renderItem={item => (
          <ItemList key={item.monitorId}>
            <Row gutter={8} style={{ textAlign: 'center' }} >
              <Col span={6}>
                {item.caption}
              </Col>
              {
                dataType === 'switch' ? (
                  <Col span={12}>
                    <Switch
                      loading={loading}
                      checkedChildren="ON"
                      unCheckedChildren="OFF"
                      checked={item.currentValue === 1}
                      onClick={checked => this.changeSwith(checked, item)}
                      style={{ margin: '0 10px' }}
                    />
                  </Col>
                ) : (
                  <div>
                    <Col span={10}>
                      <Input
                        value={this.findValue(item.monitorId)}
                        addonAfter={item.unit}
                        onChange={e => this.changeInput(e, item.monitorId)}
                      />
                    </Col>
                    <Col span={2}>
                      <Icon
                        type="save"
                        onClick={() => this.changeVar(item)}
                        style={{ padding: '8px', cursor: 'pointer' }}
                      />
                    </Col>
                  </div>
              )}
              <Col span={6}>
                <Icon
                  type="ellipsis"
                  onClick={() => this.editSwith(item)}
                  style={{ padding: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '20px', border: '1px solid #000' }}
                />
              </Col>
            </Row>
          </ItemList>
        )}
      />
    );
  }
}
