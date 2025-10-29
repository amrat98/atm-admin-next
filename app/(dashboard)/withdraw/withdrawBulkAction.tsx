"use client";
import { useState } from "react";
import { useUser } from "@/lib/userContext";
import axios from "axios";
import { apiConfig } from "@/config/apiConfig";
import { toast } from "sonner";
import z from "zod";
import { Check, Loader2, X } from "lucide-react";
import { Table } from "@tanstack/react-table";
import {Dialog,DialogClose,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog";
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

export function WithdrawBulkAction({table}: { table: Table<z.infer<typeof recentUserSchema>>;}){
  const { token } = useUser();
  const [submitting, setSubmitting] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);
  
  const selectedRows = table.getSelectedRowModel().rows;
  const userIDs = selectedRows.map(row => row.original._id);
  const userAmounts = selectedRows.map(row => row.original.amount);
  const totalAmount = userAmounts.reduce((sum, amount) => sum + amount, 0);
//  console.log('Bulk Action userIDs:', userIDs);
  const wait = (ms: number = 2000) => new Promise(resolve => setTimeout(resolve, ms));

  const handleBulkAction = async (action: string) => {
    setSubmitting(true);
    try {
      const headers = { token: token };
      const data = {
        objectId: userIDs,
        action: action
      }
      const response = await axios.post(apiConfig.actionWithdraw, data, { headers });
      //toast.success(response.data.responseMessage || "Withdraw Approved/Rejected successfully.");
      await wait();
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
    }
  };

  return (
    <>
    <Dialog open={openApprove} onOpenChange={setOpenApprove}>
      <DialogTrigger asChild>
          <Button type="button" size="xs" variant="outline" className="text-green-700" disabled={submitting || openApprove || openReject}>
          {submitting || openApprove ? (<Loader2 className="w-4 h-4 animate-spin mr-1" />) : (<Check className="w-4 h-4 mr-1" />)}
            <span>Bulk Approve</span>
          </Button>
      </DialogTrigger>

      <DialogContent showCloseButton={false} onInteractOutside={(e) => {e.preventDefault();}} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            Bulk Approve Transaction
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to approve all transaction for this users?<br/><br/>
            <span className="font-semibold text-red-600">Total Transaction: $ {totalAmount}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
        <DialogClose asChild>
              <Button variant="outline" className="text-sm" disabled={submitting}>Cancel</Button>
        </DialogClose>
          <Button
            className="text-sm"
            disabled={submitting}
            onClick={async () => {
              const ok = await handleBulkAction("APPROVE");
              if (ok) {
                try {
                  table.setSorting([]);
                  table.setGlobalFilter("");
                  table.setPageIndex(0);
                  table.toggleAllPageRowsSelected(false);
                } catch {}
                finally{
                  setSubmitting(false);
                  setOpenApprove(false);
                }
              }
            }}
          >
            {submitting && <Loader2 className="size-5 animate-spin" />}
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={openReject} onOpenChange={setOpenReject}>
    <DialogTrigger asChild>
    <Button type="button" size="xs" variant="outline" className="text-orange-700" disabled={submitting || openReject || openApprove}>
    {submitting || openReject ? (<Loader2 className="w-4 h-4 animate-spin mr-1" />) : (<X className="w-4 h-4 mr-1" />)}
      <span>Bulk Reject</span>
    </Button>
    </DialogTrigger>

    <DialogContent showCloseButton={false} onInteractOutside={(e) => {e.preventDefault();}} onEscapeKeyDown={(e) => e.preventDefault()}>
      <DialogHeader>
        <DialogTitle>
          Bulk Reject Transaction
        </DialogTitle>
        <DialogDescription>
          Are you sure you want to reject all transaction for this user?<br/><br/>
          <span className="font-semibold text-red-600">Total Transaction: $ {totalAmount}</span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
      <DialogClose asChild>
              <Button variant="outline" className="text-sm" disabled={submitting}>Cancel</Button>
        </DialogClose>
        <Button
          className="text-sm"
          disabled={submitting}
          onClick={async () => {
            const ok = await handleBulkAction("REJECT");
            if (ok) {
              try {
                table.setSorting([]);
                table.setGlobalFilter("");
                table.setPageIndex(0);
                table.toggleAllPageRowsSelected(false);
              } catch {}
              finally{
                setSubmitting(false);
                setOpenReject(false);
              }
            }
          }}
        >
          {submitting && <Loader2 className="size-5 animate-spin" />}
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </DialogContent>
    </Dialog>
    </>
  );
}