import { BlogAPI } from '@/lib/api/server'
import { base62 } from '@/lib/utils'
import { MetadataRoute } from 'next'

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 获取所有博客
    const blogs = await BlogAPI.list().catch(() => [])

    const blogUrls = blogs.map(blog => {
        const cleanId = blog.id.replace(/-/g, '')
        const encoded = base62.encode(Buffer.from(cleanId, 'hex'))
        return {
            url: `https://www.tonesc.cn/blog/${encoded}`,
            lastModified: new Date(blog.updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }
    })

    // 静态页面
    const staticUrls = [
        {
            url: 'https://www.tonesc.cn/',
            lastModified: new Date(),
            changeFrequency: 'yearly' as const,
            priority: 1,
        },
        {
            url: 'https://www.tonesc.cn/blog',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: 'https://www.tonesc.cn/resource',
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
    ]

    return [...staticUrls, ...blogUrls]
}