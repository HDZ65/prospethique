import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import SignOutButton from '@/components/auth-buttons/signout';
import { auth } from '@/libs/auth/next-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { navigationConfig } from "@/data/navigation";

export const Header = async () => {
    const session = await auth();
    const isAuthenticated = !!session?.user;
    const { authenticatedMenuItems, publicMenuItems, branding } = navigationConfig;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
                <div className="flex items-center gap-8 flex-1">
                    {/* Logo */}
                    <Link
                        href={isAuthenticated ? branding.logo.authenticatedHref : branding.logo.publicHref}
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
                    <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Menu principal">
                        {(isAuthenticated ? authenticatedMenuItems : publicMenuItems).map((item) => (
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
                    {isAuthenticated ? (
                        <>
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Rechercher..."
                                    className="w-64 pl-10"
                                    aria-label="Barre de recherche"
                                />
                            </div>
                            <ThemeToggle />
                            <SignOutButton />
                        </>
                    ) : (
                        <div className="hidden md:flex items-center gap-4">
                            <ThemeToggle />
                            <Button variant="ghost" asChild>
                                <Link href="/auth/sign-in">Se connecter</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/auth/sign-up">Commencer gratuitement</Link>
                            </Button>
                        </div>
                    )}

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
                                {(isAuthenticated ? authenticatedMenuItems : publicMenuItems).map((item) => (
                                    <Button key={item.href} variant="ghost" asChild className="justify-start">
                                        <Link href={item.href}>
                                            {item.icon && <span className="mr-2">{item.icon}</span>}
                                            {item.label}
                                        </Link>
                                    </Button>
                                ))}
                                {!isAuthenticated && (
                                    <div className="flex flex-col gap-2 mt-4">
                                        <Button variant="outline" asChild>
                                            <Link href="/auth/sign-in">Se connecter</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href="/auth/sign-up">Commencer gratuitement</Link>
                                        </Button>
                                    </div>
                                )}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};