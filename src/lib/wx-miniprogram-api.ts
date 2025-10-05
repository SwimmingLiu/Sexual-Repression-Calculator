/**
 * 微信小程序API调用模块
 */

import { getWxMiniprogramApiUrl } from './api-config';

/**
 * 微信小程序URL请求参数
 */
export interface WxMiniprogramUrlParams {
  /** 小程序页面路径 */
  path: string;
  /** 失效时间类型：0-永久有效，1-失效时间间隔 */
  expire_type: 0 | 1;
  /** 失效时间间隔，单位：天 */
  expire_interval?: number;
  /** 版本：release-正式版，trial-体验版，develop-开发版 */
  env_version: 'release' | 'trial' | 'develop';
}

/**
 * 微信小程序URL响应
 */
export interface WxMiniprogramUrlResponse {
  /** URL链接 */
  url_link?: string;
  /** 错误码 */
  errcode?: number;
  /** 错误信息 */
  errmsg?: string;
}

/**
 * 获取微信小程序URL
 * @param params 请求参数
 * @returns Promise<WxMiniprogramUrlResponse>
 */
export async function getWxMiniprogramUrl(
  params: WxMiniprogramUrlParams
): Promise<WxMiniprogramUrlResponse> {
  try {
    const apiUrl = getWxMiniprogramApiUrl();
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify(params),
      mode: 'cors', // 启用CORS模式
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取微信小程序URL失败:', error);
    throw error;
  }
}

/**
 * 打开微信小程序（如果支持）
 * @param urlLink 微信小程序URL链接
 */
export function openWxMiniprogram(urlLink: string): void {
  try {
    // 尝试在新窗口打开链接
    const newWindow = window.open(urlLink, '_blank');
    
    // 如果浏览器阻止了弹窗，尝试直接跳转
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      window.location.href = urlLink;
    }
  } catch (error) {
    console.error('打开微信小程序失败:', error);
    // 降级方案：复制链接到剪贴板
    if (navigator.clipboard) {
      navigator.clipboard.writeText(urlLink).then(() => {
        alert('链接已复制到剪贴板，请在微信中打开');
      }).catch(() => {
        alert('无法自动打开，请手动复制链接：' + urlLink);
      });
    }
  }
}

