'use client';

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const menuItems = [
        { name: '特恩(TONE)', href: '/' },
        { name: '资源', href: '/resource' },
        { name: '博客', href: '/blog' },
        { name: '账户', href: '/account' },
    ]

    return (
        <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/40 shadow">
            <div className="flex items-center justify-between px-10 md:h-18 md:px-20 h-14 duration-300">
                <Link
                    href="/"
                    className={cn(
                        "cursor-pointer text-lg font-medium text-zinc-500 hover:text-zinc-800 border-b-4 border-transparent duration-200",
                        pathname === "/" && "text-zinc-800"
                    )}
                >
                    {pathname === "/"
                        ? <div className="text-2xl"> 🍭</div>
                        : <div> 特恩(TONE)</div>}
                </Link>

                <div className="flex items-center gap-12">
                    {menuItems.slice(1).map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "cursor-pointer text-lg font-medium text-zinc-500 hover:text-zinc-800 border-b-4 border-transparent duration-200",
                                pathname === item.href && "text-zinc-800 border-b-pink-500"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>
        </header>
    )
}

