/**
 * 微信环境检测工具
 */

/**
 * 检测是否在微信环境中
 */
export const isWechat = (): boolean => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger');
};

/**
 * 检测是否在微信小程序 webview 中
 * 微信小程序的 webview 会在 window.__wxjs_environment 中标识
 */
export const isWechatMiniProgram = (): boolean => {
  // 方法1: 通过 __wxjs_environment 判断
  const wxEnv = (window as any).__wxjs_environment;
  if (wxEnv === 'miniprogram') {
    return true;
  }

  // 方法2: 通过 wx.miniProgram 判断
  const wx = (window as any).wx;
  if (wx && wx.miniProgram) {
    return true;
  }

  // 方法3: 通过 User Agent 判断（某些版本的微信小程序）
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('miniprogram')) {
    return true;
  }

  return false;
};

/**
 * 异步检测是否在微信小程序中（更可靠的方法）
 * 使用微信 JSSDK 的 getEnv 方法
 */
export const isWechatMiniProgramAsync = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // 如果不在微信环境中，直接返回 false
    if (!isWechat()) {
      resolve(false);
      return;
    }

    // 检查同步方法
    if (isWechatMiniProgram()) {
      resolve(true);
      return;
    }

    // 使用 wx.miniProgram.getEnv 异步检测
    const wx = (window as any).wx;
    if (wx && wx.miniProgram && typeof wx.miniProgram.getEnv === 'function') {
      wx.miniProgram.getEnv((res: any) => {
        resolve(res.miniprogram === true);
      });
    } else {
      // 如果没有 JSSDK，使用同步方法的结果
      resolve(isWechatMiniProgram());
    }

    // 设置超时，避免一直等待
    setTimeout(() => {
      resolve(isWechatMiniProgram());
    }, 1000);
  });
};

