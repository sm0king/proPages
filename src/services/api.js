import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/light/project/notice');
}

export async function queryWorkList({ id }) {
  // debugger;
  return request(`/light/user/project/enter/${id}`);
}
export async function queryProjectList(params) {
  return request('/light/project/list', {
    method: 'POST',
    body: params,
  });
}
export async function queryDeviceList(params) {
  return request('/light/dtu/list', {
    method: 'POST',
    body: params,
  });
}
export async function addDevice(params) {
  return request('/light/dtu/add', {
    method: 'POST',
    body: params,
  });
}
export async function updateDevice(params) {
  return request('/light/dtu/update', {
    method: 'PUT',
    body: params,
  });
}
export async function delDevice(id) {
  return request(`/light/dtu/del/${id}`, {
    method: 'DELETE',
  });
}

export async function delGroupDevice(idArr) {
  return request('/light/group/del/device/ids', {
    method: 'DELETE',
    body: idArr,
  });
}

export async function queryDeviceOpt() {
  return request('/light/dtu/var/list', {
    method: 'GET',
  });
}
export async function queryValList(params) {
  return request('/light/register/list', {
    method: 'POST',
    body: params,
  });
}
export async function queryRegisterValue(params) {
  return request('/light/register/value', {
    method: 'POST',
    body: params,
  });
}
export async function queryTagOpt(id) {
  return request(`/light/device/list/${id}`, {
    method: 'GET',
  });
}
export async function queryDtuList(id) {
  return request(`/light/dtu/${id}`, {
    method: 'GET',
  });
}
export async function addDTU(params) {
  return request('/light/device/add', {
    method: 'POST',
    body: params,
  });
}
export async function queryGroup(params) {
  return request('/light/group/list', {
    method: 'POST',
    body: params,
  });
}
export async function delDTU(id) {
  return request(`/light/device/del/${id}`, {
    method: 'DELETE',
  });
}

export async function queryDTUAll() {
  return request('/light/device/all', {
    method: 'GET',
  });
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/light/tags');
}

export async function queryBasicProfile() {
  return request('/light/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/light/profile/advanced');
}

export async function queryFakeList(params) {
  return request('/light/project/update', {
    method: 'POST',
    body: params,
  });
}

export async function fakeAccountLogin(params) {
  // 判断用户密码登陆还是短信验证码登陆 默认直接登陆
  if(params.captcha){
    // 短信验证码
    return request(`/light/user/login/sms/${params.captcha}`, {
      method: 'POST',
      body: {},
    });
  } else {
    return request('/light/user/login', {
      method: 'POST',
      body: params,
    });
  }
}

export async function fakeLoginOut() {
  return request('/light/user/login-out', {
    method: 'POST',
    body: {},
  });
}
export async function fakeRegister(params) {
  return request('/light/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/light/notices');
}

export async function queryGroName(params) {
  return request('/light/group/add', {
    method: 'POST',
    body: params,
  });
}

export async function queryGroDevice(id) {
  return request(`/light/group/device/${id}`, {
    method: 'GET',
  });
}

export async function queryUpdateDevice(params) {
  return request('/light/group/update/device', {
    method: 'PUT',
    body: params,
  });
}
export async function queryAddDevice(params) {
  return request('/light/group/add/device', {
    method: 'POST',
    body: params,
  });
}
export async function querySetcalendar(date) {
  return request('/light/timing/add/holiday/node', {
    method: 'POST',
    body: date,
  });
}
export async function queryNodetype(params) {
  return request('/light/timing/list/nodetype', {
    method: 'POST',
    body: params,
  });
}
export async function querySpecifiedNode(params) {
  return request('/light/timing/add/specified/node', {
    method: 'POST',
    body: params,
  });
}
export async function querytDeviceAndGro() {
  // 请求到 群组和设备 第一个select
  return request('light/timing/board/list ', {
    method: 'GET',
  });
}
export async function queryDeviceSeltctValue() {
  // 根据请求到的数据请求到相应的值。
  return request('/light/', {
    method: '',
  });
}
export async function queryAddProject(params) {
  return request('/light/project/add', {
    method: 'POST',
    body: params,
  });
}
export async function queryTreeCustomize() {
  return request('/light/panel/list', {
    method: 'POST',
    body: {},
  });
}
export async function queryaddCustomize(params) {
  return request('/light/panel/add', {
    method: 'POST',
    body: params,
  });
}
export async function queryDelPanel(id) {
  return request(`/light/panel/del/${id}`, {
    method: 'GET',
  });
}
export async function queryPanelUpdate(params) {
  return request('/light/panel/update', {
    method: 'POST',
    body: params,
  });
}
export async function qeurySysVarList(params) {
  return request('light/sys/var/list', {
    method: 'POST',
    body: params,
  });
}
export async function qeuryUpSysVar(params) {
  return request('light/sys/var/update', {
    method: 'PUT',
    body: params,
  });
}
export async function queryDelSysVar(id) {
  return request(`/light/register/${id}`, {
    method: 'DELETE',
  });
}
export async function qeuryHistory(params) {
  return request('/light/history/list', {
    method: 'POST',
    body: params,
  });
}
export async function queryDelgroup(id) {
  return request(`/light/group/del/${id}`, {
    method: 'DELETE',
  });
}
export async function queryDelProject(id) {
  return request(`/light/project/del/${id}`, {
    method: 'GET',
  });
}

export async function submitordinaryNode(params) {
  return request('/light/timing/add/ordinary/node', {
    method: 'POST',
    body: params,
  });
}

export async function submitspecifiedNode(params) {
  return request('/light/timing/add/specified/node', {
    method: 'POST',
    body: params,
  });
}

export async function timingDel(id) {
  return request(`/light/timing/del/${id}`, {
    method: 'DELETE',
  });
}

export async function getTimingHoliday(time) {
  return request(`/light/timing/holiday/${time}`, {
    method: 'GET',
  });
}
export async function getOnlineUser() {
  return request('/light/user/online/list', {
    method: 'POST',
    body: {},
  });
}

export async function queryUserList(params) {
  return request('/light/user/list', {
    method: 'POST',
    body: params,
  });
}
export async function queryUserPower(userId) {
  return request(`/light/user/project/list/${userId}`, {
    method: 'GET',
  });
}
export async function submitAddUser(params) {
  return request('/light/user/add', {
    method: 'POST',
    body: params,
  });
}
export async function submitUpUser(params) {
  return request('/light/user/update', {
    method: 'POST',
    body: params,
  });
}

export async function queryDelUser(userId) {
  return request(`/light/user/del/${userId}`, {
    method: 'GET',
  });
}

export async function queryAddUserPower(params) {
  return request('/light/user/project/add', {
    method: 'POST',
    body: params,
  });
}
export async function queryDelUserPower(params) {
  return request('/light/user/project/del', {
    method: 'POST',
    body: params,
  });
}
export async function deviceStat(params) {
  return request('/light/device/online', {
    method: 'POST',
    body: params,
  });
}
export async function queryTimingViewNode(time) {
  return request(`/light/timing/node/view/${time}`, {
    method: 'GET',
  });
}

export async function queryTableData(params) {
  return request(`/light/monitor/list/${params.type}/${params.id}`, {
    method: 'POST',
    body: {},
  });
}
export async function queryMonitorAdd(params) {
  return request('/light/monitor/add', {
    method: 'POST',
    body: params,
  });
}
export async function queryMonitorUpdate(params) {
  return request('/light/monitor/update', {
    method: 'POST',
    body: params,
  });
}
export async function queryChangeMonitor(params) {
  return request(`/light/monitor/change/${params.monitorId}/${params.value}`, {
    method: 'POST',
    body: {},
  });
}

export async function queryMonitorSource(params) {
  return request(`/light/monitor/source/list/${params}`, {
    method: 'POST',
    body: {},
  });
}

export async function queryRefreshMonitor(params) {
  return request(`/light/monitor/refresh/${params.type}/${params.id}`, {
    method: 'POST',
    body: {},
  });
}

export async function queryDelMonitor(monitorId) {
  return request(`/light/monitor/del/${monitorId}`, {
    method: 'POST',
  });
}

export async function queryCelCalendar(time) {
  return request(`/light/timing/del/holiday/${time}`, {
    method: 'DELETE',
  });
}
export async function changeUserPass(password) {
  return request('/light/user/change/pwd', {
    method: 'PUT',
    body: password,
  });
}
export async function queryUpDevice(params) {
  return request('/light/device/update', {
    method: 'PUT',
    body: params,
  });
}
export async function queryGetCity(parentId) {
  return request(`/light/cnarea/list/${parentId}`, {
    method: 'GET',
  });
}
export async function queryRefreshStat(params) {
  return request('/light/device/online/refresh', {
    method: 'POST',
    body: params,
  });
}
export async function queryGetMonitor(id) {
  return request(`/light/monitor/info/${id}`, {
    method: 'GET',
  });
}
export async function qeuryPanelDtu(params) {
  return request('/light//dtu/list/nopage', {
    method: 'POST',
    body: params,
  });
}
// 数据历史
// /light/history/export
export async function exportHistoryData(params) {
  return request('/light/history/export', {
    method: 'POST',
    type: 'blob',
    body: params,
  })
}
// 告警
export async function qeuryAlarmList(params) {
  return request('/light/alarm/list', {
    method: 'POST',
    body: params,
  });
}
// 告警 add
export async function alarmAdd(params) {
  return request('/light/alarm/add', {
    method: 'POST',
    body: params,
  });
}
export async function alarmUpdate(params) {
  return request('/light/alarm/update', {
    method: 'POST',
    body: params,
  });
}
// /light/alarm/history
export async function queryAlarmHistory() {
  return request('/light/alarm/history?pageNo=0&pageSize=10000', {
    method: 'GET',
  });
}
