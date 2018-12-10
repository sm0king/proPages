export const userInfo = {
  getToken: () => localStorage.getItem('token'),
  clearToken: () => localStorage.removeItem('token'),
  setToken: token => localStorage.setItem('token', token),
  setDefaltPro: itemUrl => localStorage.setItem('itemUrl', itemUrl),
  getDefaltPro: () => localStorage.getItem('itemUrl'),
  setDefaltProName: proName => localStorage.setItem('proName', proName),
  getDefaltProName: () => localStorage.getItem('proName'),
  setUserName: userName => localStorage.setItem('userName', userName),
  getUserName: () => localStorage.getItem('userName'),
};
