import {getUrlOrigin} from '../utils';

/* 
  操作所有用户信息的类
*/
export default class Account {
  static _ins: Account;
  static get ins(): Account {
    return this._ins || new Account();
  }
  constructor() {
    Account._ins = this;
    const user = JSON.parse(localStorage.getItem('user'));
    const users = JSON.parse(localStorage.getItem('users'));
    this.init({user, users});
  }
  /** 当前用户 */
  private _user: UserInfo;
  /** 用户组 */
  private _users: UsersInfo = {};
  private userKey: string = 'user';
  private usersKey: string = 'users';
  get user() {
    return this._user;
  }
  set user(user: UserInfo) {
    this._user = user;
    // facebook 用户不保存
    if (user && user.accountType != 2) {
      this._users[user.userId] = user;
    }
    this.save();
  }
  get users() {
    return this._users;
  }
  /* 需要在保存用户后进行的操作,不可在内部修改用户信息 */
  saveHandle?(): void;
  deleteUser(userId: number) {
    if (this._users[userId]) {
      delete this._users[userId];
    }
    if (this.user.userId === userId) {
      this._user = null;
    } else {
      this.save();
    }
  }
  save() {
    localStorage.setItem(this.userKey, JSON.stringify(this._user));
    localStorage.setItem(this.usersKey, JSON.stringify(this._users));
    if (this.saveHandle) {
      this.saveHandle();
    }
  }
  init({user, users}: {user: UserInfo; users: UsersInfo}) {
    if (user) {
      this._user = user;
    }
    if (users) {
      this._users = users;
    }
  }
}

export interface UserInfo {
  // 用户id
  userId: number;
  // 用户名
  userName: string;
  // 密码
  password: string;
  // 1.正式账号 0.游客账号
  userType: number;
  // 账号类型 0.普通用户 1.Email 用户 2.fb 账号 3.其他 11.kakao
  accountType: number;
  // 邮箱
  email?: string;
  // 邮箱是否验证，0=未设置 1=未验证 2=已验证
  emailValid: number
  // 电话号
  telephone?: string;
  // 0=登陆  1 = 注册
  firstLogin: number
  // 平台token
  token: string;
}
export interface UsersInfo {
  [key: string]: UserInfo;
}
