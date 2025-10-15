'use client';

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Form } from "@/components/ui/form"
import { Loader2, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/userContext"
import { toast } from "sonner"
import axios from "axios"
import { apiConfig } from '@/config/apiConfig'
import { Controller, useForm } from 'react-hook-form'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
// using DialogDescription from our UI system

export type Plan = {
  _id: string;
  name: string;
  price?: number;
};

type UsePlansResult = {
    plans: Plan[];
};

export function usePlans(): UsePlansResult {
    const router = useRouter();
    const { token, setToken } = useUser();
    const [plans, setPlans] = useState<Plan[]>([]);
    useEffect(() => {
        let mounted = true;
        const fetchPlans = async () => {
            try {
                if (!token) return;
            const response = await axios.post(apiConfig.getPlans, {}, {
                headers: { token: token },
            });
            if (!mounted) return;
            setPlans(response.data.result ?? []);
            } catch (error: unknown) {
            if (!mounted) return;
            let errorMessage = "Failed to Fetch Data";
            if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
                errorMessage = error.response.data.responseMessage;
            }
            toast.error(errorMessage);
            if (errorMessage === "jwt expired") {
                setToken("");
                router.push("/login");
            }
            }
        }
        fetchPlans();
        return () => {
          mounted = false;
        };
      }, [token, router, setToken]);
      return { plans };
}

type PlanActionProps = {
  plans: Plan[];
  userId: string | number;
  userName: string;
  onSuccess?: () => void;
};

const FormSchema = z.object({
    planId: z.string().min(1, { message: "Please select a plan." }),
    amount: z.string().min(1, { message: "Amount is required." }),
    remark: z.string().optional(),
    isRoi: z.boolean().optional(), // add switch if needed
    userId: z.string().min(1),
});

export function PlanAction({ plans, userId, userName, onSuccess}: PlanActionProps) {
    const { token } = useUser();
    const [submitting, setSubmitting] = useState(false);
    const [open, setOpen] = useState(false);


    const defaultValues = {
      planId: '',
      amount: '',
      remark: 'purchased by admin',
      isRoi: false,
      userId: String(userId)
    } as const;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues,
      });

    const resetForm = () => {
      form.reset(defaultValues);
    };

    useEffect(() => {
      // keep form userId in sync if row changes
      form.reset({ ...defaultValues, userId: String(userId) });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    // Watch planId to react to plan changes
    const selectedPlanId = form.watch("planId");
    const selectedPlan = plans.find(p => p._id === selectedPlanId);

      // When plan changes, update amount accordingly
        useEffect(() => {
            if (!selectedPlan) {
            form.setValue("amount", "");
            return;
            }

            if (selectedPlan.name === "Exclusive") {
            // Exclusive plans: allow manual input (clear amount)
            form.setValue("amount", "");
            } else if (selectedPlan.price != null) {
            // Other plans: set fixed price and lock input
            form.setValue("amount", String(selectedPlan.price));
            } else {
            form.setValue("amount", "");
            }
        }, [selectedPlanId, selectedPlan, form]);

      const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
        setSubmitting(true);
        try {
          const payload = {
            planId: formData.planId,
            remark: formData.remark,
            isRoi: formData.isRoi ?? false,
            amount: Number(formData.amount),
            users: [{ _id: String(userId) }],
          };
          await axios.post(apiConfig.buyPlanUsers, payload, {
            headers: {
              token
            },
          });
          toast.success("Plan purchase successful!");
          // reset and close after success
          resetForm();
          setOpen(false);
          if (onSuccess) onSuccess();
        } catch (error: unknown) {
          let errorMessage = "Failed to submit";
          if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
            errorMessage = error.response.data.responseMessage;
          }
          toast.error(errorMessage);
        } finally {
          setSubmitting(false);
        }
      };

  return (
      <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (!nextOpen) { resetForm(); } }}>
        <DialogTrigger asChild>
          <Button type="button" size="xs" variant="default" className="bg-blue-600">
            <ShoppingBag />
            <span>Plan Purchase</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plan Purchase</DialogTitle>
            <DialogDescription>Purchase the Plan for the User <span className='font-semibold text-primary'>{userName}</span></DialogDescription>
          </DialogHeader>

          <Form {...form}>
          <form id="plan-purchase-form" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Select Plan</Label>
                <Controller
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full h-12!">
                        <SelectValue placeholder="Select Plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.map((p) => (
                          <SelectItem key={p._id} value={p._id}>
                            {p.name}
                            {p.price != null && ` — $${p.price}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {/* {plansError ? <p className="text-sm text-red-500">{plansError}</p> : null} */}
              </div>

              <div className="grid gap-3">
                  <Label htmlFor="price">Price</Label>
                  <Input
                  id="amount"
                  type="number"
                  {...form.register("amount")}
                  readOnly={selectedPlan?.name !== "Exclusive"}
                  placeholder={selectedPlan?.name === "Exclusive" ? "Enter price" : ""}
                />
              </div>
              <div className="flex items-center gap-3">
              <Controller
                  control={form.control}
                  name="isRoi"
                  render={({ field }) => (
                    <>
                      <Checkbox id="roi" checked={field.value} onCheckedChange={field.onChange} />
                      <Label htmlFor="roi">isRoi</Label>
                    </>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="reset" variant="outline" size="sm" disabled={submitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" size="sm" disabled={!selectedPlanId || submitting}>
              {submitting && <Loader2 className="size-5 animate-spin" />}
                Purchase
              </Button>
            </DialogFooter>

          </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}
