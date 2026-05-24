import {
  buildPageSearchParams,
  PAGE_SIZE,
} from "@/lib/pagination";
import Link from "next/link";

type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
};

export default function TablePagination({
  currentPage,
  totalPages,
  totalCount,
  basePath,
  searchParams,
}: TablePaginationProps) {
  if (totalCount === 0) return null;

  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end = Math.min(currentPage * PAGE_SIZE, totalCount);
  const href = (page: number) =>
    `${basePath}${buildPageSearchParams(searchParams, page)}`;
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav className="mrmsPagination" aria-label="Table pagination">
      <p className="mrmsPaginationSummary">
        Showing <strong>{start}–{end}</strong> of <strong>{totalCount}</strong>
      </p>
      <div className="mrmsPaginationNav" role="group" aria-label="Page navigation">
        {canGoPrev ? (
          <Link href={href(currentPage - 1)} className="mrmsPaginationBtn">
            <span className="mrmsPaginationIcon" aria-hidden="true">
              ‹
            </span>
            Previous
          </Link>
        ) : (
          <span className="mrmsPaginationBtn is-disabled" aria-disabled="true">
            <span className="mrmsPaginationIcon" aria-hidden="true">
              ‹
            </span>
            Previous
          </span>
        )}
        <span className="mrmsPaginationStatus">
          Page {currentPage} of {totalPages}
        </span>
        {canGoNext ? (
          <Link href={href(currentPage + 1)} className="mrmsPaginationBtn">
            Next
            <span className="mrmsPaginationIcon" aria-hidden="true">
              ›
            </span>
          </Link>
        ) : (
          <span className="mrmsPaginationBtn is-disabled" aria-disabled="true">
            Next
            <span className="mrmsPaginationIcon" aria-hidden="true">
              ›
            </span>
          </span>
        )}
      </div>
    </nav>
  );
}
