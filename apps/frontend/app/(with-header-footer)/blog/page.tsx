import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { api, safeCall } from "@/lib/api";

import { BlogList } from "./components/BlogList";

export const metadata = {
    title: '日志 - 特恩的日志',
    description: '我随便发点，你也随便看看～',
};

export default async function Blog() {
    // Initial fetch for the first page
    const { data, error } = await safeCall(() => api.blog.getPublicList(1, 10));

    return (
        <section className="max-w-xl w-full mx-auto my-10 flex flex-col gap-8 px-4">
            {
                error && (
                    <Alert variant="destructive" className="w-full">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>出错啦</AlertTitle>
                        <AlertDescription>
                            {error.message}
                        </AlertDescription>
                    </Alert>
                )
            }
            {
                data && <BlogList initialData={data} />
            }
        </section>
    )
}