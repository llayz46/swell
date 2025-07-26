import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { MetaLink } from '@/types';

interface PaginationProps {
    pagination: {
        links: {
            first: string | undefined;
            last: string | undefined;
            prev: string | undefined;
            next: string | undefined;
        };
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: MetaLink[];
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
    preserveQuery?: string[];
    only?: string[];
}

export function PaginationComponent({ pagination, preserveQuery = [], only }: PaginationProps) {
    const pageLinks = pagination.meta.links.filter(
        (link: MetaLink) =>
            !link.label.toLowerCase().includes("previous") &&
            !link.label.toLowerCase().includes("next")
    );

    const getUrlWithPreservedQuery = (url: string | undefined): string | undefined => {
        if (!url) return url;

        const paramsToKeep = only && only.length > 0 ? only : preserveQuery;

        if (!paramsToKeep || paramsToKeep.length === 0) return url;

        const urlObj = new URL(url);
        const currentUrl = new URL(window.location.href);

        paramsToKeep.forEach(param => {
            const value = currentUrl.searchParams.get(param);
            if (value) {
                urlObj.searchParams.set(param, value);
            }
        });

        return urlObj.toString();
    };

    if(!pagination.links.prev && !pagination.links.next) return

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={getUrlWithPreservedQuery(pagination.links.prev)}
                    />
                </PaginationItem>
                {pageLinks.map((link) => (
                    <PaginationItem key={link.label}>
                        {link.url ? (
                            <PaginationLink
                                href={getUrlWithPreservedQuery(link.url)}
                                isActive={link.active}
                            >
                                {link.label}
                            </PaginationLink>
                        ) : (
                            <PaginationEllipsis />
                        )}
                    </PaginationItem>
                ))}
                <PaginationItem>
                    <PaginationNext
                        href={getUrlWithPreservedQuery(pagination.links.next)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
