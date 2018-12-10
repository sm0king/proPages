import { isUrl } from '../utils/utils';

const menuData = [{
  name: '项目管理',
  path: 'project',
  // authority: 'admin',
}, {
  name: '用户列表',
  path: 'userList',
  authority: 'admin',
}, {
  name: '在线用户',
  path: 'Online',
  authority: 'admin',
}];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
