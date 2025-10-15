"use client"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardContent, CardAction } from "@/components/ui/card"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { useDataTableInstance } from "@/hooks/use-data-table-instance"
import { Download, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/ui/loader"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import axios from "axios"
import { apiConfig } from "@/config/apiConfig"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/userContext"
import { exportToExcel } from "@/lib/export-to-excel"
import { recentUsersColumns, columnNames } from "./columns"

import { usePlans } from "./planAction"
import { useMemo } from "react"

type UserExcelRow = {
    _id: string | number;
    nickName: string;
    invitationCode: string;
    walletAddress: string;
    planPrice: number;
    fundWallet: number;
    incomeBalance: number;
    poolWallet: number;
    airDropCoin: number;
    createdAt?: string | Date | null;
    activationDate?: string | Date | null;
    isBlocked?: boolean;
};

export default function Users() {
    const router = useRouter();
    const { token, setToken } = useUser();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [pageIndex, setPageIndex] = useState(0); // zero-based page index
    const [pageSize, setPageSize] = useState(50);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);

    const { plans } = usePlans();

    const columns = useMemo(() => recentUsersColumns({ plans}), [plans]);

    const getData = async (opts?: { pageIndex?: number; pageSize?: number; sortKey?: string; sortBy?: 'ASC' | 'DSC'; search?: string }) => {
        if (!token) return;
        setLoading(true);
        try{
            const headers = {
                token: token,
              };
            const response = await axios.get(apiConfig.getUsers, {
                headers,
                params: {
                    page: (opts?.pageIndex ?? pageIndex) + 1,
                    limit: opts?.pageSize ?? pageSize,
                    sortKey: opts?.sortKey,
                    sortType: opts?.sortBy,
                    search: opts?.search,
                },
            });
            //const successMessage = response.data?.responseMessage || "Data Fetch Successful";
            const meta = response.data?.result?.metadata?.[0];
            if (meta) {
                setTotalPages(meta.total_page);
                setTotalRows(meta.total);
            }
            setData(response.data?.result?.data || [])
            //console.log(pageIndex,pageSize,totalPages,totalRows )
            //toast.success(successMessage)
        } catch (error: unknown) {
            let errorMessage = "Failed to Fetch Data"
            if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
                errorMessage = error.response.data.responseMessage;
            }
            toast.error(errorMessage);
            if(errorMessage === "jwt expired"){
                setToken("");
                router.push("/login");
            }
        } finally {
            setLoading(false);
        }
    }

    // useEffect(() => {
    //     if (!token) return;
    //     getData();
    // }, [token]);

    // moved below to access table instance for resetting sort

    const table = useDataTableInstance({
        data: data,
        columns: columns,
        getRowId: (row) => row._id.toString(),
        defaultPageIndex: pageIndex,
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
                url: apiConfig.getUsers,
                headers,
                params: {
                    page: 1,
                    limit,
                    sortKey,
                    sortType: sortBy,
                    search,
                },
                sheetName: "Users",
                filename: `users_export_${new Date().toISOString().slice(0,10)}`,
                mapRow: (r) => ({
                    Username: r.nickName,
                    "Sponsor ID": r.invitationCode,
                    "Wallet Address": r.walletAddress,
                    "Plan Amount": r.planPrice,
                    "Fund Wallet": r.fundWallet,
                    "Income Wallet": r.incomeBalance,
                    "Pool Wallet": r.poolWallet,
                    "Airdrop Wallet": r.airDropCoin,
                    "Registration Date": r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
                    "Activation Date": r.activationDate ? new Date(r.activationDate).toLocaleString() : "Not Activated",
                    "Blocked": r.isBlocked ? "Yes" : "No",
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
        setPageIndex(0);
        setPageSize(50);
        setTotalPages(0);
        setTotalRows(0);
        setData([]);

        // Reset table sorting (clears sort arrows)
        table.setSorting([]);

        // Reset table pagination UI to first page and default size
        table.setPageIndex(0);
        table.setPageSize(50);

        // Clear global filter
        table.setGlobalFilter("");

        // Fetch fresh data
        //getData({ pageIndex: 0, pageSize: 50 });
    }

    // Trigger fetch when pagination, sorting, or global filter changes
    const paginationState = table.getState().pagination;
    const sortingState = table.getState().sorting;
    const globalFilter = table.getState().globalFilter;

    // Handle search changes - reset to page 1
    useEffect(() => {
        if (!token) return;
        // When search/filter changes, reset to first page
        if (globalFilter && paginationState.pageIndex !== 0) {
            table.setPageIndex(0);
            return;
        }
        const sort = sortingState[0];
        const sortKey = sort?.id as string | undefined;
        const sortBy = sort ? (sort.desc ? 'DSC' : 'ASC') : undefined;
        getData({
            pageIndex: paginationState.pageIndex,
            pageSize: paginationState.pageSize,
            sortKey,
            sortBy,
            search: globalFilter || undefined,
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationState.pageIndex, paginationState.pageSize, sortingState, globalFilter, token]);

  return (
    <div className="flex flex-col gap-4 md:gap-6">
        <div>
            <h1 className="text-xl font-semibold">Users Management</h1>
            <p className="text-muted-foreground text-sm">Manage user accounts, wallets, and access controls</p>
        </div>
        <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
            <Card>
                <CardHeader>
                {/* <CardTitle>Search</CardTitle>
                <CardDescription>Track and manage your latest leads and their status.</CardDescription> */}
                <Input
                    placeholder="Filter table..."
                    value={table.getState().globalFilter ?? ""}
                    onChange={e => table.setGlobalFilter(e.target.value)}
                    className="max-w-sm text-sm h-10"
                    />

                <CardAction>
                    <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                        <RefreshCcw />
                        {/* <span className="hidden lg:inline">Refresh</span> */}
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
                ): (
                    <DataTable table={table} columns={columns} />
                )}
                </div>
                <DataTablePagination table={table} totalPagesCount={totalPages} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
