
import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
//import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";

export const recentUserSchema = z.object({
  _id: z.number(),
  // userId: z.string(),
  userName: z.string(),
  sponsorName: z.string(),
  refCode: z.string(),
  invCode: z.string(),
  child: z.number(),
  createdAt: z.date(),
  status: z.boolean()
});


export const columnNames = {
    userName: "Username",
    sponsorName: "Sponsor ID",
    refCode: "Referral ID",
    invCode: "Invitation ID",
    child: "Children",
    createdAt: "Registration Date",
    status: "Status",
    action: "Action"
    // add more mappings as needed
  };

const copyToClipboard = async (text: string, label: string) => {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
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
    accessorKey: "userName",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["userName"]} />,
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
        <span>{row.original.userName || "-"}</span>
        {row.original.userName && (
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
    accessorKey: "sponsorName",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["sponsorName"]} />,
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
        <span>{row.original.sponsorName || "-"}</span>
        {row.original.sponsorName && (
        <Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("sponsorName"), columnNames["sponsorName"])}
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
    accessorKey: "refCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["refCode"]} />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
      <span>{row.original.refCode || "-"}</span>
      {row.original.refCode && (
      <Button variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(row.getValue("refCode"), columnNames["refCode"])}
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
    accessorKey: "invCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["invCode"]} />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
      <span>{row.original.invCode || "-"}</span>
      {row.original.invCode && (
      <Button variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(row.getValue("invCode"), columnNames["invCode"])}
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
    accessorKey: "child",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["child"]} />,
    cell: ({ row }) => <Badge variant="secondary">{row.original.child.toLocaleString()}</Badge>,
    //enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["status"]} />,
    cell: ({ row }) => {
      const value = row.getValue("status"); // value is boolean
      return value
        ? <Badge variant="success">Activated</Badge>
        : <Badge variant="destructive">Not Activated</Badge>;
    },
    // enableSorting: false,
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
  //             <AlertDialogAction className="text-sm" onClick={() => handleLoginAction(row.getValue("walletAddress"), "loginAs")}>Confirm</AlertDialogAction>
  //           </AlertDialogFooter>
  //         </AlertDialogContent>
  //       </AlertDialog>
  //     );
  //   },
  //   enableSorting: false,
  // },
];