import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
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
        (link: MetaLink) => !link.label.toLowerCase().includes('previous') && !link.label.toLowerCase().includes('next'),
    );

    const getUrlWithPreservedQuery = (url: string | undefined): string | undefined => {
        if (!url) return url;

        const paramsToKeep = only && only.length > 0 ? only : preserveQuery;

        if (!paramsToKeep || paramsToKeep.length === 0) return url;

        const urlObj = new URL(url);
        const currentUrl = new URL(window.location.href);

        paramsToKeep.forEach((param) => {
            const value = currentUrl.searchParams.get(param);
            if (value) {
                urlObj.searchParams.set(param, value);
            }
        });

        return urlObj.toString();
    };

    const getVisiblePages = () => {
        const currentPage = pagination.meta.current_page;
        const lastPage = pagination.meta.last_page;
        const delta = 1;

        if (lastPage <= 7) {
            return pageLinks;
        }

        const visiblePages: (MetaLink | 'ellipsis-start' | 'ellipsis-end')[] = [];

        visiblePages.push(pageLinks[0]);

        const rangeStart = Math.max(2, currentPage - delta);
        const rangeEnd = Math.min(lastPage - 1, currentPage + delta);

        if (rangeStart > 2) {
            visiblePages.push('ellipsis-start');
        }

        for (let i = rangeStart; i <= rangeEnd; i++) {
            visiblePages.push(pageLinks[i - 1]);
        }

        if (rangeEnd < lastPage - 1) {
            visiblePages.push('ellipsis-end');
        }

        visiblePages.push(pageLinks[lastPage - 1]);

        return visiblePages;
    };

    if (!pagination.links.prev && !pagination.links.next) return;

    const visiblePages = getVisiblePages();

    return (
        <Pagination>
            <PaginationContent className="max-sm:w-full max-sm:justify-between">
                <PaginationItem>
                    <PaginationPrevious href={getUrlWithPreservedQuery(pagination.links.prev)} />
                </PaginationItem>
                {visiblePages.map((item, index) => {
                    if (item === 'ellipsis-start' || item === 'ellipsis-end') {
                        return (
                            <PaginationItem key={`ellipsis-${index}`} className="max-[350px]:hidden">
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }
                    const link = item as MetaLink;
                    return (
                        <PaginationItem key={link.label} className="max-[350px]:hidden">
                            <PaginationLink href={getUrlWithPreservedQuery(link.url)} isActive={link.active}>
                                {link.label}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}
                <PaginationItem>
                    <PaginationNext href={getUrlWithPreservedQuery(pagination.links.next)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
