/** 博客文章 */
export type Blog = {
    /** 博客uuid */
    uuid: string;
    /** 标题 */
    title: string;
    /** 描述 */
    description: string;
    /** 文章md链接 */
    src: string;
    /** 访问级别 */
    access_level: number;
    /** 访问数 */
    visit_count: number;
    /** 点赞数 */
    like_count: number;
    /** 文章加密密码 */
    encrypt_p?: string;
    /** 发布时间 */
    created_at: Date;
};

/** 博客评论 */
export type BlogComment = {
    /** 评论id */
    id: number;
    /** 文章uuid */
    uuid: string;
    /** 评论内容 */
    content: string;
    /** 昵称 */
    name: string;
    /** ip地址 */
    ip: string;
    /** ip属地 */
    ip_address: string;
    /** 用户代理 */
    user_agent: string;
    /** 是否显示 */
    display: boolean;
    /** 评论时间 */
    time: Date;
};

/** 资源信息 */
export type Resource = {
    /** 资源ID */
    uuid: string;
    /** 资源类型 */
    type: 'download' | 'resource';
    /** 推荐程度，越小越推荐 */
    recommand?: number;
    /** 标题 */
    title: string;
    /** 描述 */
    describe: string;
    /** 附加信息 */
    addition: any;
    /** 图片url */
    icon_src: string;
    /** 资源src */
    src: string;
    /** 创建时间 */
    created_at: Date;
};

/** 用户信息 */
export type User = {
    /** 用户uuid */
    uuid: string;
    /** 用户名 */
    username: string;
    /** 密码salt */
    salt: string;
    /** 密码hashed */
    password: string;
    /** 手机号 */
    phone: string;
    /** 权限列表 */
    permission: any;
    /** 邮箱 */
    email?: string;
    /** 创建时间 */
    created_at: Date;
    /** 更新信息时间 */
    updated_at?: Date;
};

/** 用户登录日志 */
export type UserLoginLog = {
    /** 登陆记录id */
    id: number;
    /** 用户uuid */
    user_uuid: string;
    /** 登陆ip */
    ip: string;
    /** 用户代理 */
    user_agent: string;
    /** 登陆时间 */
    time: Date;
};