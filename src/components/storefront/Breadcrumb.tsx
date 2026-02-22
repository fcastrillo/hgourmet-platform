import Link from "next/link";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted">
            <ol className="flex flex-wrap items-center gap-1">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    return (
                        <li key={index} className="flex items-center gap-1">
                            {index > 0 && (
                                <span className="select-none text-muted/60" aria-hidden="true">
                                    /
                                </span>
                            )}
                            {isLast || !item.href ? (
                                <span
                                    className="font-medium text-text"
                                    aria-current={isLast ? "page" : undefined}
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="transition-colors hover:text-primary"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
