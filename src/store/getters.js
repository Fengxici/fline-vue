const getters = {
  token: state => state.user.token,
  name: state => state.user.name,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  // device: state => state.app.device,
  // theme: state => state.app.theme,
  // color: state => state.app.color,
  // avatar: state => state.user.avatar,
  // welcome: state => state.user.welcome,
  // addRouters: state => state.permission.addRouters,
  // multiTab: state => state.app.multiTab
}

export default getters
