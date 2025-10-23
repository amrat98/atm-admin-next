

import { ColumnDef } from "@tanstack/react-table";
import { Copy } from "lucide-react";
import z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
//import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { format } from "date-fns";
import Image from "next/image";
import { RewardActionCell } from "./rewardAction";

export const recentUserSchema = z.object({
  _id: z.number(),
  userId: z.string(),
  walletAddress: z.string(),
  followFacebook: z.string(),
  followInsta: z.string(),
  followTelegram: z.string(),
  followTgCommunity: z.string(),
  rewardStatus: z.string(),
  taskStatus: z.string(),
  adminRemark: z.string(),
  createdAt: z.date()
});


export const columnNames = {
  userId: "Username",
  walletAddress: "Wallet",
  images: "Images",
  rewardStatus: "Reward",
  taskStatus: "Status",
  adminRemark: "Remark",
  createdAt: "Date & Time",
  action: "Action"
    // add more mappings as needed
  };

  const rewardsBadge: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" | "secondary" | "default" | "destructive" }> = {
    "APPROVE": { label: "Approved", variant: "success" },
    "REJECT": { label: "Rejected", variant: "danger" },
    "PENDING": { label: "Pending", variant: "warning" }
    // If you want a fallback
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
    accessorKey: "userId",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["userId"]} />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
      <span>{row.original.userId}</span>
      <Button variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(row.getValue("userId"), columnNames["userId"])}
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
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "images",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["images"]} />,
    cell: ({ row }) => (
      <div className="inline-grid grid-cols-2 gap-2">
      {!row.original.followTgCommunity && !row.original.followInsta && !row.original.followTelegram && !row.original.followTgCommunity && (
        <Badge variant="warning" className="col-span-2">No Images</Badge>
      )}
      {row.original.followFacebook && (
      <Tooltip>
        <TooltipTrigger>
          <Image src={row.original.followFacebook} alt="Facebook" width={60} height={60} className="max-w-[60px] aspect-square object-cover" />
        </TooltipTrigger>
        <TooltipContent>
        <Image src={row.original.followFacebook} alt="Facebook" width={350} height={350} className="max-w-[50dvw] max-h-[30dvh] object-contain" />
        </TooltipContent>
      </Tooltip>
      )}
      {row.original.followInsta && (
      <Tooltip>
        <TooltipTrigger>
          <Image src={row.original.followInsta} alt="Instagram" width={60} height={60} className="max-w-[60px] aspect-square object-cover" />
        </TooltipTrigger>
        <TooltipContent>
        <Image src={row.original.followInsta} alt="Instagram" width={350} height={350} className="max-w-[50dvw] max-h-[30dvh] object-contain" />
        </TooltipContent>
      </Tooltip>
      )}
      {row.original.followTelegram && (
      <Tooltip>
        <TooltipTrigger>
          <Image src={row.original.followTelegram} alt="Telegram" width={60} height={60} className="max-w-[60px] aspect-square object-cover" />
        </TooltipTrigger>
        <TooltipContent>
        <Image src={row.original.followTelegram} alt="Telegram" width={350} height={350} className="max-w-[50dvw] max-h-[30dvh] object-contain" />
        </TooltipContent>
      </Tooltip>
      )}
      {row.original.followTgCommunity && (
      <Tooltip>
        <TooltipTrigger>
          <Image src={row.original.followTgCommunity} alt="Community" width={60} height={60} className="max-w-[60px] aspect-square object-cover" />
        </TooltipTrigger>
        <TooltipContent>
        <Image src={row.original.followTgCommunity} alt="Community" width={350} height={350} className="max-w-[50dvw] max-h-[30dvh] object-contain" />
        </TooltipContent>
      </Tooltip>
      )}
      </div>
    ),
    enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "rewardStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["rewardStatus"]} />,
    cell: ({ row }) => {
      const value = row.getValue("rewardStatus") as string;
      const badge = rewardsBadge[value] || { label: value || "Unknown", variant: "default" };
      return (
        <Badge variant={badge.variant}>{badge.label}</Badge>
      );
    },
    // enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "taskStatus",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["taskStatus"]} />,
    cell: ({ row }) => {
      const value = row.getValue("taskStatus"); // value is boolean
      return value
        ? <Badge variant="success">Completed</Badge>
        : <Badge variant="destructive">Not Completed</Badge>;
    },
    // enableSorting: false,
  },
  {
    accessorKey: "adminRemark",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["adminRemark"]} />,
    cell: ({ row }) => <span className="max-w-3xl whitespace-normal">{row.original.adminRemark|| "-"}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["createdAt"]} />,
    cell: ({ row }) => <span>{format(new Date(row.getValue("createdAt")), 'dd/MM/yy | HH:mm a')}</span>,
    //enableSorting: false,
  },
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["action"]} />,
    cell: ({ row, table }) => {
      return (
        <div className="flex gap-2 flex-col">
        <RewardActionCell row={row} table={table} />
        </div>
      );
    },
    enableSorting: false,
  },
];