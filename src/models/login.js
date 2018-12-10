import { routerRedux } from 'dva/router';
import { fakeAccountLogin, fakeLoginOut, queryProjectList } from '../services/api';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';
import { userInfo } from '../utils/storage';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    menus: [],
    resources: [],
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      // Login successfully
      if (response.code === 0) {
        userInfo.setToken(response.data.token);
        if(response.data.isSetSms){
          yield put({
            type: "changeLoginStatus",
            payload: {
              status: response.code,
              type: "sms",
            },
          })
        } else {
          if (response.data.managerType === 0) {
            response.currentAuthority = 'admin';
          } else {
            response.currentAuthority = 'user';
          }
          // userInfo.setToken(response.data.token);
          userInfo.setUserName(response.data.userInfo.userName);
          yield put({
            type: 'user/saveCurrentUser',
            payload: response.data.userInfo,
          });
          yield put({
            type: 'changeLoginStatus',
            payload: {
              status: response.code,
              type: "account",
            },
          });
          reloadAuthorized();
          if(response.currentAuthority === 'user') {
            const list = yield call(queryProjectList);
            if(list.data.length) {
              yield put(routerRedux.push(`/dashboard/workplace/${list.data[0].projectId}`));
              return;
            }
          }
          // 页面跳转 进入项目
          yield put(routerRedux.push('/'));
        }
      }
    },
    *logout(_, { put, /* select, */ call }) {
      /* try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally { */
      yield call(fakeLoginOut);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: 1,
          type: 'account',
        },
      });
      reloadAuthorized();
      yield put(routerRedux.push('/user/login'));
    },
  },
  // },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      console.log('payload:', payload)
      return {
        ...state,
        status: payload.status,
        // data: payload.data,
        // menus: payload.menus,
        // resources: payload.resources,
        type: payload.type,
      };
    },
  },
};
