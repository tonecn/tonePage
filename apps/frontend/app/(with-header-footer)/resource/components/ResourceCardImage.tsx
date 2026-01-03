'use client';
import React from "react";
import Image from "next/image";

interface ResourceCardImage {
    imageUrl: string;
}

export default function ResourceCardImage({ imageUrl }: ResourceCardImage) {
    const [imageError, setImageError] = React.useState(false);

    return (
        <>
            {!imageError && <Image
                src={imageUrl}
                alt="资源图片"
                width={90}
                height={90}
                className="rounded-md shadow w-22.5 h-22.5"
                priority
                quality={75}
                onError={() => setImageError(true)}
            />}
        </>
    )
}