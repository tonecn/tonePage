import {
    Card,
    CardContent,
} from "@/components/ui/card";


export default function Resources() {
    return (
        <div className="flex-1 flex flex-col items-center">
            <h1 className="mt-6 md:mt-20 text-2xl md:text-5xl font-medium text-zinc-600 text-center duration-300">精心挑选并收藏的资源</h1>
            <p className="mt-4 md:mt-8 mx-3 text-zinc-400 text-sm text-center duration-300">请在浏览此部分内容前阅读并同意
                <a className="text-zinc-600">《使用条款和隐私政策》</a>
                ，继续使用或浏览表示您接受协议条款。</p>

            <div className="mt-6 sm:mt-10 md:mt-15 w-full flex flex-col md:w-auto md:mx-auto md:grid grid-cols-2 2xl:gap-x-35 lg:gap-x-20 gap-x-10 lg:gap-y-10 gap-y-5 sm:mb-10 duration-300">
                {
                    [0, 1, 2, 3, 4, 5].map((item) => (
                        <a href="" target="_blank">
                            <Card className="w-full md:w-92 lg:w-100 md:rounded-xl rounded-none duration-300">
                                <CardContent>
                                    <div className="flex gap-6">
                                        <img className="size-20 shadow rounded-md" src="https://chromiumdash.appspot.com/releases?platform=Windows" />
                                        <div className="flex-1 overflow-x-hidden">
                                            <div className="font-bold text-2xl">Title 666 66 666 66 </div>
                                            <div className="font-medium text-sm text-zinc-400">你好这是一段随机文本，你好这是一段随机文本，你好这是一段随机文本，</div>
                                            <div className="flex gap-2 flex-wrap mt-2">
                                                <div className="text-[10px] text-zinc-500 font-medium py-[1px] px-1.5 rounded-full bg-zinc-200">第三方来源</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
                    ))
                }
            </div>
        </div>
    )
}