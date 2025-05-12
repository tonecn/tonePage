'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";


export default function Header() {
    const pathname = usePathname();
    const [showMenu, setShowMenu] = useState(false);

    const menuItems = [
        { name: '特恩(TONE)', path: '/' },
        { name: '资源', path: '/resource' },
        { name: '博客', path: '/blog' },
        { name: '控制台', path: '/console' },
    ];

    const getHref = useCallback((path: string) => {
        if (path === '/console') {
            return localStorage.getItem('token') ? '/console' : '/console/login';
        }
        return path;
    }, []);

    return (
        <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/40 shadow">
            <div className="flex items-center justify-between px-10 md:h-18 md:px-20 h-14 duration-300">
                <Link
                    href="/"
                    className={cn(
                        "cursor-pointer font-medium text-zinc-500 hover:text-zinc-800 border-b-4 border-transparent duration-200",
                        pathname === "/" && "text-zinc-800"
                    )}
                >
                    {pathname === "/"
                        ? <div className="text-2xl"> 🍭</div>
                        : <div className="md:text-lg">特恩(TONE)</div>}
                </Link>


                <Drawer direction="right" open={showMenu} onOpenChange={(state) => !state && setShowMenu(false)}>
                    <DrawerTrigger>
                        <div className="sm:hidden cursor-pointer text-zinc-600" onClick={() => setShowMenu(true)}>
                            菜单
                        </div>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle className="flex justify-between">
                                <span>菜单</span>
                                <X className="cursor-pointer" onClick={() => setShowMenu(false)} />
                            </DrawerTitle>
                            <DrawerDescription>请选择需要前往的页面</DrawerDescription>
                        </DrawerHeader>
                        <div className="w-full flex flex-col px-4 gap-2">
                            {menuItems.slice(1).map((item) => (
                                <Link
                                    key={item.name}
                                    href={getHref(item.path)}
                                    onClick={() => setShowMenu(false)}
                                >
                                    <Button className="w-full" size='lg'
                                        variant={pathname.startsWith(item.path) ? 'default' : 'outline'}
                                    >{item.name}</Button>
                                </Link>
                            ))}
                        </div>
                    </DrawerContent>
                </Drawer>

                <div className={cn(
                    "sm:flex items-center gap-12 hidden",
                )}>
                    {menuItems.slice(1).map((item) => (
                        <Link
                            key={item.name}
                            href={getHref(item.path)}
                            className={cn(
                                "cursor-pointer md:text-lg font-medium text-zinc-500 hover:text-zinc-800 border-b-4 border-transparent duration-200",
                                pathname.startsWith(item.path) && "text-zinc-800 border-b-pink-500"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </header >
    )
}

