import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/console',
        },
        sitemap: 'https://www.tonesc.cn/sitemap.xml',
    }
}