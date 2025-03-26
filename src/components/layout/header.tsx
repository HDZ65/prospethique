import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { navigationConfig } from "@/data/navigation";

export const Header = async () => {
    const { publicMenuItems, branding } = navigationConfig;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="flex items-center gap-10 flex-1">
                    {/* Logo */}
                    <Link
                        href={branding.logo.publicHref}
                        className="flex items-center gap-3"
                    >
                        <div className="rounded-lg bg-primary/10 p-2 hover:scale-105 transition-transform duration-150">
                            {branding.logo.icon}
                        </div>
                        <span className="text-lg font-medium">
                            {branding.name}
                        </span>
                    </Link>

                    {/* Navigation Desktop */}
                    <nav className="hidden md:flex items-center gap-3" role="navigation" aria-label="Menu principal">
                        {publicMenuItems.map((item) => (
                            <Button key={item.href} variant="ghost" asChild>
                                <Link href={item.href}>
                                    {item.icon && <span className="mr-2">{item.icon}</span>}
                                    {item.label}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        <Button variant="ghost" asChild>
                            <Link href="/auth/sign-in">Se connecter</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/auth/register">Commencer gratuitement</Link>
                        </Button>
                    </div>

                    {/* Menu Mobile */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent>
                            <nav className="flex flex-col gap-4">
                                {publicMenuItems.map((item) => (
                                    <Button key={item.href} variant="ghost" asChild className="justify-start">
                                        <Link href={item.href}>
                                            {item.icon && <span className="mr-2">{item.icon}</span>}
                                            {item.label}
                                        </Link>
                                    </Button>
                                ))}
                                <div className="flex flex-col gap-2 mt-4">
                                    <Button variant="outline" asChild>
                                        <Link href="/auth/sign-in">Se connecter</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href="/auth/register">Commencer gratuitement</Link>
                                    </Button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};