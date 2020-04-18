// 基地址
const BASE_URL = "/boot/api";
// 登陆地址
const LOGIN_URL=BASE_URL+"/login";
// 登出地址
const LOGOUT_URL=BASE_URL+"/logout";
// 不需要登陆的接口基地址
const BASE_COMMON_URL=BASE_URL+"/common"
// 用户接口基地址
const BASE_USER_URL=BASE_URL+"/user";
// 角色接口基地址
const BASE_ROLE_URL=BASE_URL+"/role";
// 部门接口基地址
const BASE_DEPT_URL=BASE_URL+'/department';
// 权限接口基地址
const BASE_PERMISSION_URL=BASE_URL+"/permission";
export default{
    BASE_URL,
    LOGIN_URL,
    LOGOUT_URL,
    BASE_COMMON_URL,
    BASE_USER_URL,
    BASE_ROLE_URL,
    BASE_PERMISSION_URL,
    BASE_DEPT_URL,
}
