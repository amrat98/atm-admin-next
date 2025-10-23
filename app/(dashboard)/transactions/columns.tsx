
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";

export const recentUserSchema = z.object({
  _id: z.number(),
  // userId: z.string(),
  transacionType: z.string(),
  senderNickName: z.string(),
  receiverNickName: z.string(),
  formWalletAddress: z.string(),
  toWalletAddress: z.string(),
  remark: z.string(),
  amount: z.number(),
  createdAt: z.date(),
});


export const columnNames = {
    transacionType: "Transaction Type",
    senderNickName: "Username",
    receiverNickName: "Receiver Name",
    formWalletAddress: "Form",
    toWalletAddress: "To",
    remark: "Remark",
    amount: "Amount",
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
    "DEBIT": { label: "Debit", variant: "danger" },
  };

export const recentUsersColumns: ColumnDef<z.infer<typeof recentUserSchema>>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={table.getIsAllPageRowsSelected()}
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Select all"
  //       />
  //     </div>
  //   ),
  //   cell: ({ row }) => (
  //     <div className="flex items-center justify-center">
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Select row"
  //       />
  //     </div>
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
    accessorKey: "transacionType",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["transacionType"]} />,
    cell: ({ row }) => {
      const value = row.getValue("transacionType") as string;
      const badge = transactionTypeBadge[value] || { label: value || "Unknown", variant: "default" };
      return (
        <Badge variant={badge.variant}>{badge.label}</Badge>
      );
    },
    // enableSorting: false,
  },
  {
    accessorKey: "senderNickName",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["senderNickName"]} />,
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
        <span>{row.original.senderNickName || " - "}</span>
        {row.original.senderNickName &&
        <Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("senderNickName"), columnNames["senderNickName"])}
            className="size-4"
          >
            <Copy className="size-3"  />
          </Button>
        }
        </div>
    ),
    enableHiding: false,
  },
  // {
  //   accessorKey: "receiverNickName",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["receiverNickName"]} />,
  //   cell: ({ row }) => (
  //       <div className="flex items-center gap-2">
  //       <span>{row.original.receiverNickName || " - "}</span>
  //       {row.original.receiverNickName &&
  //       <Button variant="ghost"
  //           size="icon"
  //           onClick={() => copyToClipboard(row.getValue("receiverNickName"), columnNames["receiverNickName"])}
  //           className="size-4"
  //         >
  //           <Copy className="size-3"  />
  //       </Button>
  //       }
  //       </div>
  //   ),
  //   enableHiding: false,
  // },
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
    cell: ({ row }) => <span>$ {row.original.amount.toLocaleString()}</span>,
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
  
  // {
  //   accessorKey: "action",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["action"]} />,
  //   cell: ({ row }) => {
  //     return (
  //       <AlertDialog>
  //         <AlertDialogTrigger asChild>
  //           <span>
  //             <Tooltip>
  //               <TooltipTrigger asChild>
  //                 <Button size="icon" variant="outline">
  //                   <LogIn />
  //                 </Button>
  //               </TooltipTrigger>
  //               <TooltipContent>
  //                 <p>Login As</p>
  //               </TooltipContent>
  //             </Tooltip>
  //           </span>
  //         </AlertDialogTrigger>
  //         <AlertDialogContent>
  //           <AlertDialogHeader>
  //             <AlertDialogTitle>Login as User</AlertDialogTitle>
  //             <AlertDialogDescription>
  //             Are you sure you want to impersonate <span className="font-semibold">{row.getValue("nickName")}</span>? You will be logged in as this user.
  //             </AlertDialogDescription>
  //           </AlertDialogHeader>
  //           <AlertDialogFooter>
  //             <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
  //             <AlertDialogAction className="text-sm" onClick={() => handleLoginAction(row.getValue("walletAddress"), "loginAs")}>Confirm</AlertDialogAction>
  //           </AlertDialogFooter>
  //         </AlertDialogContent>
  //       </AlertDialog>
  //     );
  //   },
  //   enableSorting: false,
  // },
];