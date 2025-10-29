"use client";
import { useState } from "react";
import { useUser } from "@/lib/userContext";
import axios from "axios";
import { apiConfig } from "@/config/apiConfig";
import { toast } from "sonner";
import z from "zod";
import { Check, Loader2, X } from "lucide-react";
import { Row, Table } from "@tanstack/react-table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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

export function WithdrawAction({row,table}: { row: Row<z.infer<typeof recentUserSchema>>; table: Table<z.infer<typeof recentUserSchema>>;}){
  const { token } = useUser();
  const [submitting, setSubmitting] = useState(false);

  const handleAction = async (transactionId: string, action: string) => {
    setSubmitting(true);
    try {
      const headers = { token: token };
      const data = {
        objectId: [
          {_id: transactionId}
        ],
        action: action
      }
      const response = await axios.post(apiConfig.actionWithdraw, data, { headers });
      //toast.success(response.data.responseMessage || "Withdraw Approved/Rejected successfully.");
      if (action === 'REJECT') {
        toast.success('Withdraw is rejected.');
      } else if (action === 'APPROVE') {
        toast.success('Withdraw approved successfully.');
      } else {
        // Fallback message for other actions
        toast.success(response.data.responseMessage || 'Action completed successfully.');
      }
      return true;
    } catch (error: unknown) {
      let errorMessage = "Failed to Approve/Reject Withdraw.";
      if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
        errorMessage = error.response.data.responseMessage;
      }
      toast.error(errorMessage);
      return false;
    } finally {
      setSubmitting(false)
    }
  };

  return (
    <>
    <AlertDialog>
      <AlertDialogTrigger asChild>
          <Button type="button" size="xs" variant="outline" className="text-green-700" disabled={submitting}>
            <Check className="w-4 h-4 mr-1" />
            <span>Approve</span>
          </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Approve Transaction
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve transaction for this user{" "}<span className="text-primary font-semibold">{row.getValue("userName")}</span>?<br/><br/>
            <span className="font-semibold text-red-600">Transaction: $ {row.original.amount.toLocaleString()}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-sm"  disabled={submitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="text-sm"
            disabled={submitting}
            onClick={async () => {
              const ok = await handleAction(row.original._id, "APPROVE");
              if (ok) {
                try {
                  table.setSorting([]);
                  table.setGlobalFilter("");
                  table.setPageIndex(0);
                  table.toggleAllPageRowsSelected(false);
                } catch {}
              }
            }}
          >
            {submitting && <Loader2 className="size-5 animate-spin" />}
            <span>Confirm</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog>
    <AlertDialogTrigger asChild>
    <Button type="button" size="xs" variant="outline" className="text-orange-700" disabled={submitting}>
      <X className="w-4 h-4 mr-1" />
      <span>Reject</span>
    </Button>
    </AlertDialogTrigger>

    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Reject Transaction
        </AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to reject transaction for this user{" "}<span className="text-primary font-semibold">{row.getValue("userName")}</span>?<br/><br/>
          <span className="font-semibold text-red-600">Transaction: $ {row.original.amount.toLocaleString()}</span>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="text-sm" disabled={submitting}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          className="text-sm"
          disabled={submitting}
          onClick={async () => {
            const ok = await handleAction(row.original._id, "REJECT");
            if (ok) {
              try {
                table.setSorting([]);
                table.setGlobalFilter("");
                table.setPageIndex(0);
                table.toggleAllPageRowsSelected(false);
              } catch {}
            }
          }}
        >
          {submitting && <Loader2 className="size-5 animate-spin" />}
          <span>Confirm</span>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
    </AlertDialog>
    </>
  );
}