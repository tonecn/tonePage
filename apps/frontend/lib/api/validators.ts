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
import { APIError } from './common'

/**
 * ==================== 枚举定义 ====================
 */

/**
 * 博客权限枚举（从后端复制）
 */
export enum BlogPermission {
    Public = 'Public',
    ByPassword = 'ByPassword',
    List = 'List',
    AllowComments = 'AllowComments',
}

/**
 * ==================== 验证规则常量 ====================
 */

const VALIDATION_RULES = {
    // 用户名：4-32位，仅允许字母、数字、下划线
    username: {
        min: 4,
        max: 32,
        pattern: /^[a-zA-Z0-9_]+$/,
        message: '用户名长度为4-32位，仅支持字母、数字、下划线',
    },
    // 昵称：1-30位
    nickname: {
        min: 1,
        max: 30,
        message: '昵称长度为1-30位',
    },
    // 密码：6-32位，允许字母、数字、特殊字符
    password: {
        min: 6,
        max: 32,
        pattern: /^[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{6,32}$/,
        message: '密码长度为6-32位，支持字母、数字及常见特殊字符',
    },
    // 邮箱：6-254位（RFC 5321）
    email: {
        min: 6,
        max: 254,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: '请输入有效的邮箱地址',
    },
    // 手机号：中国大陆手机号（11位，1开头，第二位为3-9）
    phone: {
        pattern: /^1[3456789]\d{9}$/,
        message: '请输入有效的中国大陆手机号',
    },
    // 短信验证码：6位数字
    smsCode: {
        pattern: /^\d{6}$/,
        message: '验证码必须是6位数字',
    },
    // UUID v4 格式
    uuid: {
        pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        message: '不合法的ID',
    },
    // 登录标识符：支持用户名(4-32)、邮箱(6-254)、手机号(11)，取最小值4和最大值254
    identifier: {
        min: 4,
        max: 254,
        message: '账户长度应为4~254位',
    },
} as const

/**
 * ==================== 辅助函数 ====================
 */

/**
 * 将 Zod 验证错误转换为 APIError
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
     * identifier 支持用户名、邮箱、手机号
     */
    loginByPassword: (identifier: string, password: string) => {
        const schema = z.object({
            identifier: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '请输入账户和密码')
                .refine(
                    v => v.length >= VALIDATION_RULES.identifier.min && v.length <= VALIDATION_RULES.identifier.max,
                    `账户长度为${VALIDATION_RULES.identifier.min}-${VALIDATION_RULES.identifier.max}位`
                ),
            password: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '请输入账户和密码')
                .refine(
                    v => v.length >= VALIDATION_RULES.password.min && v.length <= VALIDATION_RULES.password.max,
                    VALIDATION_RULES.password.message
                ),
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
                .refine(v => VALIDATION_RULES.phone.pattern.test(v), VALIDATION_RULES.phone.message),
            code: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '请输入手机号及短信验证码')
                .refine(v => VALIDATION_RULES.smsCode.pattern.test(v), VALIDATION_RULES.smsCode.message),
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

    /**
     * 发送登录短信验证
     */
    sendLoginSms: (phone: string) => {
        const schema = z.object({
            phone: z.string()
                .transform(v => v.trim())
                .refine(v => VALIDATION_RULES.phone.pattern.test(v), VALIDATION_RULES.phone.message),
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
    sendVerificationSms: (phone: string, type: 'bind' | 'unbind' | 'change') => {
        const schema = z.object({
            phone: z.string()
                .transform(v => v.trim())
                .refine(v => VALIDATION_RULES.phone.pattern.test(v), VALIDATION_RULES.phone.message),
            type: z.enum(['bind', 'unbind', 'change']),
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
                    v => VALIDATION_RULES.password.pattern.test(v),
                    VALIDATION_RULES.password.message
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
                .refine(
                    v => v.length >= VALIDATION_RULES.nickname.min && v.length <= VALIDATION_RULES.nickname.max,
                    `昵称长度为${VALIDATION_RULES.nickname.min}-${VALIDATION_RULES.nickname.max}位`
                )
                .optional(),
            email: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '邮箱不能为空')
                .refine((v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), '请输入有效的邮箱地址')
                .refine(
                    (v: string) => v.length >= VALIDATION_RULES.email.min && v.length <= VALIDATION_RULES.email.max,
                    `邮箱长度为${VALIDATION_RULES.email.min}-${VALIDATION_RULES.email.max}位`
                )
                .optional(),
            avatar: z.string()
                .transform(v => v.trim())
                .refine((v: string) => /^https?:\/\/.+/.test(v), '头像必须是有效的URL地址')
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
                .refine(v => v.length > 0, '文章URL不得为空')
                .refine((v: string) => /^https?:\/\/.+/.test(v), '文章URL必须是有效的URL地址'),
            permissions: z.array(z.enum(BlogPermission)).refine(
                arr => arr.every(p => Object.values(BlogPermission).includes(p)),
                '权限配置错误，请检查'
            ),
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
                .refine((v: string) => /^https?:\/\/.+/.test(v), '文章URL必须是有效的URL地址')
                .optional(),
            permissions: z.array(z.nativeEnum(BlogPermission))
                .refine(
                    arr => arr.every(p => Object.values(BlogPermission).includes(p)),
                    '权限配置错误，请检查'
                )
                .optional(),
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
            parentId: z.string()
                .refine(v => VALIDATION_RULES.uuid.pattern.test(v), VALIDATION_RULES.uuid.message)
                .optional(),
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
                .transform(v => v.trim())
                .refine((v: string) => /^https?:\/\/.+/.test(v), '图片URL必须是有效的URL地址'),
            link: z.string()
                .transform(v => v.trim())
                .refine((v: string) => /^https?:\/\/.+/.test(v), '链接必须是有效的URL地址'),
            tags: z.array(
                z.object({
                    name: z.string()
                        .transform(v => v.trim())
                        .refine(v => v.length > 0, '标签名称不能为空'),
                    type: z.string()
                        .transform(v => v.trim())
                        .refine(v => v.length > 0, '标签类型不能为空'),
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
                .refine((v: string) => /^https?:\/\/.+/.test(v), '图片URL必须是有效的URL地址')
                .optional(),
            link: z.string()
                .transform(v => v.trim())
                .refine((v: string) => /^https?:\/\/.+/.test(v), '链接必须是有效的URL地址')
                .optional(),
            tags: z.array(
                z.object({
                    name: z.string()
                        .transform(v => v.trim())
                        .refine(v => v.length > 0, '标签名称不能为空'),
                    type: z.string()
                        .transform(v => v.trim())
                        .refine(v => v.length > 0, '标签类型不能为空'),
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
            username: z.string()
                .transform(v => v.trim())
                .refine(
                    v => v.length >= VALIDATION_RULES.username.min && v.length <= VALIDATION_RULES.username.max,
                    VALIDATION_RULES.username.message
                )
                .refine(
                    v => VALIDATION_RULES.username.pattern.test(v),
                    VALIDATION_RULES.username.message
                )
                .nullable(),
            nickname: z.string()
                .transform(v => v.trim())
                .refine(
                    v => v.length >= VALIDATION_RULES.nickname.min && v.length <= VALIDATION_RULES.nickname.max,
                    `昵称长度为${VALIDATION_RULES.nickname.min}-${VALIDATION_RULES.nickname.max}位`
                )
                .nullable(),
            email: z.string()
                .transform(v => v.trim())
                .refine((v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), '请输入有效的邮箱地址')
                .refine(
                    (v: string) => v.length >= VALIDATION_RULES.email.min && v.length <= VALIDATION_RULES.email.max,
                    `邮箱长度为${VALIDATION_RULES.email.min}-${VALIDATION_RULES.email.max}位`
                )
                .nullable(),
            phone: z.string()
                .transform(v => v.trim())
                .refine(v => VALIDATION_RULES.phone.pattern.test(v), VALIDATION_RULES.phone.message)
                .nullable(),
            password: z.string()
                .transform(v => v.trim())
                .refine(
                    v => VALIDATION_RULES.password.pattern.test(v),
                    VALIDATION_RULES.password.message
                )
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
     * 更新用户验证
     */
    updateUser: (data: {
        username?: string
        nickname?: string
        email?: string | null
        phone?: string | null
        avatar?: string
        roles?: string[]
    }) => {
        const schema = z.object({
            username: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '用户名不能为空')
                .refine(
                    v => v.length >= VALIDATION_RULES.username.min && v.length <= VALIDATION_RULES.username.max,
                    VALIDATION_RULES.username.message
                )
                .refine(
                    v => VALIDATION_RULES.username.pattern.test(v),
                    VALIDATION_RULES.username.message
                )
                .optional(),
            nickname: z.string()
                .transform(v => v.trim())
                .refine(v => v.length > 0, '昵称不能为空')
                .refine(
                    v => v.length >= VALIDATION_RULES.nickname.min && v.length <= VALIDATION_RULES.nickname.max,
                    `昵称长度为${VALIDATION_RULES.nickname.min}-${VALIDATION_RULES.nickname.max}位`
                )
                .optional(),
            email: z.string()
                .transform(v => v.trim())
                .transform(v => v.length === 0 ? null : v)
                .refine(
                    v => v === null || (v.includes('@') && v.length >= VALIDATION_RULES.email.min && v.length <= VALIDATION_RULES.email.max),
                    `邮箱长度为${VALIDATION_RULES.email.min}-${VALIDATION_RULES.email.max}位`
                )
                .nullable()
                .optional(),
            phone: z.string()
                .transform(v => v.trim())
                .transform(v => v.length === 0 ? null : v)
                .refine(
                    v => v === null || VALIDATION_RULES.phone.pattern.test(v),
                    VALIDATION_RULES.phone.message
                )
                .nullable()
                .optional(),
            avatar: z.string()
                .transform(v => v.trim())
                .refine((v: string) => /^https?:\/\/.+/.test(v), '头像必须是有效的URL地址')
                .optional(),
            roles: z.array(z.string()).optional(),
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
                    v => VALIDATION_RULES.password.pattern.test(v),
                    VALIDATION_RULES.password.message
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
