import { ResourceBadge } from "@/components/resource";
import { Card, CardContent } from "@/components/ui/card";
import { PublicResource } from "@/lib/types/resource";
import ResourceCardImage from "./ResourceCardImage";

interface ResourceCardProps extends React.HTMLProps<HTMLAnchorElement> {
    r: PublicResource;
}

export function ResourceCard({ r, ...props }: ResourceCardProps) {
    return (
        <a href={r.link} target="_blank" {...props}>
            <Card className="w-full md:w-92 lg:w-100 md:rounded-xl rounded-none duration-300">
                <CardContent>
                    <div className="flex gap-6">
                        <div>
                            <ResourceCardImage imageUrl={r.imageUrl} />
                        </div>
                        <div className="flex-1 overflow-x-hidden">
                            <div className="font-bold text-2xl">{r.title}</div>
                            <div className="font-medium text-sm text-zinc-400 mt-1">{r.description}</div>
                            <div className="flex gap-2 flex-wrap mt-4">
                                {
                                    r.tags.map((tag) => (
                                        <ResourceBadge key={tag.name} tag={tag} />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </a>
    )
}