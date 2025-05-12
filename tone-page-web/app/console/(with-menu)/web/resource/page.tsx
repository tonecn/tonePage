"use client";

import { useResourceList } from "@/hooks/admin/web/resource/use-resource-list"
import ResourceTable from "./components/ResourceTable"
import { Button } from "@/components/ui/button";
import AddResource from "./components/AddResource";

export default function Page() {
    const { resources, error, isLoading, mutate, refresh } = useResourceList();

    return (
        <>
            <div>
                <AddResource refresh={refresh}>
                    <Button>添加资源</Button>
                </AddResource>
            </div>
            <ResourceTable
                resources={resources || []}
                onRefresh={refresh}
            />
        </>
    )
}