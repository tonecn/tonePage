/**
 * API 架构快速参考指南 v2.0
 * 
 * 解决腾讯云 EdgeOne Pages 部署时的 host header 不匹配问题
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 📋 目录结构
 * ═══════════════════════════════════════════════════════════════════
 * 
 * lib/api/
 * ├── server/                         # 🔒 服务端专用（隐藏后端地址）
 * │   ├── backend-client.ts           # 核心：后端 HTTP 通信
 * │   └── index.ts                    # 服务端 API 统一导出
 * │
 * ├── client/                         # 🌐 客户端专用（通过 Route Handlers）
 * │   └── index.ts                    # 客户端 API 统一导出
 * │
 * ├── common.ts                       # 📦 错误处理（通用）
 * └── validators.ts                   # ✅ 参数验证（通用）
 * 
 * app/api/
 * └── [...path]/                      # 🔀 通用代理路由
 *     └── route.ts                    # 将请求转发到后端
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 🚀 核心原则
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 1. 服务端组件 → 使用 @/lib/api/server
 * 2. 客户端组件 → 使用 @/lib/api/client
 * 3. Route Handlers → 使用 @/lib/api/server
 * 
 * ⚠️ 重要：客户端组件不再使用 Server Actions 进行数据请求！
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 📖 使用方式
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 【方式 1】服务端组件中使用（推荐用于 SSR/SSG）
 * ─────────────────────────────────────────────
 * 
 * // app/blog/page.tsx (Server Component)
 * import { getAllBlogs } from '@/lib/api/server'
 * 
 * export default async function BlogPage() {
 *   const blogs = await getAllBlogs()
 *   return <div>{blogs.map(blog => ...)}</div>
 * }
 * 
 * 【方式 2】客户端组件中使用（推荐用于交互）
 * ─────────────────────────────────────────────
 * 
 * 'use client'
 * import { loginByPassword, getMe } from '@/lib/api/client'
 * import { useState } from 'react'
 * 
 * export default function LoginPage() {
 *   const [loading, setLoading] = useState(false)
 *
 *   const handleLogin = async (identifier: string, password: string) => {
 *     setLoading(true)
 *     try {
 *       const result = await loginByPassword(identifier, password)
 *       // 处理登录成功
 *     } catch (error) {
 *       // 处理错误
 *     } finally {
 *       setLoading(false)
 *     }
 *   }
 *
 *   return <button onClick={() => handleLogin(id, pwd)}>登录</button>
 * }
 * 
 * 【方式 3】Hooks 中使用 SWR + 客户端 API
 * ──────────────────────────────────────
 * 
 * 'use client'
 * import useSWR from 'swr'
 * import { adminGetBlogs } from '@/lib/api/client'
 * 
 * export function useBlogList() {
 *   const { data, error, isLoading, mutate } = useSWR(
 *     '/admin/web/blog',
 *     () => adminGetBlogs(),
 *   )
 *   return { blogs: data, error, isLoading, refresh: mutate }
 * }
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 📦 可用的 API 函数
 * ═══════════════════════════════════════════════════════════════════
 * 
 * 服务端 (@/lib/api/server) 和 客户端 (@/lib/api/client) 导出相同的函数：
 * 
 * 【认证】
 * - loginByPassword(identifier, password)
 * - loginBySms(phone, code)
 * - logout()
 * - getPasskeyRegisterOptions()
 * - passkeyRegister(name, credentialResponse)
 * - getPasskeys()
 * - passkeyDelete(id)
 * - getLoginByPasskeyOptions()
 * - loginByPasskey(credentialResponse)
 * 
 * 【用户】
 * - getMe()
 * - updatePassword(password)
 * - updateUserProfile(data)
 * 
 * 【博客】
 * - getBlogBySlug(slug, password)
 * - getAllBlogs()
 * - getBlogComments(blogId)
 * - createBlogComment(blogId, content, parentId)
 * 
 * 【资源】
 * - getResources()
 * 
 * 【短信】
 * - sendLoginSms(phone)
 * - sendVerificationSms(phone, type)
 * 
 * 【OSS】
 * - getStsToken()
 * 
 * 【管理员】
 * - adminGetResources()
 * - adminCreateResource(data)
 * - adminGetResource(id)
 * - adminUpdateResource(id, data)
 * - adminDeleteResource(id)
 * - adminCreateBlog(data)
 * - adminUpdateBlog(id, data)
 * - adminDeleteBlog(id)
 * - adminGetBlog(id)
 * - adminGetBlogs()
 * - adminSetBlogPassword(id, password)
 * - adminCreateUser(data)
 * - adminGetUsers(params)
 * - adminGetUser(id)
 * - adminUpdateUser(id, data)
 * - adminRemoveUser(id)
 * - adminSetUserPassword(id, password)
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 🔒 安全特性
 * ═══════════════════════════════════════════════════════════════════
 * 
 * ✓ 后端 API 地址隐藏
 *   - API_BASE 仅在服务端可见
 *   - 客户端只能看到 /api/* 路由
 * 
 * ✓ 边缘环境兼容
 *   - 避免了 Server Actions 的 host header 问题
 *   - 通过 Route Handlers 代理请求
 * 
 * ✓ 自动 Cookie 管理
 *   - HttpOnly Cookie 自动转发
 *   - 无需手动处理 Cookie
 * 
 * ✓ Header 转发
 *   - User-Agent, X-Forwarded-For 等自动转发
 * 
 * ═══════════════════════════════════════════════════════════════════
 * 🔄 错误处理
 * ═══════════════════════════════════════════════════════════════════
 * 
 * import { APIError, handleAPIError, safeCall } from '@/lib/api/common'
 * 
 * // 方式 1: try-catch
 * try {
 *   const result = await loginByPassword(identifier, password)
 * } catch (error) {
 *   if (error instanceof APIError) {
 *     console.log(error.message)  // 用户友好的错误信息
 *     console.log(error.status)   // HTTP 状态码
 *     console.log(error.code)     // 业务错误代码
 *   }
 * }
 * 
 * // 方式 2: handleAPIError (适用于 toast)
 * catch (handleAPIError(({ message }) => toast.error(message)))
 * 
 * // 方式 3: safeCall (返回 { data, error })
 * const { data, error } = await safeCall(() => getAllBlogs())
 * if (error) {
 *   console.log(error.message)
 * }
 * 
 * ═══════════════════════════════════════════════════════════════════
 * ✅ 验证函数
 * ═══════════════════════════════════════════════════════════════════
 * 
 * import { AuthValidators, UserValidators, BlogValidators } from '@/lib/api/validators'
 * 
 * // 验证器会自动 trim 并验证参数，失败时抛出 APIError
 * const validated = AuthValidators.loginByPassword(identifier, password)
 */

export {};
