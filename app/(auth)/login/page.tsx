"use client"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2, Shield, Eye, EyeOff } from "lucide-react"
import { metaConfig } from "@/config/metaConfig"
import { apiConfig } from "@/config/apiConfig"
import { useRouter } from "next/navigation"

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(4, { message: "Password must be at least 4 characters." }),
});

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        email: "",
        password: "",
        },
    });

    const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
        setSubmitting(true);
        try {
            const response = await axios.post(apiConfig.login, formData);
            const successMessage = response.data?.responseMessage || "Login successful";
            toast.success(successMessage);
            sessionStorage.setItem("email", formData.email);
            router.push("/otp");
        } catch (error: unknown) {
            let errorMessage = "Login failed"
            if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
                errorMessage = error.response.data.responseMessage;
            }
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("type");
        sessionStorage.removeItem("userType");
      }, []);

  return (
    <div className="min-h-screen flex flex-col gap-10 items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">ATMC Admin Panel</CardTitle>
            <CardDescription>
                Sign in to your admin account
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                        <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                    <FormControl>
                        <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...field}
                        />
                    </FormControl>
                        <Button onClick={() => setShowPassword(!showPassword)} type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full w-auto aspect-square text-muted-foreground">
                        {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
                    </Button>
                    </div>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button className="w-full" size="lg" type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="size-5 animate-spin" />}
                    Login
                </Button>
            </form>
            </Form>
            </CardContent>
        </Card>
        <div className="flex w-full justify-center">
        <div className="text-sm text-muted-foreground">{metaConfig.copyright}</div>
      </div>
    </div>
  );
}