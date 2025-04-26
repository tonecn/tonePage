import { useCallback } from "react"

export default function Blog() {
    const formatNumber = useCallback((num: number) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        } else if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        return num.toString();
    }, []);

    return (
        <div className="max-w-120 w-auto mx-auto my-10 flex flex-col gap-8">
            {
                Array.from({ length: 10 }).map(() => (
                    <div className="w-full px-5 cursor-default" key={Math.random()}>
                        <a className="text-2xl font-medium cursor-pointer" target="_black">标题标题标题标题标题标题</a>
                        <p className="text-sm font-medium text-zinc-400">描述描asdjkasdas 就叫你健康你健康呢即可述描述描述描述描述描述描述描述描述，描述描述</p>
                        <p className="text-sm font-medium text-zinc-400 mt-3">{new Date().toLocaleString()} · {formatNumber(1090)} 次访问</p>
                    </div>
                ))
            }
        </div>
    )
}