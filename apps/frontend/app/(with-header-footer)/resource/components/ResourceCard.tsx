import { ResourceBadge } from "@/components/resource";
import { Card, CardContent } from "@/components/ui/card";
import { Resource } from "@/lib/types/resource";
import Image from "next/image";
import React from "react";

interface ResourceCardProps extends React.HTMLProps<HTMLAnchorElement> {
    r: Resource;
}

export function ResourceCard({ r, ...props }: ResourceCardProps) {
    const [imageError, setImageError] = React.useState(false);

    return (
        <a href={r.link} target="_blank" {...props}>
            <Card className="w-full md:w-92 lg:w-100 md:rounded-xl rounded-none duration-300">
                <CardContent>
                    <div className="flex gap-6">
                        <div>
                            {!imageError && <Image
                                src={r.imageUrl}
                                alt="资源图片"
                                width={90}
                                height={90}
                                className="rounded-md shadow"
                                priority
                                quality={80}
                                onError={() => setImageError(true)}
                            />}
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