
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Copy, UserX,UserCheck, LogIn } from "lucide-react";
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
import bcrypt from "bcryptjs"
import { PlanAction } from "./planAction"
import type { Plan } from "./planAction"
import { useBlockHandler } from "./blockAction";


export const internalWalletDataSchema = z.object({
  isBlocked: z.boolean(),
  // add other fields if needed
});

export const recentUserSchema = z.object({
  _id: z.number(),
  nickName: z.string(),
  invitationCode: z.string(),
  walletAddress: z.string(),
  planPrice: z.number(),
  fundWallet: z.number(),
  incomeBalance: z.number(),
  poolWallet: z.number(),
  airDropCoin: z.number(),
  createdAt: z.date(),
  activationDate: z.date(),
  status: z.string(),
  //isBlocked: z.boolean(),
  internalwalletData: internalWalletDataSchema.optional(),
});


export const columnNames = {
    nickName: "Username",
    invitationCode: "Sponsor ID",
    walletAddress: "Wallet Address",
    planPrice: "Plan Amount",
    fundWallet: "Fund Wallet",
    incomeBalance: "Income Wallet",
    poolWallet: "Pool Wallet",
    airDropCoin: "Airdrop Wallet",
    createdAt: "Registration Date",
    activationDate: "Activation Date",
    action: "Action",
    status: "Status"
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

function BlockActionCell({ row, table }: { row: Row<z.infer<typeof recentUserSchema>>; table: Table<z.infer<typeof recentUserSchema>> }) {
  const { handleBlock } = useBlockHandler();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
      {row.original?.status !== "ACTIVE" ? (
        <Button type="button" size="xs" variant="outline" className="text-green-700">
            <UserCheck />
            <span>Unblock User</span>
        </Button>
      ) : (
        <Button type="button" size="xs" variant="outline" className="text-orange-600">
            <UserX />
            <span>Block User</span>
        </Button>
      )}
      </AlertDialogTrigger>
      <AlertDialogContent>
      {row.original?.status !== "ACTIVE" ? (
        <AlertDialogHeader>
          <AlertDialogTitle>Unblock User</AlertDialogTitle>
          <AlertDialogDescription>
          Are you sure you want to unblock user <span className="text-primary font-semibold">{row.getValue("nickName")}</span>? This will allow them to access their account.
          </AlertDialogDescription>
        </AlertDialogHeader>
      ) : (
        <AlertDialogHeader>
          <AlertDialogTitle>Block User</AlertDialogTitle>
          <AlertDialogDescription>
          Are you sure you want to block user <span className="text-primary font-semibold">{row.getValue("nickName")}</span>? This will prevent them from accessing their account.
          </AlertDialogDescription>
        </AlertDialogHeader>
      )}
        <AlertDialogFooter>
          <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-sm"
            onClick={async () => {
              const ok = await handleBlock(row.original._id);
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


type PlansProps = { plans: Plan[] };

export const recentUsersColumns= (planProps: PlansProps) : ColumnDef<z.infer<typeof recentUserSchema>>[] => [
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
    accessorKey: "nickName",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["nickName"]} />,
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
        <span>{row.original.nickName}</span>
        <Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("nickName"), columnNames["nickName"])}
            className="size-4"
          >
            <Copy className="size-3"  />
          </Button>
        </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "invitationCode",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["invitationCode"]} />,
    cell: ({ row }) => (
        <div className="flex items-center gap-2">
        <span>{row.original.invitationCode}</span>
        <Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("invitationCode"), columnNames["invitationCode"])}
            className="size-4"
          >
            <Copy className="size-3"  />
          </Button>
        </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "walletAddress",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["walletAddress"]} />,
    cell: ({ row }) => {
        const address = row.getValue("walletAddress") as string;
        return (
        <div className="flex items-center gap-2">
        <code className="text-xs bg-muted px-2 py-1 rounded">
        {address.length > 20 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address}
        </code>
        {address.length > 20  &&
        (<Button variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(row.getValue("walletAddress"), columnNames["walletAddress"])}
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
    accessorKey: "planPrice",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["planPrice"]} />,
    cell: ({ row }) => <span>$ {row.original.planPrice.toLocaleString()}</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "fundWallet",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["fundWallet"]} />,
    cell: ({ row }) => <span>{Number(row.original.fundWallet ?? 0).toLocaleString()} ATMC</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "incomeBalance",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["incomeBalance"]} />,
    cell: ({ row }) => <span>{Number(row.original.incomeBalance ?? 0).toLocaleString()} ATMC</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "poolWallet",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["poolWallet"]} />,
    cell: ({ row }) => <span>{Number(row.original.poolWallet ?? 0).toLocaleString()} ATMC</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "airDropCoin",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["airDropCoin"]} />,
    cell: ({ row }) => <span>{Number(row.original.airDropCoin ?? 0).toLocaleString()} ATMC</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "activationDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["activationDate"]} />,
    cell: ({ row }) => {
      const value = row.getValue("activationDate") as string | null;
      return value
        ? <span>{format(new Date(value), 'dd/MM/yy | HH:mm a')}</span>
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
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["status"]} />,
    cell: ({ row,table }) => <BlockActionCell row={row} table={table} />,
    //enableSorting: false,
  },
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["action"]} />,
    cell: ({ row, table }) => {
      return (
        <div className="flex gap-2 items-center">
        {/* <BlockActionCell row={row} table={table} /> */}
        <PlanAction plans={planProps.plans} userId={row.original._id} userName={row.original.nickName} onSuccess={() => {
          try {
            // Clear sort and filter, reset page to trigger page effect which fetches
            table.setSorting([]);
            table.setGlobalFilter("");
            table.setPageIndex(0);
          } catch {}
        }} />
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
              Are you sure you want to impersonate <span className="font-semibold text-primary">{row.getValue("nickName")}</span>? You will be logged in as this user.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
              <AlertDialogAction className="text-sm" onClick={() => handleLoginAction(row.getValue("walletAddress"))}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      );
    },
    enableSorting: false,
  },

];