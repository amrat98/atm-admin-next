"use client"
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Loader2, Shield, ArrowLeft, Clock } from "lucide-react"
import { metaConfig } from "@/config/metaConfig"
import { apiConfig } from "@/config/apiConfig"
import { useRouter } from "next/navigation"
import { useUser } from "@/lib/userContext"

const FormSchema = z.object({
    emailOtp: z.string().min(4, {message: "Your one-time OTP must be 4 characters."})
});

export default function OTPPage() {
    const router = useRouter();
    const { setToken } = useUser();
    const [email, setEmail] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const email = sessionStorage.getItem("email");
            setEmail(email);
            if (!email) {
            router.push("/login");
            }
        }
        // Start countdown timer
    const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
  
      return () => clearInterval(timer);
    }, [router]);


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        emailOtp: ""
        },
    });

    const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
        setSubmitting(true);
        try {
            // Include email in request payload
            const payload = { ...formData, email: email };
            const response = await axios.post(apiConfig.otpVerify, payload);
            const successMessage = response.data?.responseMessage || "Login successful";

            // Save to sessionStorage and cookie (token)
            sessionStorage.setItem("email", response.data?.result?.email);
            sessionStorage.setItem("type", response.data?.result?.type);
            sessionStorage.setItem("userType", response.data?.result?.userType);

            // Save token using context setToken and sessionStorage
            sessionStorage.setItem("token", response.data?.result?.token);
            setToken(response.data?.result?.token);

            toast.success(successMessage);
            router.push("/dashboard");

        } catch (error: unknown) {
            let errorMessage = "OTP failed"
            if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
                errorMessage = error.response.data.responseMessage;
            }
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleResendOTP = async () => {
        setTimeLeft(60);
        setCanResend(false);
        setSubmitting(true);
        // setError("");
        // setOtp("");
        try {
            const response = await axios.post(apiConfig.otpResend, {email: email});
            const successMessage = response.data?.responseMessage || "Login successful";
            sessionStorage.setItem("email", response.data?.result?.email);
            sessionStorage.setItem("type", response.data?.result?.type);
            sessionStorage.setItem("userType", response.data?.result?.userType);

            // Save token using context setToken and sessionStorage
            sessionStorage.setItem("token", response.data?.result?.token);
            setToken(response.data?.result?.token);
            toast.success(successMessage);
///            router.push("/dashboard");

        } catch (error: unknown) {
            let errorMessage = "OTP failed"
            if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
                errorMessage = error.response.data.responseMessage;
            }
            // if(errorMessage === "OTP expired"){
            //     router.push("/login");
            // }
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
            // Restart timer
            const timer = setInterval(() => {
              setTimeLeft((prev) => {
                if (prev <= 1) {
                  setCanResend(true);
                  clearInterval(timer);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
        }
      };

      const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
      };

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Verify OTP</CardTitle>
            <CardDescription>
            Enter the 4-digit OTP to complete authentication
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="emailOtp"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel className="justify-center">One-Time Password</FormLabel>
                        <FormControl>
                            <InputOTP maxLength={4} {...field}>
                            <InputOTPGroup  className="mx-auto">
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                            </InputOTPGroup>
                            </InputOTP>
                        </FormControl>
                        <FormDescription className="text-center">
                            Please enter the one-time password sent to your email.
                        </FormDescription>
                        <FormMessage className="text-center" />
                        </FormItem>
                    )}
                />
                <Button className="w-full" size="lg" type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="size-5 animate-spin" />}
                    Verify OTP
                </Button>
                {!canResend ? (
                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Resend in {formatTime(timeLeft)}</span>
                </div>
                ) : (
                <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleResendOTP}>
                    {submitting && <Loader2 className="size-5 animate-spin" />}
                    Resend OTP
                </Button>
                )}
            </form>
            </Form>
            </CardContent>
            <CardFooter className="justify-center">
                <Button type="button" variant="link" className="text-sm" onClick={() => router.push("/login")}>
                    <ArrowLeft className="size-4" />
                    Back to Login
                </Button>
            </CardFooter>
        </Card>
        <div className="flex w-full justify-center">
        <div className="text-sm text-muted-foreground">{metaConfig.copyright}</div>
      </div>
    </div>
  );
}