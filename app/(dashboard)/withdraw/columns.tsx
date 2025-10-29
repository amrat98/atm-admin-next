
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import z from "zod";
import type { Table } from '@tanstack/react-table';
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";
import { WithdrawAction } from "./withdrawAction";
import { WithdrawBulkAction } from "./withdrawBulkAction";


export const recentUserSchema = z.object({
  _id: z.string(),
  userName: z.string(),
  userId: z.string(),
  transactionId: z.string(),
  transacionType: z.string(),
  formWalletAddress: z.string(),
  toWalletAddress: z.string(),
  transacionStatus: z.string(),
  remark: z.string(),
  amount: z.number(),
  walletBalance: z.number(),
  transactionFee: z.number(),
  createdAt: z.date(),
});


export const columnNames = {
    userName: "User Name",
    userId: "User Id",
    transactionId: "Transaction Id",
    transacionType: "Transaction Type",
    transactionFee: "Transaction Fee",
    transacionStatus: "Status",
    formWalletAddress: "Form",
    toWalletAddress: "To",
    remark: "Remark",
    amount: "Amount",
    walletBalance: "Wallet Balance",
    createdAt: "Date & Time",
    action: "Action"
    // add more mappings as needed
  };

const copyToClipboard = async (text: string, label: string) => {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
  };

  const transactionTypeBadge: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" | "secondary" | "default" | "destructive" }> = {
    "WITHDRAW": { label: "Withdraw", variant: "warning" },
    "PLAN PURCHASE": { label: "Plan Purchase", variant: "success" },
    "DEPOSIT": { label: "Deposit", variant: "info" },
    "CREDIT": { label: "Credit", variant: "success" },
    "TRANSFER": { label: "Transfer", variant: "default" },
    "DEBIT": { label: "Debit", variant: "danger" }
  };
  const transactionStatusBadge: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" | "secondary" | "default" | "destructive" }> = {
    "WAITING_APPROVAL": { label: "Waiting", variant: "warning" },
    "COMPLETED": { label: "Completed", variant: "success" },
    "CANCELLED": { label: "Cancelled", variant: "danger"},
  };


export const recentUsersColumns: ColumnDef<z.infer<typeof recentUserSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center min-w-7">
        <Checkbox
          checked={table.getSelectedRowModel().rows.length > 0}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="relative z-1"
        />
        {table.getSelectedRowModel().rows.length > 0 && (
        <div className="absolute left-0 top-0 w-full h-full flex gap-2 items-center pl-10 bg-white">
          <WithdrawBulkAction table={table} />
        </div>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
//   {
//     accessorKey: "id",
//     header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
//     cell: ({ row }) => <span className="tabular-nums">{row.original._id}</span>,
//     enableSorting: false,
//     enableHiding: false,
//   },
  {
    accessorKey: "no",
    header: ({ column }) => <DataTableColumnHeader column={column} title="No" />,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex ?? 0;
      const pageSize = table.getState().pagination.pageSize ?? 10;
      return <span className="tabular-nums">{pageIndex * pageSize + row.index + 1}</span>;
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "transacionStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["transacionStatus"]} />,
    cell: ({ row }) => {
      const value = row.getValue("transacionStatus") as string;
      const badge = transactionStatusBadge[value] || { label: value || "Unknown", variant: "default" };
      return (
        <Badge variant={badge.variant} className="font-semibold">{badge.label}</Badge>
      );
    },
    // enableSorting: false,
  },
  // {
  //   accessorKey: "transacionType",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["transacionType"]} />,
  //   cell: ({ row }) => {
  //     const value = row.getValue("transacionType") as string;
  //     const badge = transactionTypeBadge[value] || { label: value || "Unknown", variant: "default" };
  //     return (
  //       <Badge variant={badge.variant}>{badge.label}</Badge>
  //     );
  //   },
  //   // enableSorting: false,
  // },
  {
    accessorKey: "userName",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["userName"]} />,
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
        <span>{row.original.userName || " - "}</span>
        {row.original.userName &&
        <Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("userName"), columnNames["userName"])}
            className="size-4"
          >
            <Copy className="size-3"  />
          </Button>
        }
        </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "formWalletAddress",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["formWalletAddress"]} />,
    cell: ({ row }) => {
        const address = row.getValue("formWalletAddress") as string;
        return (
        <div className="flex items-center gap-2">
        {address ? (
        <code className="text-xs bg-muted px-2 py-1 rounded">
        {address.length > 20 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address}
        </code>
        ) : (
          <code className="text-xs bg-muted px-2 py-1 rounded">...</code>
        )}
        {address.length > 20  &&
        (<Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("formWalletAddress"), columnNames["formWalletAddress"])}
            className="size-4"
          >
            <Copy className="size-3"  />
          </Button>)}
        </div>
        )
    },
    enableHiding: false,
  },
  {
    accessorKey: "toWalletAddress",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["toWalletAddress"]} />,
    cell: ({ row }) => {
        const address = row.getValue("toWalletAddress") as string;
        return (
        <div className="flex items-center gap-2">
        {address ? (
        <code className="text-xs bg-muted px-2 py-1 rounded">
        {address.length > 20 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address}
        </code>
        ) : (
          <code className="text-xs bg-muted px-2 py-1 rounded">...</code>
        )}
        {address.length > 20  &&
        (<Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("toWalletAddress"), columnNames["toWalletAddress"])}
            className="size-4"
          >
            <Copy className="size-3"  />
          </Button>)}
        </div>
        )
    },
    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["amount"]} />,
    cell: ({ row }) => (
      <div className={row.original.amount >= 1000 ? "bg-red-300": "bg-green-300"}>
        <span className="block py-2 -my-2 text-center font-semibold">$ {row.original.amount.toLocaleString()}</span>
      </div>
    ),
    //enableSorting: false,
  },
  {
    accessorKey: "walletBalance",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["walletBalance"]} />,
    cell: ({ row }) => (
      <div className={row.original.walletBalance >= 1000 ? "bg-red-300": "bg-green-300"}>
        <span className="block py-2 -my-2 text-center font-semibold">$ {row.original.walletBalance.toLocaleString()}</span>
      </div>
    ),
    //enableSorting: false,
  },
  {
    accessorKey: "transactionFee",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["transactionFee"]} />,
    cell: ({ row }) => <span>$ {row.original.transactionFee.toLocaleString()}</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["createdAt"]} />,
    cell: ({ row }) => <span>{format(new Date(row.getValue("createdAt")), 'dd/MM/yy | HH:mm a')}</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "remark",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["remark"]} />,
    cell: ({ row }) => <span>{row.original.remark || " - "}</span>,
    //enableSorting: false,
  },
  
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["action"]} />,
    cell: ({ row, table }) => {
      return (
        <div className="flex gap-2">
          {row.original.transacionStatus == 'WAITING_APPROVAL' && (<WithdrawAction row={row} table={table} />)}
          {/* {row.original.transacionStatus == 'COMPLETED' && (<Badge variant='outline'>Approve</Badge>)}
          {row.original.transacionStatus == 'CANCELLED' && (<Badge variant='outline'>Rejected</Badge>)} */}
        </div>
      );
    },
    enableSorting: false,
  },
];