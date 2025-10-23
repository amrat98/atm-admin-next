"use client";
import { useUser } from "@/lib/userContext";
import axios from "axios";
import { apiConfig } from "@/config/apiConfig";
import { toast } from "sonner";
import z from "zod";
import { Trash2 } from "lucide-react";
import { Row, Table } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const recentUserSchema = z.object({
  _id: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  thumbnail: z.string(),
  redirectionLink: z.string(),
  status: z.string(),
  createdAt: z.date()
});

export function DeleteBlog({row,table}: { row: Row<z.infer<typeof recentUserSchema>>; table: Table<z.infer<typeof recentUserSchema>>;}){
  const { token } = useUser();

  const handleDelete = async (blogId: string) => {
    try {
      const headers = { token: token };
      await axios.delete(`${apiConfig.blogs.delete}?_id=${blogId}`, { headers });
      toast.success("Blog deleted successfully.");
      return true;
    } catch (error: unknown) {
      let errorMessage = "Failed to Delete Blog.";
      if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
        errorMessage = error.response.data.responseMessage;
      }
      toast.error(errorMessage);
      return false;
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="destructive">
                <Trash2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this{" "}<span className="text-primary font-semibold">{row.getValue("title")}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-sm"
            onClick={async () => {
              const ok = await handleDelete(row.original._id);
              if (ok) {
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