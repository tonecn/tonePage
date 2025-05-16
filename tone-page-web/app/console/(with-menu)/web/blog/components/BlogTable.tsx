import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Blog } from "@/lib/types/blog"

interface BlogTableProps {
    blogs: Blog[],
    error?: string,
    onRefresh?: () => void,
}

export default function BlogTable({ blogs, error, onRefresh }: BlogTableProps) {
    return (
        <Table>
            {
                error && (
                    <TableCaption>{error}</TableCaption>
                )
            }
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Id</TableHead>
                    <TableHead>标题</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>文章URL</TableHead>
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
                                        <div className="max-w-[100px] overflow-hidden text-ellipsis">{blog.id}</div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{blog.id}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell>{blog.title}</TableCell>
                        <TableCell>{blog.description}</TableCell>
                        <TableCell>{blog.contentUrl}</TableCell>
                        <TableCell className="text-right">
                            {/* <ResourceEdit id={resource.id} onRefresh={() => onRefresh()}>
                                <Button variant={'outline'} size={'sm'}>编辑</Button>
                            </ResourceEdit> */}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}