export const PAGE_SIZE = 20;

export function parsePageParam(page?: string): number {
  const n = parseInt(page ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function getPagination(page: number, totalCount: number) {
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const skip = (currentPage - 1) * PAGE_SIZE;
  return { currentPage, totalPages, skip, take: PAGE_SIZE, totalCount };
}

export function buildPageSearchParams(
  params: Record<string, string | undefined>,
  page: number
): string {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (key === "page" || !value) continue;
    qs.set(key, value);
  }
  if (page > 1) qs.set("page", String(page));
  const str = qs.toString();
  return str ? `?${str}` : "";
}
