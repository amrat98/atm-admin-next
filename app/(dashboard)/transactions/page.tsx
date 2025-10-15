"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardHeader, CardContent, CardAction } from "@/components/ui/card"
import { DataTable } from "@/components/data-table/data-table"
import { DataTablePagination } from "@/components/data-table/data-table-pagination"
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options"
import { useDataTableInstance } from "@/hooks/use-data-table-instance"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Download, RefreshCcw, Search } from "lucide-react"
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
    transacionType: string;
    amount: number;
    senderNickName: string;
    receiverNickName: string;
    formWalletAddress: string;
    toWalletAddress: string;
    remark: string;
    createdAt?: string | Date | null;
};

export default function Transaction() {
    const router = useRouter();
    const { token, setToken } = useUser();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const [pageIndex, setPageIndex] = useState(0); // zero-based page index
    const [pageSize, setPageSize] = useState(50);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const [transacionType, setTransacionType] = useState("");

    // Store previous filter values to detect changes
    const prevFiltersRef = useRef({ globalFilter: "", transacionType: "" });

    const getData = async (opts?: { pageIndex?: number; pageSize?: number; sortKey?: string; sortBy?: 'ASC' | 'DSC'; search?: string; transacionType?: string }) => {
        if (!token) return;
        setLoading(true);
        try{
            const headers = {
                token: token,
              };
            const response = await axios.get(apiConfig.transactionList, {
                headers,
                params: {
                    page: (opts?.pageIndex ?? pageIndex) + 1,
                    limit: opts?.pageSize ?? pageSize,
                    sortKey: opts?.sortKey,
                    sortType: opts?.sortBy,
                    search: opts?.search,
                    transacionType: opts?.transacionType,
                },
            });
            //const successMessage = response.data?.responseMessage || "Data Fetch Successful";
            const meta = response.data?.result?.[0]?.metadata?.[0];
            if (meta) {
                setTotalPages(meta.total_page);
                setTotalRows(meta.total);
            }
            setData(response.data?.result?.[0]?.data || [])
            //console.log(pageIndex,pageSize,totalPages,totalRows )
            //toast.success(successMessage)
        } catch (error: unknown) {
            let errorMessage = "Failed to Fetch Data"
            if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
                errorMessage = error.response.data.responseMessage;
            }
            if(errorMessage === "jwt expired"){
                setToken("");
                router.push("/login");
            }else{
                toast.error(errorMessage);
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
        columns: recentUsersColumns,
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
                url: apiConfig.transactionList,
                headers,
                params: {
                    page: 1,
                    limit,
                    sortKey,
                    sortType: sortBy,
                    search,
                    transacionType,
                },
                sheetName: "Transaction",
                filename: `transaction_export_${new Date().toISOString().slice(0,10)}`,
                mapRow: (r) => ({
                    "Sender Name": r.senderNickName || " - ",
                    "Receiver Name": r.receiverNickName || " - ",
                    "Amount": r.amount || " - ",
                    "Form Wallet Address": r.formWalletAddress || " - ",
                    "To Wallet Address": r.toWalletAddress || " - ",
                    "Remark": r.remark || " - ",
                    "Transaction Type": r.transacionType || " - ",
                    "Date & Time": r.createdAt ? new Date(r.createdAt).toLocaleString() : "",
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
        setTransacionType("");
        table.setGlobalFilter("");

        // Fetch fresh data
        //getData({ pageIndex: 0, pageSize: 50 });
    }

    // Trigger fetch when pagination, sorting, or global filter changes
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
            transacionType: "", // no transacionType here, since no second filter
        }
        // Note: Notice we don't fetch data inside here to avoid double fetching
    }, [globalFilter, paginationState.pageIndex, token, table, transacionType]);

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
            transacionType: transacionType || undefined,
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paginationState.pageIndex, paginationState.pageSize, sortingState, globalFilter, token, transacionType]);
    

    // Handle pagination and sorting changes (but not search)
    // useEffect(() => {
    //     if (!token) return;
    //     const sort = sortingState[0];
    //     const sortKey = sort?.id as string | undefined;
    //     const sortBy = sort ? (sort.desc ? 'DSC' : 'ASC') : undefined;

    //     getData({
    //         pageIndex: paginationState.pageIndex,
    //         pageSize: paginationState.pageSize,
    //         sortKey,
    //         sortBy,
    //         search: globalFilter || undefined,
    //     });
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [paginationState.pageIndex, paginationState.pageSize, sortingState, token]);
    
  return (
    <div className="flex flex-col gap-4 md:gap-6">
        <div>
            <h1 className="text-xl font-semibold">Transactions Management</h1>
            <p className="text-muted-foreground text-sm">Monitor all platform transactions and transfers</p>
        </div>
        <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:shadow-xs">
            <Card>
                <CardHeader>
                {/* <CardTitle>Search</CardTitle>
                <CardDescription>Track and manage your latest leads and their status.</CardDescription> */}
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
                <Select value={transacionType ?? ""} onValueChange={e => {setTransacionType(e); table.setPageIndex(0);}}>
                    <SelectTrigger className="w-full h-10! md:max-w-50 text-sm">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                    {["PLAN PURCHASE", "DEPOSIT", "WITHDRAW", "TRANSFER", "CREDIT", "DEBIT"].map((p) => (
                        <SelectItem key={p} value={p}>
                        {p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                </div>

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
