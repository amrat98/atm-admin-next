
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
//import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";
// import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
import bcrypt from "bcryptjs"

export const recentUserSchema = z.object({
  _id: z.number(),
  userName: z.string(),
  planName: z.string(),
  planPrice: z.number(),
  income: z.number(),
  mainBalance: z.number(),
  createdAt: z.date(),
});


export const columnNames = {
    userName: "Username",
    planName: "Plan",
    planPrice: "Plan Amount",
    income: "Income Amount",
    createdAt: "Date",
    action: "Action"
    // add more mappings as needed
  };

  const planTypeBadge: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" | "secondary" | "default" | "destructive" }> = {
    "Starter": { label: "Starter Plan", variant: "secondary" },
    "Standard": { label: "Standard Plan", variant: "warning" },
    "Premium": { label: "Premium Plan", variant: "default" },
    "Elite": { label: "Elite Plan", variant: "info" },
    "Exclusive": { label: "Exclusive Plan", variant: "success" },
    // If you want a fallback
  };
  

const copyToClipboard = async (text: string, label: string) => {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
  };

export function handleLoginAction(userIdentifier: string) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_LOGIN_URL;
    const admin = bcrypt.hashSync("iamadmin");
    window.open(`${baseUrl}?key=${admin}&id=${userIdentifier}`, "_blank","noopener,noreferrer");
}

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
    accessorKey: "userName",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["userName"]} />,
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
        <span>{row.original.userName || "-"}</span>
        {row.original.userName  && (
        <Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("userName"), columnNames["userName"])}
            className="size-4"
          >
            <Copy className="size-3"  />
          </Button>
        )}
        </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "planName",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["planName"]} />,
    cell: ({ row }) => {
      const value = row.getValue("planName") as string;
      const badge = planTypeBadge[value] || { label: value || "Unknown", variant: "default" };
      return (
        <Badge variant={badge.variant}>{badge.label}</Badge>
      );
    },
    // enableSorting: false,
  },
  {
    accessorKey: "planPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["planPrice"]} />,
    cell: ({ row }) => <span>$ {row.original.planPrice.toLocaleString()}</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "income",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["income"]} />,
    cell: ({ row }) => <span>{Number(row.original.income ?? 0).toLocaleString()} ATMC</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["createdAt"]} />,
    cell: ({ row }) => <span>{format(new Date(row.getValue("createdAt")), 'dd/MM/yy | HH:mm a')}</span>,
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
  //             <AlertDialogAction className="text-sm" onClick={() => handleLoginAction(row.getValue("walletAddress"))}>Confirm</AlertDialogAction>
  //           </AlertDialogFooter>
  //         </AlertDialogContent>
  //       </AlertDialog>
  //     );
  //   },
  //   enableSorting: false,
  // },
];