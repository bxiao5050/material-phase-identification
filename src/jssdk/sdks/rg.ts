import NativeSdk from './native';
import WebSdk from "./web";
// import FbWebGameSdk from "./facebookWebGame";
// import FbInstantGameSdk from "./facebookInstantGame";
// import QuickSdk from "./uniteSdk/quick";
import {GamePayParams} from './base';

declare global {
  let RG: RGType;
  interface Window {
    RG: RGType;
  }
  interface RGType {
    type: number;
    jssdk: NativeSdk|WebSdk
    CurUserInfo(): any;
    BindZone(params: BindZoneParam): Promise<ServerRes>;
    Pay(params: GamePayParams): void;
    Share(url: string): Promise<{code: number; error_msg?: string}>;
    Mark(name: string, params?: {userId?: number; money: string; currency: string}): void;
    Install(): void;
    Redirect(): void;
    ChangeAccount(): Promise<any>;
    /* 打开粉丝页 */
    Messenger():void
  }
}

export function initRG(sdk: NativeSdk|WebSdk) {
  function RgFunciton(this: RGType) {
    this.type = sdk.type;
    this.CurUserInfo = function() {
      const {userId, userName, token} = sdk.account.user;
      return {userId, userName, token};
    };
    this.BindZone = function(params: BindZoneParam) {
      return sdk.bindZone(params);
    };
    this.Pay = function(params: GamePayParams) {
      sdk.pay(params);
    };
    this.Share = function(url: string) {
      return sdk.fbShare(url);
    };
    this.Mark = function(
      name: string,
      params?: {userId?: number; money: string; currency: string}
    ) {
      sdk.mark(name, params);
    };
    /* 微端 */
    if (sdk.install) {
      this.Install = function() {
        sdk.install();
      };
    }
    this.Redirect = function() {
      sdk.redirect();
    };
    this.Messenger = function () {
      sdk.openFansPage();
    }
    this.ChangeAccount = function() {
      return Promise.resolve();
    };
  }
  RgFunciton.prototype.jssdk = sdk;
  window.RG = new RgFunciton();
}

export interface BindZoneParam {
  // userId 用户id
  userId: number;
  // gameZoneId 区服id
  gameZoneId: string;
  // createRole  是否创角 0=否 1=是
  createRole: number;
  // roleId  角色id
  roleId: string;
  // level 角色等级
  level: string;
}
