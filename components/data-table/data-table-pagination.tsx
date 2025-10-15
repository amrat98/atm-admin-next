import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { ChevronRight, ChevronLeft, Ellipsis, ChevronsLeft, ChevronsRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalPagesCount?: number;
}

const DOTS = "...";

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => i + start);
}

export function DataTablePagination<TData>({ table, totalPagesCount }: DataTablePaginationProps<TData>) {
  const [gotoInputVisible, setGotoInputVisible] = useState(false);
  const [gotoPage, setGotoPage] = useState("");

  const totalPages = totalPagesCount ?? table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const siblings = 1; // Number of page buttons to show on each side of current page
  const totalPageButtons = siblings * 2 + 5; // first, last, current, 2*ellipsis, siblings

  let paginationRange: (number | string)[] = [];

  if (totalPages <= totalPageButtons) {
    paginationRange = range(1, totalPages);
  } else {
    const leftSiblingIndex = Math.max(currentPage - siblings, 1);
    const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    if (!showLeftDots && showRightDots) {
      paginationRange = [...range(1, 1 + siblings * 2), DOTS, totalPages];
    } else if (showLeftDots && !showRightDots) {
      paginationRange = [1, DOTS, ...range(totalPages - (1 + siblings * 2) + 1, totalPages)];
    } else if (showLeftDots && showRightDots) {
      paginationRange = [1, DOTS, ...range(leftSiblingIndex, rightSiblingIndex), DOTS, totalPages];
    }
  }

  const submitGotoPage = () => {
    const pageNum = Math.min(Math.max(Number(gotoPage), 1), totalPages);
    table.setPageIndex(pageNum - 1);
    setGotoInputVisible(false);
    setGotoPage("");
  };

  return (
    <div className="flex items-center justify-end lg:px-4 flex-wrap">
      {/* <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div> */}
      <div className="flex w-full items-center justify-end gap-4 lg:w-fit flex-wrap">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10,25,50,100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <nav className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="sm:hidden"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to first page"
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Go to previous page"
          >
            <ChevronLeft />
          </Button>

          <Popover>
            <PopoverTrigger asChild className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                className="h-9"
                //onClick={() => setGotoInputVisible(true)}
                //disabled={!table.getCanPreviousPage()}
                aria-label="Goto page"
              >
                Goto page
                {/* <Ellipsis /> */}
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-auto min-w-50">
              <span className="text-xs font-semibold text-muted-foreground">Goto page</span>
            <div className="flex items-center space-x-2 mt-2">
              <Input id="number" type="number" placeholder="no.."
                  value={gotoPage}
                  className="h-9 text-sm"
                  onChange={(e) => setGotoPage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitGotoPage()}
                  min={1}
                  max={totalPages}
                  aria-label="Goto page number"
                  autoFocus
              />
                <Button size="sm" onClick={submitGotoPage} disabled={!gotoPage}>
                  Go
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {paginationRange.map((pageNum, index) =>
            pageNum === DOTS ? (
              <Popover key={index}>
                <PopoverTrigger asChild className="hidden sm:inline-flex">
                  <Button
                    variant="outline"
                    size="sm"
                    //onClick={() => setGotoInputVisible(true)}
                    //disabled={!table.getCanPreviousPage()}
                    aria-label="Goto page"
                  >
                    <Ellipsis />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" className="w-auto min-w-50">
                  <span className="text-xs font-semibold text-muted-foreground">Goto page</span>
                <div className="flex items-center space-x-2 mt-2">
                  <Input id="number" type="number" placeholder="no.."
                      value={gotoPage}
                      className="h-9 text-sm"
                      onChange={(e) => setGotoPage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitGotoPage()}
                      min={1}
                      max={totalPages}
                      aria-label="Goto page number"
                      autoFocus
                  />
                    <Button size="sm" onClick={submitGotoPage} disabled={!gotoPage}>
                      Go
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button
                key={index}
                variant={pageNum === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => table.setPageIndex(Number(pageNum) - 1)}
                aria-current={pageNum === currentPage ? "page" : undefined}
                className="hidden sm:inline-flex"
              >
                {pageNum}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Go to next page"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="sm:hidden"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Go to last page"
          >
            <ChevronsRight />
          </Button>
        </nav>
        <div className="flex w-fit items-center justify-center text-sm font-medium text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
      </div>
    </div>
  );
}
