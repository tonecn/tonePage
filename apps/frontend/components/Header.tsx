'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
    const router = useRouter();
    const pathname = usePathname();
    const [showMenu, setShowMenu] = useState(false);

    const menuItems = [
        { name: '特恩(TONE)', path: '/' },
        { name: '资源', path: '/resource' },
        { name: '博客', path: '/blog' },
        { name: '控制台', path: '/console' },
    ];

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
        if (path === '/console') {
            e.preventDefault();
            const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
            router.push(token ? '/console' : '/console/login');
            setShowMenu(false);
        } else {
            setShowMenu(false);
        }
    }

    const menuButtonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (!showMenu && menuButtonRef.current) {
            menuButtonRef.current.focus();
        }
    }, [showMenu]);

    return (
        <>
            <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/40 shadow" role="banner" aria-label="网站顶部导航栏">
                <div className="flex items-center justify-between px-10 md:h-18 md:px-20 h-14 duration-300" aria-label="主菜单">
                    <Link
                        href="/"
                        className={cn(
                            "cursor-pointer font-medium text-zinc-500 hover:text-zinc-800 border-b-4 border-transparent duration-200",
                            pathname === "/" && "text-zinc-800"
                        )}
                        aria-current={pathname === "/" ? "page" : undefined}
                    >
                        <span className="sr-only">特恩(TONE)</span>
                        {pathname === "/"
                            ? <span className="text-2xl" aria-hidden="true" >🍭</span>
                            : <span className="md:text-lg" aria-hidden="true">特恩(TONE)</span>}
                    </Link>

                    <nav className={cn(
                        "items-center gap-12 hidden sm:flex",
                    )}>
                        {menuItems.slice(1).map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={cn(
                                    "cursor-pointer md:text-lg font-medium text-zinc-500 hover:text-zinc-800 border-b-4 border-transparent duration-200",
                                    pathname.startsWith(item.path) && "text-zinc-800 border-b-pink-500"
                                )}
                                onClick={e => handleClick(e, item.path)}
                                aria-current={pathname === item.path ? "page" : undefined}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <button
                        ref={menuButtonRef}
                        className="sm:hidden text-zinc-600"
                        onClick={() => setShowMenu(true)}
                        aria-label="打开主菜单"
                    >菜单</button>
                </div>
            </header >

            <Drawer direction="right" open={showMenu} onOpenChange={setShowMenu}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle className="flex justify-between">
                            <span>菜单</span>
                            <button
                                onClick={() => setShowMenu(false)}
                                aria-label="关闭菜单"
                            >
                                <X className="size-5" aria-hidden="true" />
                            </button>
                        </DrawerTitle>
                        <DrawerDescription>请选择需要前往的页面</DrawerDescription>
                    </DrawerHeader>
                    <nav className="w-full flex flex-col px-4 gap-2" aria-label="移动设备主菜单">
                        {menuItems.slice(1).map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                onClick={e => handleClick(e, item.path)}
                                aria-current={pathname === item.path ? "page" : undefined}
                            >
                                <Button className="w-full" size='lg'
                                    variant={pathname.startsWith(item.path) ? 'default' : 'outline'}
                                >{item.name}</Button>
                            </Link>
                        ))}
                    </nav>
                </DrawerContent>
            </Drawer>
        </>
    )
}

