/**
 * 微信小程序 API 配置
 * 可以根据需要修改 base URL
 */

// 微信小程序 API 的基础 URL
// 在开发环境中，使用代理前缀 /wx-api 来避免跨域问题
// 在生产环境中，需要替换为实际的 API 地址
export const WX_API_BASE_URL = import.meta.env.DEV 
  ? '/wx-api' 
  : 'https://test.doors.orangemust.com';

// 获取微信小程序 URL Link 的 API 路径
export const WX_URL_LINK_PATH = '/common/wx/public/url';

/**
 * 获取完整的微信小程序 URL Link API 地址
 */
export const getWxUrlLinkApi = () => {
  return `${WX_API_BASE_URL}${WX_URL_LINK_PATH}`;
};

/**
 * 微信小程序 URL Link 请求参数接口
 */
export interface WxUrlLinkParams {
  path: string;           // 小程序页面路径
  expire_type: number;    // 过期类型，1 表示到期失效
  expire_interval: number; // 过期时间间隔，单位天
  env_version: string;    // 版本，release | trial | develop
}

/**
 * 微信小程序 URL Link 响应接口
 */
export interface WxUrlLinkResponse {
  success: boolean;
  code: number;
  message: string;
  data: {
    errcode: number;
    errmsg: string;
    url_link: string;
  };
}

/**
 * 获取微信小程序 URL Link
 */
export const fetchWxUrlLink = async (
  params: WxUrlLinkParams
): Promise<string | null> => {
  try {
    const response = await fetch(getWxUrlLinkApi(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: WxUrlLinkResponse = await response.json();

    if (result.success && result.data?.url_link) {
      return result.data.url_link;
    } else {
      console.error('获取微信小程序链接失败:', result.message);
      return null;
    }
  } catch (error) {
    console.error('请求微信小程序链接时出错:', error);
    return null;
  }
};

