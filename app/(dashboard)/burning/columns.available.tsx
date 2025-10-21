
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Flame, LogIn } from "lucide-react";
import z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
//import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useBurnedHandler } from "./burnedAction";
import type { Row, Table } from "@tanstack/react-table";
import bcrypt from "bcryptjs";

export const recentUserSchema = z.object({
  _id: z.number(),
  username: z.string(),
  planId: z.string(),
  address: z.string(),
  availableToBurn: z.number(),
  planAmount: z.number(),
  expierdOn: z.date(),
});


export const columnNames = {
    username: "Username",
    planId: "Plan ID",
    address: "Wallet Address",
    availableToBurn: "Available To Burn",
    planAmount: "Plan Amount",
    expierdOn: "Expiry Date",
    action: "Action"
    // add more mappings as needed
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

function BurnActionCell({ row, table }: { row: Row<z.infer<typeof recentUserSchema>>; table: Table<z.infer<typeof recentUserSchema>> }) {
  const { handleBurned } = useBurnedHandler();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="destructive">
                <Flame />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark Burned</p>
            </TooltipContent>
          </Tooltip>
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Coin Burning</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to mark <span className="text-red-600 font-semibold">{row.getValue("planAmount")} ATMC</span> as burned for user <span className="text-primary font-semibold">{row.getValue("username")}</span>?
            This action cannot be undone and will move the entry to the Burned tab.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-sm"
            onClick={async () => {
              const ok = await handleBurned(row.original.planId);
              if (ok) {
                // Easiest generic refresh: reload the page route
                try {
                  table.setSorting([]);
                  table.setGlobalFilter("");
                  table.setPageIndex(0);
                } catch {}
              }
            }}
          >
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
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
    accessorKey: "username",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["username"]} />,
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
        <span>{row.original.username || "-"}</span>
        {row.original.username  && (
        <Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("username"), columnNames["username"])}
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
    accessorKey: "address",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["address"]} />,
    cell: ({ row }) => {
        const address = row.getValue("address") as string;
        return (
        <div className="flex items-center gap-2">
          {address && (
          <>
        <code className="text-xs bg-muted px-2 py-1 rounded">
        {address.length > 20 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address}
        </code>
        {address.length > 20  &&
        (<Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("address"), columnNames["address"])}
            className="size-4"
          >
            <Copy className="size-3"  />
          </Button>)}
          </>
          )}
        </div>
        )
    },
    enableHiding: false,
  },
  // {
  //   accessorKey: "planId",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["planId"]} />,
  //   cell: ({ row }) => <span>{row.original.planId.toLocaleString()}</span>,
  //   //enableSorting: false,
  // },
  {
    accessorKey: "planAmount",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["planAmount"]} />,
    cell: ({ row }) => <span>{row.original.planAmount.toLocaleString()} ATMC</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "availableToBurn",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["availableToBurn"]} />,
    cell: ({ row }) => <span>{row.original.availableToBurn.toLocaleString()} ATMC</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "expierdOn",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["expierdOn"]} />,
    cell: ({ row }) => {
      const value = row.getValue("expierdOn") as string | null;
      return value
        ? <span>{format(new Date(value), 'dd/MM/yy | HH:mm a')}</span>
        : <Badge variant="destructive">Not Activated</Badge>;
    },
    // enableSorting: false,
  },
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["action"]} />,
    cell: ({ row, table }) => {
      return (
        <div className="flex gap-2 items-center">
        <BurnActionCell row={row} table={table} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <span>
              <Tooltip>
                <TooltipTrigger asChild>
                <Button size="iconxs" variant="default" className="bg-green-600">
                    <LogIn />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Login As</p>
                </TooltipContent>
              </Tooltip>
            </span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Login as User</AlertDialogTitle>
              <AlertDialogDescription>
              Are you sure you want to impersonate <span className="font-semibold text-primary">{row.getValue("username")}</span>? You will be logged in as this user.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
              <AlertDialogAction className="text-sm" onClick={() => handleLoginAction(row.getValue("address"))}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      )
    },
    enableSorting: false,
  },
];