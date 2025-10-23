"use client";
import { useState } from "react"
import { useUser } from "@/lib/userContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import { apiConfig } from "@/config/apiConfig";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Row, Table } from "@tanstack/react-table";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// -------------------------------------
// Schema (optional, if reused here)
// -------------------------------------
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

// -------------------------------------
// 1️⃣ Hook for Block/Unblock logic
// -------------------------------------
export function useBlockHandler() {
  const { token, setToken } = useUser();
  const router = useRouter();

  const handleBlock = async (userId: number, operation: string, remark: string): Promise<boolean> => {
    if (!userId || !token) return false;
    try {
      const response = await axios.post(
        apiConfig.updatedAirdropReward,
        { taskId: userId, operation, remark },
        { headers: { token } }
      );
      toast.success(
        response.data.responseMessage || "Reward Approved/Rejected Successful!"
      );
      return true;
    } catch (error: unknown) {
      let errorMessage = "Failed to Approved/Rejected rewards";
      if (
        axios.isAxiosError(error) &&
        error.response?.data?.responseMessage
      ) {
        errorMessage = error.response.data.responseMessage;
      }
      if (errorMessage === "jwt expired") {
        setToken("");
        router.push("/login");
      } else {
        toast.error(errorMessage);
      }
      return false;
    }
  };

  return { handleBlock };
}

// -------------------------------------
// 2️⃣ UI Component for table cell
// -------------------------------------
export function RewardActionCell({
  row,
  table
}: {
  row: Row<z.infer<typeof recentUserSchema>>;
  table: Table<z.infer<typeof recentUserSchema>>;
}) {
  const { handleBlock } = useBlockHandler();
  const isPending = row.original?.rewardStatus === "PENDING";
  const [remark, setRemark] = useState("")
  const isRemarkValid = remark.trim().length > 0;

  return (
    <>
    {!isPending && (
        <>
        {row.original?.rewardStatus === "APPROVE" ? (
        <Button variant="outline" size="xs" className="text-green-700" disabled>
            Approved
        </Button>
        ) : (
        <Button variant="outline" size="xs" className="text-red-700" disabled>
            Rejected
        </Button>
        )}
        </>
    )}

    {isPending &&(
    <>
    <AlertDialog>
      <AlertDialogTrigger asChild>
          <Button type="button" size="xs" variant="outline" className="text-green-700">
            <Check className="w-4 h-4 mr-1" />
            <span>Approve</span>
          </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Approve Reward
          </AlertDialogTitle>
          <AlertDialogDescription>
          Are you sure you want to approve reward for this user{" "}<span className="text-primary font-semibold">{row.getValue("userId")}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-sm"
            onClick={async () => {
              const ok = await handleBlock(row.original._id, "APPROVE","");
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

    <AlertDialog>
      <AlertDialogTrigger asChild>
          <Button type="button" size="xs" variant="outline" className="text-orange-700">
            <X className="w-4 h-4 mr-1" />
            <span>Reject</span>
          </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Reject Reward
          </AlertDialogTitle>
          <AlertDialogDescription>
          Are you sure you want to reject reward for this user{" "}<span className="text-red-600 font-semibold">{row.getValue("userId")}</span>?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex">
            <div className="grid w-full gap-3">
            <Label htmlFor="message">Remark <span className="text-red-600">*</span></Label>
            <Textarea
              id="remark"
              placeholder="Type your remarks here..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
            />
            </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-sm">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-sm"
            disabled={!isRemarkValid}
            onClick={async () => {
              const ok = await handleBlock(row.original._id, "REJECT",remark);
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
    </>
    )}
    </>
  );
}
