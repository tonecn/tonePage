/**
 * 参数验证层 - 使用 Zod 进行统一的参数校验
 * 
 * 所有验证器函数都会：
 * 1. 对字符串进行 trim
 * 2. 验证参数符合规则
 * 3. 返回验证后的、规范化的数据
 * 4. 验证失败时抛出 APIError
 */

import { z } from 'zod'
import { APIError } from '../common'

/**
 * 辅助函数：将 Zod 验证错误转换为 APIError
 */
function handleZodError(error: z.ZodError): never {
    const firstError = error.issues[0]
    const message = firstError?.message || '参数验证失败'
    throw new APIError(message, 400, -1)
}

/**
 * ==================== 认证验证器 ====================
 */

export const AuthValidators = {
    /**
     * 账密登录验证
     */
    loginByPassword: (identifier: string, password: string) => {
        const schema = z.object({
            identifier: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '请输入账户和密码')
                .refine(v => v.length >= 1 && v.length <= 254, '账户长度只能为1~254位'),
            password: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '请输入账户和密码')
                .refine(v => v.length >= 6 && v.length <= 32, '密码长度只能为6~32位'),
        })

        try {
            return schema.parse({ identifier, password })
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },

    /**
     * 短信登录验证
     */
    loginBySms: (phone: string, code: string) => {
        const schema = z.object({
            phone: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '请输入手机号及短信验证码')
                .refine(v => /^1[3-9]\d{9}$/.test(v), '请输入合法的中国大陆手机号'),
            code: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '请输入手机号及短信验证码')
                .refine(v => /^\d{6}$/.test(v), '验证码格式错误'),
        })

        try {
            return schema.parse({ phone, code })
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },

    /**
     * Passkey 注册验证
     */
    passkeyRegister: (name: string) => {
        const schema = z.object({
            name: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '通行证名称不得为空'),
        })

        try {
            return schema.parse({ name })
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },
}

/**
 * ==================== 用户验证器 ====================
 */

export const UserValidators = {
    /**
     * 更新密码验证
     */
    updatePassword: (password: string) => {
        const schema = z.object({
            password: z.string()
                .refine(
                    v => /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{6,32}$/.test(v),
                    '新密码不符合规范，请重新输入'
                ),
        })

        try {
            return schema.parse({ password })
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },
    /**
     * 更新用户信息验证
     */
    updateUserProfile: (data: {
        nickname?: string
        email?: string
        avatar?: string
    }) => {
        const schema = z.object({
            nickname: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '昵称不能为空')
                .optional(),
            email: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '邮箱不能为空')
                .optional(),
            avatar: z.string()
                .transform(v => v.trim())
                .optional(),
        })
            .refine(
                (obj) => Object.keys(obj).some(k => obj[k as keyof typeof obj] !== undefined),
                '至少需要修改一个字段'
            )

        try {
            return schema.parse(data)
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },
}

/**
 * ==================== 短信验证器 ====================
 */

export const SMSValidators = {
    /**
     * 发送登录短信验证
     */
    sendLoginSms: (phone: string) => {
        const schema = z.object({
            phone: z.string()
                .transform(v => v.trim())
                .refine(v => /^1[3-9]\d{9}$/.test(v), '请输入合法的中国大陆手机号'),
        })

        try {
            return schema.parse({ phone })
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },

    /**
     * 发送验证短信验证
     */
    sendVerificationSms: (phone: string, type: 'register' | 'reset') => {
        const schema = z.object({
            phone: z.string()
                .transform(v => v.trim())
                .refine(v => /^1[3-9]\d{9}$/.test(v), '请输入合法的中国大陆手机号'),
            type: z.enum(['register', 'reset'])
                .refine(v => v === 'register' || v === 'reset', '验证短信类型无效'),
        })

        try {
            return schema.parse({ phone, type })
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },
}

/**
 * ==================== 博客验证器 ====================
 */

export const BlogValidators = {
    /**
     * 创建博客验证
     */
    createBlog: (data: {
        title: string
        description: string
        slug: string
        contentUrl: string
        permissions: string[]
        password: string
    }) => {
        const schema = z.object({
            title: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '标题不得为空'),
            description: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '描述不得为空'),
            slug: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, 'Slug不得为空'),
            contentUrl: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '文章URL不得为空'),
            permissions: z.array(z.string()),
            password: z.string()
                .transform(v => v.trim()),
        })

        try {
            return schema.parse(data)
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },

    /**
     * 更新博客验证
     */
    updateBlog: (data: {
        title?: string
        description?: string
        slug?: string
        contentUrl?: string
        permissions?: string[]
    }) => {
        const schema = z.object({
            title: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '标题不得为空')
                .optional(),
            description: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '描述不得为空')
                .optional(),
            slug: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, 'Slug不得为空')
                .optional(),
            contentUrl: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '文章URL不得为空')
                .optional(),
            permissions: z.array(z.string()).optional(),
        })

        try {
            return schema.parse(data)
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },

    /**
     * 设置博客密码验证
     */
    setBlogPassword: (password: string) => {
        const schema = z.object({
            password: z.string()
                .transform(v => v.trim()),
        })

        try {
            return schema.parse({ password })
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },

    /**
     * 创建评论验证
     */
    createComment: (content: string, parentId?: string) => {
        const schema = z.object({
            content: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '评论内容不能为空'),
            parentId: z.string().optional(),
        })

        try {
            return schema.parse({ content, parentId })
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },
}

/**
 * ==================== 资源验证器 ====================
 */

export const ResourceValidators = {
    /**
     * 创建资源验证
     */
    createResource: (data: {
        title: string
        description: string
        imageUrl: string
        link: string
        tags: { name: string; type: string }[]
    }) => {
        const schema = z.object({
            title: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '资源标题不能为空'),
            description: z.string()
                .transform(v => v.trim()),
            imageUrl: z.string()
                .transform(v => v.trim()),
            link: z.string()
                .transform(v => v.trim()),
            tags: z.array(
                z.object({
                    name: z.string().transform(v => v.trim()),
                    type: z.string().transform(v => v.trim()),
                })
            ),
        })

        try {
            return schema.parse(data)
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },

    /**
     * 更新资源验证
     */
    updateResource: (data: {
        title?: string
        description?: string
        imageUrl?: string
        link?: string
        tags?: { name: string; type: string }[]
    }) => {
        const schema = z.object({
            title: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '资源标题不能为空')
                .optional(),
            description: z.string()
                .transform(v => v.trim())
                .optional(),
            imageUrl: z.string()
                .transform(v => v.trim())
                .optional(),
            link: z.string()
                .transform(v => v.trim())
                .optional(),
            tags: z.array(
                z.object({
                    name: z.string().transform(v => v.trim()),
                    type: z.string().transform(v => v.trim()),
                })
            ).optional(),
        })

        try {
            return schema.parse(data)
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },
}

/**
 * ==================== 管理员验证器 ====================
 */

export const AdminValidators = {
    /**
     * 创建用户验证
     */
    createUser: (data: {
        username: string | null
        nickname: string | null
        email: string | null
        phone: string | null
        password: string | null
    }) => {
        const schema = z.object({
            username: z.string().transform(v => v.trim()).nullable(),
            nickname: z.string().transform(v => v.trim()).nullable(),
            email: z.string().transform(v => v.trim()).nullable(),
            phone: z.string().transform(v => v.trim()).nullable(),
            password: z.string().transform(v => v.trim()).nullable(),
        })

        try {
            return schema.parse(data)
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },

    /**
     * 更新用户验证
     */
    updateUser: (data: {
        username: string
        nickname: string
        email: string | null
        phone: string | null
    }) => {
        const schema = z.object({
            username: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '用户名不能为空'),
            nickname: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '昵称不能为空'),
            email: z.string()
                .transform(v => v.trim())
                .transform(v => v.length === 0 ? null : v)
                .nullable(),
            phone: z.string()
                .transform(v => v.trim())
                .transform(v => v.length === 0 ? null : v)
                .nullable(),
        })

        try {
            return schema.parse(data)
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },

    /**
     * 设置用户密码验证
     */
    setUserPassword: (password: string) => {
        const schema = z.object({
            password: z.string()
                .transform(v => v.trim())
                .refine(
                    v => /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.< >/?]{6,32}$/.test(v),
                    '密码不符合规范，请重新输入'
                ),
        })

        try {
            return schema.parse({ password })
        } catch (error) {
            if (error instanceof z.ZodError) {
                handleZodError(error)
            }
            throw error
        }
    },
}
