import { ResourceCard } from "./components/ResourceCard";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import { ResourceAPI } from "@/lib/api/server";
import { AlertCircle } from "lucide-react";

export default async function Resources() {
    let errorMsg = '';
    const data = await ResourceAPI.list().catch(e => { errorMsg = `${e}`; return null; });

    return (
        <div className="flex-1 flex flex-col items-center">
            <h1 className="mt-6 md:mt-20 text-2xl md:text-5xl font-medium text-zinc-800 text-center duration-300">精心挑选并收藏的资源</h1>
            <p className="mt-4 md:mt-8 mx-3 text-zinc-400 text-sm text-center duration-300">请在浏览此部分内容前阅读并同意
                <a className="text-zinc-600">《使用条款和隐私政策》</a>
                ，继续使用或浏览表示您接受协议条款。</p>
            {
                errorMsg && (
                    <div className="mt-10 mx-5">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>出错了</AlertTitle>
                            <AlertDescription>
                                {errorMsg}
                            </AlertDescription>
                        </Alert>
                    </div>
                )
            }

            <div className="mt-6 sm:mt-10 md:mt-15 w-full flex flex-col md:w-auto md:mx-auto md:grid grid-cols-2 2xl:gap-x-35 lg:gap-x-20 gap-x-10 lg:gap-y-10 gap-y-5 sm:mb-10 duration-300">
                {data && data.map((resource) => (
                    <ResourceCard
                        key={resource.id}
                        r={resource}
                    />
                ))}
            </div>
        </div>
    )
}