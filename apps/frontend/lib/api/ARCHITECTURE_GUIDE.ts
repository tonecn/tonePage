/**
 * 新 API 架构快速参考指南
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 📋 目录结构
 * ═══════════════════════════════════════════════════════════════════
 * 
 * lib/api/
 * ├── internal/                        # 🔒 内部后端通信层（隐藏地址）
 * │   ├── backend-client.ts           # 核心：后端 HTTP 通信
 * │   ├── middleware.ts               # 请求/响应中间件
 * │   ├── types.ts                    # 内部类型定义
 * │   └── constants.ts                # API 常量和端点
 * │
 * ├── actions/                        # ✨ Server Actions 层（推荐）
 * │   ├── auth.action.ts
 * │   ├── user.action.ts
 * │   ├── blog.action.ts
 * │   ├── admin.action.ts
 * │   ├── sms.action.ts
 * │   ├── oss.action.ts
 * │   ├── resource.action.ts
 * │   └── index.ts                    # 统一导出
 * │
 * ├── client/                         # ⚠️ 客户端接口（仅公开接口）
 * │   ├── public-fetch.ts
 * │   └── index.ts
 * │
 * ├── common.ts                       # 错误处理（通用）
 * └── server.ts                       # SSR/SSG 专用（保留）
 * 
 * lib/utils/
 * └── validation.ts                   # ✨ 通用验证函数
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 🚀 使用方式
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 【方式 1】客户端组件中使用 Server Actions（推荐）
 * ─────────────────────────────────────────────────
 * 
 * 'use client'
 * import { loginByPassword, getMe } from '@/lib/api/actions'
 * import { useTransition } from 'react'
 * 
 * export default function LoginPage() {
 *   const [isPending, startTransition] = useTransition()
 *
 *   const handleLogin = (identifier: string, password: string) => {
 *     startTransition(async () => {
 *       try {
 *         const result = await loginByPassword(identifier, password)
 *         // 处理登录成功
 *       } catch (error) {
 *         // 处理错误
 *       }
 *     })
 *   }
 *
 *   return <button onClick={() => handleLogin(id, pwd)}>登录</button>
 * }
 * 
 * 【方式 2】服务端组件中使用 Server Actions
 * ─────────────────────────────────────────────
 * 
 * import { getAllBlogs } from '@/lib/api/actions'
 * 
 * export default async function BlogPage() {
 *   const blogs = await getAllBlogs()
 *   return <div>{blogs.map(blog => ...)}</div>
 * }
 * 
 * 【方式 3】命名空间导入
 * ──────────────────────
 * 
 * import * as Actions from '@/lib/api/actions'
 * 
 * const result = await Actions.AuthAction.loginByPassword(id, pwd)
 * const user = await Actions.UserAction.getMe()
 * const resources = await Actions.AdminAction.adminGetResources()
 * 
 * 【方式 4】使用验证函数
 * ──────────────────────
 * 
 * import { validateEmail, validatePhone, validatePassword } from '@/lib/utils/validation'
 * 
 * if (!validateEmail(email)) {
 *   throw new Error('邮箱格式错误')
 * }
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 📦 可用的 Server Actions
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 【认证】AuthAction
 * ─────────────────
 * - loginByPassword(identifier, password)           # 账密登录
 * - loginBySms(phone, code)                         # 短信登录
 * - logout()                                        # 登出
 * - getPasskeyRegisterOptions()                     # Passkey 注册选项
 * - passkeyRegister(name, credentialResponse)       # Passkey 注册
 * - getLoginByPasskeyOptions()                      # Passkey 登录选项
 * - loginByPasskey(credentialResponse)              # Passkey 登录
 * 
 * 【用户】UserAction
 * ──────────────────
 * - getMe()                                         # 获取当前用户信息
 * - updatePassword(password)                        # 更新密码
 * - updateUserProfile(data)                         # 更新用户信息
 * 
 * 【博客】BlogAction
 * ──────────────────
 * - getBlogBySlug(slug, password)                   # 获取博客详情
 * - getAllBlogs()                                   # 获取所有博客
 * - getBlogComments(blogId)                         # 获取博客评论
 * - createBlogComment(blogId, content, parentId)    # 创建评论
 * - adminCreateBlog(data)                           # 创建博客（管理员）
 * - adminUpdateBlog(id, data)                       # 更新博客（管理员）
 * - adminDeleteBlog(id)                             # 删除博客（管理员）
 * 
 * 【短信】SMSAction
 * ─────────────────
 * - sendLoginSms(phone)                             # 发送登录短信
 * - sendVerificationSms(phone, type)                # 发送验证短信
 * 
 * 【OSS】OSSAction
 * ────────────────
 * - getStsToken()                                   # 获取 STS Token
 * 
 * 【资源】ResourceAction
 * ──────────────────────
 * - getResources()                                  # 获取所有资源
 * - getResource(id)                                 # 获取单个资源
 * 
 * 【管理员】AdminAction
 * ─────────────────────
 * - adminGetResources()                             # 获取所有资源
 * - adminCreateResource(data)                       # 创建资源
 * - adminGetResource(id)                            # 获取单个资源
 * - adminUpdateResource(id, data)                   # 更新资源
 * - adminDeleteResource(id)                         # 删除资源
 * 
 * ═══════════════════════════════════════════════════════════════════
 * ✅ 可用的验证函数
 * ═══════════════════════════════════════════════════════════════════
 * 
 * import { validateEmail, validatePhone, validatePassword, validateUsername, validateUrl, validateSlug } from '@/lib/utils/validation'
 * 
 * - validateEmail(email)                # 验证邮箱
 * - validatePhone(phone)                # 验证手机号（中国大陆）
 * - validatePassword(password)          # 验证密码（6-32位，字母+数字）
 * - validateUsername(username)          # 验证用户名（3-20位，字母数字下划线）
 * - validateUrl(url)                    # 验证 URL
 * - validateSlug(slug)                  # 验证 slug（3-50位，小写字母数字连字符）
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 🔒 安全特性
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ✓ 后端 API 地址隐藏
 *   - API_BASE 仅在 lib/api/internal/backend-client.ts 中使用
 *   - 浏览器中无法看到真实的后端地址
 *   - 完全防止 API 地址泄露
 * 
 * ✓ 无跨域问题
 *   - Server Actions 在服务端执行
 *   - 所有请求都由 Next.js 服务器发起
 *   - 不需要 CORS 配置
 * 
 * ✓ 自动 Cookie 管理
 *   - HttpOnly Cookie 自动转发
 *   - 无需手动处理 Cookie
 *   - 完全安全
 * 
 * ✓ Header 转发
 *   - User-Agent, X-Forwarded-For 等自动转发
 *   - 保留客户端信息
 *   - 用于后端日志和安全检查
 * 
 * ✓ 统一错误处理
 *   - 所有错误通过 APIError 规范化
 *   - 前置验证减少无效请求
 *   - 清晰的错误信息
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 🔄 错误处理
 * ═══════════════════════════════════════════════════════════════════
 * 
 * try {
 *   const result = await loginByPassword(identifier, password)
 * } catch (error) {
 *   if (error instanceof APIError) {
 *     console.log(error.message)      # 用户友好的错误信息
 *     console.log(error.status)       # HTTP 状态码
 *     console.log(error.code)         # 业务错误代码
 *     console.log(error.data)         # 额外的错误数据
 *   } else {
 *     console.log('未知错误')
 *   }
 * }
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 💡 最佳实践
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. 优先使用 Server Actions（更安全、性能更好）
 * 2. 在 Server Actions 中进行前置验证
 * 3. 使用 useTransition 处理加载状态
 * 4. 捕获 APIError 处理业务错误
 * 5. 使用验证函数进行数据验证
 * 6. 避免在客户端代码中导入 backend-client
 * 7. 在 middleware 中添加日志/监控（可选）
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 🔄 迁移指南
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 如果你有旧的客户端 API 调用，这样迁移：
 * 
 * 【迁移前】
 * import { loginByPassword } from '@/lib/api/endpoints/auth.client'
 * const result = await loginByPassword(identifier, password)
 * 
 * 【迁移后】
 * import { loginByPassword } from '@/lib/api/actions'
 * const result = await loginByPassword(identifier, password)
 * // 完全相同的 API，但现在更安全了！
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 📝 常见问题
 * ═══════════════════════════════════════════════════════════════════
 * 
 * Q: 为什么要使用 Server Actions？
 * A: 后端地址隐藏、无跨域问题、更好性能、更安全
 * 
 * Q: 是否需要修改 next.config.ts？
 * A: 不需要，rewrite 可以保留或删除，Server Actions 不依赖它
 * 
 * Q: 旧的 clientFetch 还能用吗？
 * A: 可以用，但不推荐。建议迁移到 Server Actions
 * 
 * Q: 如何处理文件上传？
 * A: 使用 getStsToken() 获取 STS Token，然后直传 OSS
 * 
 * Q: Cookie 是如何转发的？
 * A: backendFetch 自动从请求中获取 Cookie 并转发
 * 
 * Q: 如何添加自定义 Header？
 * A: 传入 options.headers 参数，在 backendFetch 中自动合并
 * 
 * Q: 如何进行请求日志记录？
 * A: 使用 middleware.ts 中的 addRequestInterceptor/addResponseInterceptor
 * 
 * ═══════════════════════════════════════════════════════════════════
 */

// 这是一个参考文件，无需导出任何内容
