import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BlogAPI } from "@/lib/api/server";
import { handleAPIError } from "@/lib/api/common";

const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1) + 'M';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1) + 'K';
    }
    return num.toString();
};

const getBlogDetailUrl = (slug: string): string => {
    return `/blog/${slug}`;
};

export const metadata = {
  title: '日志 - 特恩的日志',
  description: '我随便发点，你也随便看看～',
};

export default async function Blog() {
    let errorMsg = '';
    const blogs = await BlogAPI.list().catch(e => {
        handleAPIError(e, ({ message }) => { errorMsg = message });
        return null;
    });

    return (
        <section className="max-w-120 w-auto mx-auto my-10 flex flex-col gap-8">
            {
                errorMsg && (
                    <Alert variant="destructive" className="w-full">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>出错啦</AlertTitle>
                        <AlertDescription>
                            {errorMsg}
                        </AlertDescription>
                    </Alert>
                )
            }
            {
                blogs && blogs.map((blog) => (
                    <article className="w-full px-5 cursor-default" key={blog.id}>
                        <h2 className="text-2xl font-medium">
                            <a
                                className="hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-400 rounded"
                                href={getBlogDetailUrl(blog.slug)}
                                rel="noopener noreferrer"
                            >
                                {blog.title}
                            </a>
                        </h2>
                        <p className="text-sm font-medium text-zinc-600">{blog.description}</p>
                        <footer className="mt-3 text-sm text-zinc-500 flex items-center gap-2">
                            <time dateTime={blog.createdAt}>
                                {new Date(blog.createdAt).toLocaleString('zh-CN')}
                            </time>
                            <span>·</span>
                            <span>{formatNumber(blog.viewCount)} 次访问</span>
                        </footer>
                    </article>
                ))
            }
        </section>
    )
}