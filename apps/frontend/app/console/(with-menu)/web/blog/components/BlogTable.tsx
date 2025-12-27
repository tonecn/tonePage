import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Blog } from "@/lib/types/blog"
import BlogEdit from "./BlogEdit"
import { Button } from "@/components/ui/button"

interface BlogTableProps {
    blogs: Blog[],
    error?: string,
    onRefresh: () => void,
}

export default function BlogTable({ blogs, error, onRefresh }: BlogTableProps) {
    return (
        <Table className="w-full overflow-x-auto">
            {
                error && (
                    <TableCaption>{error}</TableCaption>
                )
            }
            <TableHeader>
                <TableRow>
                    <TableHead className="w-15">Id</TableHead>
                    <TableHead>标题</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="w-25">文章URL</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {blogs.map((blog) => (
                    <TableRow key={blog.id}>
                        <TableCell className="font-medium">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="max-w-15 overflow-hidden text-ellipsis">{blog.id}</div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{blog.id}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell className="whitespace-normal break-all">{blog.title}</TableCell>
                        <TableCell className="whitespace-normal break-all">{blog.description}</TableCell>
                        <TableCell className="whitespace-normal break-all">{blog.slug}</TableCell>
                        <TableCell>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="max-w-20 overflow-hidden text-ellipsis">{blog.contentUrl}</div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{blog.contentUrl}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell className="text-right">
                            <BlogEdit id={blog.id} onRefresh={() => onRefresh()}>
                                <Button variant={'outline'} size={'sm'}>编辑</Button>
                            </BlogEdit>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}