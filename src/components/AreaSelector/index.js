import React, { Component } from 'react';
import { Cascader } from 'antd';
import { queryGetCity } from '../../services/api';

export default class AreaSelector extends Component {
  state = {
    options: [],
  }

  async componentWillMount() {
    const options = await this.loadChildren();
    this.setState({ options });
  }

   loadChildren = async (parentId = 0) => {
     const { data } = await queryGetCity(parentId);
     return data.map(({ name: label, id: value }) => ({ label, value, isLeaf: false }));
   }


  loadData = async (selectedOptions) => {
    const lastArea = selectedOptions[selectedOptions.length - 1];
    lastArea.loading = true;
    const children = await this.loadChildren(lastArea.value);
    lastArea.loading = false;
    lastArea.isLeaf = !children.length;
    if (children.length) {
      lastArea.children = children;
    }
    this.forceUpdate();
  }

  render() {
    return (
      <Cascader
        loadData={this.loadData}
        options={this.state.options}
        onChange={this.props.onChange}
        changeOnSelect
      />
    );
  }
}
