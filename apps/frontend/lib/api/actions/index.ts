/**
 * Server Actions 统一导出
 * 
 * 使用方式：
 * 
 * 方式1（命名空间导入）：
 * import * as Actions from '@/lib/api/actions'
 * const user = await Actions.AuthAction.loginByPassword(...)
 * 
 * 方式2（直接导入）：
 * import { loginByPassword, getMe } from '@/lib/api/actions'
 * const user = await loginByPassword(...)
 */

// 分类导出（用于命名空间导入）
export * as AuthAction from './auth.action';
export * as UserAction from './user.action';
export * as BlogAction from './blog.action';
export * as AdminAction from './admin.action';
export * as SMSAction from './sms.action';
export * as OSSAction from './oss.action';
export * as ResourceAction from './resource.action';

// 认证相关接口（直接导出）
export {
  loginByPassword,
  loginBySms,
  logout,
  getPasskeyRegisterOptions,
  passkeyRegister,
  getLoginByPasskeyOptions,
  loginByPasskey,
} from './auth.action';

// 用户相关接口（直接导出）
export {
  getMe,
  updatePassword,
  updateUserProfile,
} from './user.action';

// 博客相关接口（直接导出）
export {
  getBlogBySlug,
  getAllBlogs,
  getBlogComments,
  createBlogComment,
} from './blog.action';

// 短信相关接口（直接导出）
export {
  sendLoginSms,
  sendVerificationSms,
} from './sms.action';

// OSS 相关接口（直接导出）
export {
  getStsToken,
  type StsToken,
} from './oss.action';

// 资源相关接口（直接导出）
export {
  getResources,
} from './resource.action';

// 管理员相关接口（直接导出）
export {
  // 资源管理
  adminGetResources,
  adminCreateResource,
  adminGetResource,
  adminUpdateResource,
  adminDeleteResource,
  // 博客管理
  adminCreateBlog,
  adminUpdateBlog,
  adminDeleteBlog,
  adminGetBlog,
  adminGetBlogs,
  adminSetBlogPassword,
  // 用户管理
  adminCreateUser,
  adminGetUsers,
  adminGetUser,
  adminUpdateUser,
  adminRemoveUser,
  adminSetUserPassword,
  // 类型导出
  type UpdateUser,
} from './admin.action';
