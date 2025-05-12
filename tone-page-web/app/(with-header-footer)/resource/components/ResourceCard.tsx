import { ResourceBadge } from "@/components/resource";
import { Card, CardContent } from "@/components/ui/card";
import { Resource } from "@/lib/types/resource";
import Image from "next/image";

interface ResourceCardProps {
    resource: Resource;
    key: string;
}

export function ResourceCard({ resource, key }: ResourceCardProps) {
    return (
        <a href={resource.link} target="_blank" key={key}>
            <Card className="w-full md:w-92 lg:w-100 md:rounded-xl rounded-none duration-300">
                <CardContent>
                    <div className="flex gap-6">
                        <div>
                            <Image
                                src={resource.imageUrl}
                                alt="资源图片"
                                width={90}
                                height={90}
                                className="rounded-md shadow"
                                priority
                                quality={100}
                            />
                        </div>
                        <div className="flex-1 overflow-x-hidden">
                            <div className="font-bold text-2xl">{resource.title}</div>
                            <div className="font-medium text-sm text-zinc-400 mt-1">{resource.description}</div>
                            <div className="flex gap-2 flex-wrap mt-4">
                                {
                                    resource.tags.map((tag) => (
                                        <ResourceBadge tag={tag} />
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