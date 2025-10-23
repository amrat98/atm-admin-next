"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardContent, CardAction, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { useDataTableInstance } from "@/hooks/use-data-table-instance"
import { Download, RefreshCcw, Search, TrendingUp } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/ui/loader"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

import axios from "axios"
import { apiConfig } from "@/config/apiConfig"
import { useUser } from "@/lib/userContext"
import { useRouter } from "next/navigation"
import { exportToExcel } from "@/lib/export-to-excel"
import { recentUsersColumns, columnNames } from "./columns"

type UserExcelRow = {
    _id: string | number;
    userName: string;
    planPrice: number;
    planName: string;
    income: number;
    createdAt?: string | Date | null;
};

export default function Users() {
    const router = useRouter();
    const { token, setToken } = useUser();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    //const [pageSize, setPageSize] = useState(50);
    const [pageSize] = useState(50);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [totalAmount,setTotalAmount] = useState(0);
    const [planName, setPlanName] = useState("");

    // We'll use table.getState().pagination.pageIndex, no need for local pageIndex state

    // Store previous filter values to detect changes
    const prevFiltersRef = useRef({ globalFilter: "", planName: "" });

    const getData = async (opts?: { pageIndex?: number; pageSize?: number; sortKey?: string; sortBy?: 'ASC' | 'DSC'; search?: string; planName?: string }) => {
        if (!token) return;
        setLoading(true);
        try{
            const headers = {
                token: token,
            };
            const response = await axios.get(apiConfig.getSubscription, {
                headers,
                params: {
                    page: (opts?.pageIndex ?? 0) + 1,
                    limit: opts?.pageSize ?? pageSize,
                    sortKey: opts?.sortKey,
                    sortType: opts?.sortBy,
                    search: opts?.search,
                    planName: opts?.planName,
                },
            });
            const meta = response.data?.result?.[0]?.metadata?.[0];
            if (meta) {
                setTotalPages(meta.total_page);
                setTotalRows(meta.total);
            }
            setData(response.data?.result?.[0].data || []);
            setTotalAmount(response.data?.result?.[0].totalAmount?.[0].totalAmount);
        } catch (error: unknown) {
            let errorMessage = "Failed to Fetch Data";
            if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
                errorMessage = error.response.data.responseMessage;
            }
            if(errorMessage === "jwt expired"){
                router.push("/login");
                setToken("");
            }else{
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }

    const table = useDataTableInstance({
        data: data,
        columns: recentUsersColumns,
        getRowId: (row) => row._id.toString(),
        defaultPageSize: pageSize,
        pageCount: totalPages || undefined,
    });

    const handleDownload = async () => {
        try {
            if (!token) return;
            const headers = {token: token};
            const sorting = table.getState().sorting;
            const sort = sorting[0];
            const sortKey = sort?.id as string | undefined;
            const sortBy = sort ? (sort.desc ? "DSC" : "ASC") : undefined;
            const search = table.getState().globalFilter || undefined;

            const limit = totalRows && totalRows > 0 ? totalRows : pageSize;
            const { count } = await exportToExcel<UserExcelRow>({
                url: apiConfig.getSubscription,
                headers,
                params: {
                    page: 1,
                    limit,
                    sortKey,
                    sortType: sortBy,
                    search,
                    planName,
                },
                sheetName: "Users",
                filename: `users_export_${new Date().toISOString().slice(0,10)}`,
                mapRow: (r) => ({
                    "Username": r.userName,
                    "Plan": r.planName,
                    "Plan Amount": r.planPrice,
                    "Income Amount": r.income,
                    "Date": r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
                }),
            });
            if (!count) {
                toast.info("No data to export for current filters");
                return;
            }
            toast.success("Exported to Excel");
        } catch {
            toast.error("Failed to export Excel");
        }
    };

    const handleRefresh = () => {
        // Reset local state
        setTotalPages(0);
        setTotalRows(0);
        setData([]);

        // Reset table sorting (clears sort arrows)
        table.setSorting([]);

        // Reset table pagination UI to first page and default size
        table.setPageIndex(0);
        table.setPageSize(pageSize);

        // Clear global filter
        setPlanName("");
        table.setGlobalFilter("");
    }

    const paginationState = table.getState().pagination;
    const sortingState = table.getState().sorting;
    const globalFilter = table.getState().globalFilter;

    // Reset pagination to the first page on first search change only
    useEffect(() => {
        if (!token) return;

        const prev = prevFiltersRef.current;
        const filterChanged = prev.globalFilter !== globalFilter;

        if (filterChanged && paginationState.pageIndex !== 0) {
            table.setPageIndex(0);
        }

        prevFiltersRef.current = {
            globalFilter,
            planName: "", // no planName here, since no second filter
        }
        // Note: Notice we don't fetch data inside here to avoid double fetching
    }, [globalFilter, paginationState.pageIndex, token, table, planName]);

    // Fetch the data whenever sorting, pagination or global filter changes
    useEffect(() => {
        if (!token) return;
        const sort = sortingState[0];
        const sortKey = sort?.id as string | undefined;
        const sortBy = sort ? (sort.desc ? 'DSC' : 'ASC') : undefined;

        getData({
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
            sortKey,
            sortBy,
            search: globalFilter || undefined,
            planName: planName || undefined,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationState.pageIndex, paginationState.pageSize, sortingState, globalFilter, token, planName]);

    return (
      <div className="flex flex-col gap-4 md:gap-6">
        <div>
          <h1 className="text-xl font-semibold">Investment History</h1>
          <p className="text-muted-foreground text-sm">Track all investment plans and their performance</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="hover:shadow-md transition-shadow gap-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Investment Amount (Lifetime)</CardTitle>
                <TrendingUp size="24" className="text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {totalAmount.toLocaleString()} ATMC
                </div>
                <p className="text-xs text-muted-foreground">
                  User Plan Investment
                </p>
              </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
          <Card>
            <CardHeader>
            <div className="flex gap-2 flex-wrap">
                <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Filter table..."
                    value={table.getState().globalFilter ?? ""}
                    onChange={e => table.setGlobalFilter(e.target.value)}
                    className="text-sm h-10 pl-10"
                    />
                </div>
                <Select value={planName ?? ""} onValueChange={e => {setPlanName(e); table.setPageIndex(0);}}>
                    <SelectTrigger className="w-full h-10! md:max-w-40 text-sm">
                        <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                    {["Starter", "Standard", "Premium", "Elite", "Exclusive"].map((p) => (
                        <SelectItem key={p} value={p}>
                        {p} Plan
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>
              <CardAction>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCcw />
                  </Button>
                  <DataTableViewOptions table={table} columns={columnNames} />
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download />
                    <span className="hidden lg:inline">Export</span>
                  </Button>
                </div>
              </CardAction>
            </CardHeader>

            <CardContent className="flex size-full flex-col gap-4">
              <DataTablePagination table={table} totalPagesCount={totalPages} />
              <div className="overflow-hidden rounded-md border">
                {loading ? (
                  <div className="space-y-4">
                    <TableSkeleton rows={8} />
                  </div>
                ) : (
                  <DataTable table={table} columns={recentUsersColumns} />
                )}
              </div>
              <DataTablePagination table={table} totalPagesCount={totalPages} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
}
