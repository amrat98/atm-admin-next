
import { ColumnDef } from "@tanstack/react-table";
import z from "zod";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
// import { toast } from "sonner";
import { format } from "date-fns";
// import Link from "next/link";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DeleteTeam } from "./deleteTeam";
import { EditTeam } from "./editTeam";

export const recentUserSchema = z.object({
  _id: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  thumbnail: z.string(),
  redirectionLink: z.string(),
  status: z.string(),
  createdAt: z.date()
});


export const columnNames = {
    title: "Name",
    shortDescription: "Designation",
    thumbnail: "Image",
    redirectionLink: "Link",
    createdAt: "Date & Time",
    status: "Status",
    action: "Action"
    // add more mappings as needed
  };

// const copyToClipboard = async (text: string, label: string) => {
//       await navigator.clipboard.writeText(text);
//       toast.success(`${label} copied to clipboard`);
//   };

  const statusBadge: Record<string, { label: string; variant: "info" | "success" | "warning" | "danger" | "secondary" | "default" | "destructive" }> = {
    "ACTIVE": { label: "Active", variant: "success" },
    "BLOCK": { label: "Block", variant: "danger" }
    // If you want a fallback
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
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["title"]} />,
    cell: ({ row }) => <span className="inline-block whitespace-normal">{row.original.title || "-"}</span>,
    enableHiding: false,
  },
  {
    accessorKey: "shortDescription",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["shortDescription"]} />,
    cell: ({ row }) => <p className="whitespace-normal">{row.original.shortDescription || "-"}</p>,
    enableSorting: false,
    // enableHiding: false,
  },
  {
    accessorKey: "thumbnail",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["thumbnail"]} />,
    cell: ({ row }) => (
      <Tooltip>
        <TooltipTrigger className="w-24">
        <AspectRatio ratio={1 / 1} className="bg-muted rounded-lg">
            <Image
              src={row.original.thumbnail}
              alt={row.original.title}
              fill
              className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </AspectRatio>
        </TooltipTrigger>
        <TooltipContent>
        <Image src={row.original.thumbnail} alt={row.original.title} width={300} height={300} className="max-w-[80dvw] max-h-[50dvw]" />
        </TooltipContent>
      </Tooltip>
    ),
    enableSorting: false,
    // enableHiding: false,
  },
  // {
  //   accessorKey: "redirectionLink",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["redirectionLink"]} />,
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-2">
  //     {row.original.redirectionLink.length > 20 ?
  //     ( <span>{row.original.redirectionLink.substring(0, 30) + " ..." || "-"}</span> ): (<span>{row.original.redirectionLink}</span>)
  //     }
  //     {row.original.redirectionLink && (
  //     <Button size="icon" variant="ghost" asChild>
  //       <Link href={row.original.redirectionLink} target="_blank"><ExternalLink /></Link>
  //     </Button>)}
  //     </div>
  //   ),
  //   enableSorting: false,
  //   // enableHiding: false,
  // },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title={columnNames["status"]} />,
    cell: ({ row }) =>{
      const value = row.getValue("status") as string;
      const badge = statusBadge[value] || { label: value || "Unknown", variant: "default" };
      return (
        <Badge variant={badge.variant}>{badge.label}</Badge>
      );
    },
    //enableSorting: false,
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
        <div className="flex gap-2">
        <EditTeam row={row} table={table} />
        <DeleteTeam row={row} table={table} />
        </div>
      );
    },
    enableSorting: false,
  },
];