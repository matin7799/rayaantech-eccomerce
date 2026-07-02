import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * DataTable — Enterprise Admin data grid primitive.
 *
 * Design invariants (from ui-rules.md §6):
 * - NO alternating zebra row backgrounds
 * - Flat bg-surface rows with 1px border-b border-border segmentation
 * - Column headers: uppercase, 12px, font-medium, text-text-secondary
 * - Pagination controls in footer
 */

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  meta?: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "جستجو...",
  meta,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    meta,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Search input */}
      {searchKey && (
        <div className="flex items-center">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(e) => table.getColumn(searchKey)?.setFilterValue(e.target.value)}
            className="h-10 w-full max-w-sm rounded-xl border border-border bg-surface px-4 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors duration-200 focus:border-accent"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              {table.getHeaderGroups()?.map((headerGroup) => (
                <tr key={headerGroup?.id} className="border-b border-border">
                  {headerGroup?.headers?.map((header) => (
                    <th
                      key={header?.id}
                      className="px-4 py-3 text-start text-[12px] font-medium uppercase tracking-wide text-text-secondary"
                    >
                      {header?.isPlaceholder
                        ? null
                        : header?.column?.columnDef?.header && header?.getContext
                          ? flexRender(header.column.columnDef.header, header.getContext())
                          : null}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row?.id}
                    className="border-b border-border bg-surface transition-colors duration-150 last:border-b-0 hover:bg-surface-secondary/40"
                  >
                    {row?.getVisibleCells?.()?.map((cell) => (
                      <td key={cell?.id} className="px-4 py-3 text-sm text-text-primary">
                        {cell?.column?.columnDef?.cell && cell?.getContext
                          ? flexRender(cell.column.columnDef.cell, cell.getContext())
                          : null}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-sm text-text-muted"
                  >
                    داده‌ای یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">
          {table.getFilteredRowModel().rows.length} ردیف
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <span className="text-xs text-text-secondary">
            صفحه {table.getState().pagination.pageIndex + 1} از {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
