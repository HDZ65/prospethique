import Link from 'next/link';
import { footerConfig } from "@/data/footer";
import { Separator } from "@components/separator";

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-background border-t" role="contentinfo">
            <div className="container py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {footerConfig.sections.map((section, index) => (
                        <div key={index} className="space-y-3">
                            <h3 className="font-semibold">
                                {section.title}
                            </h3>
                            {section.isMain ? (
                                <p className="text-sm text-muted-foreground">
                                    {section.content}
                                </p>
                            ) : section.links ? (
                                <ul className="space-y-2">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    {section.content}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <Separator className="my-8" />

                <div className="text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {currentYear} ProspEthique. {footerConfig.copyright.text}
                    </p>
                </div>
            </div>
        </footer>
    );
}; 