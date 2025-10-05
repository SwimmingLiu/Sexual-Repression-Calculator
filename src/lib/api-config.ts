/**
 * API配置文件
 * 集中管理所有API的基础URL配置
 */

export const API_CONFIG = {
  // 微信小程序API基础URL
  // ⚠️ 开发环境必须留空！使用相对路径通过代理转发，避免CORS问题
  // 生产环境可以修改为实际域名，例如: 'https://your-api-domain.com'
  WX_MINIPROGRAM_BASE_URL: 'https://doortest.orangemust.com/',
  
  // API端点
  endpoints: {
    // 使用代理路径，避免CORS问题
    wxMiniprogramUrl: '/api/wx/public/url',
  }
};

/**
 * 获取完整的微信小程序API URL
 */
export function getWxMiniprogramApiUrl(): string {
  return `${API_CONFIG.WX_MINIPROGRAM_BASE_URL}${API_CONFIG.endpoints.wxMiniprogramUrl}`;
}

