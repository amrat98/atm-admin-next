"use client";
import { useState, useEffect } from "react"
import { useUser } from "@/lib/userContext";
import axios from "axios";
import { apiConfig } from "@/config/apiConfig";
import { toast } from "sonner";
import z from "zod";
import { Loader2, Plus } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { fileToBase64 } from "@/lib/utils";
import { Table } from "@tanstack/react-table";
import { useRouter } from "next/navigation"

export const recentUserSchema = z.object({
  _id: z.string(),
  title: z.string(),
  shortDescription: z.string(),
  thumbnail: z.string(),
  redirectionLink: z.string(),
  status: z.string(),
  createdAt: z.date()
});

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const FormSchema = z.object({
    title: z.string().min(3, "Name is required and must be at least 3 characters"),
    shortDescription: z.string().min(3, "Designation must be at least 3 characters"),
    // redirectionLink: z.string().optional().refine(
    //   (val) => !val || val.trim() === "" || z.string().url().safeParse(val).success,
    //   { message: "Enter a valid link" }
    // ),
    status: z.string(),
    thumbnail: z.any()
    .refine(file => file instanceof FileList && file.length === 1, {
      message: "Image is required"
    })
    .refine(file => file && file[0].size <= MAX_FILE_SIZE, {
      message: "Image size must be less than 1MB"
    })
    .refine(file => file && ACCEPTED_IMAGE_TYPES.includes(file[0].type), {
      message: "Allowed formats are jpg, png, webp"
    }),
  })


  export function AddTeam({table}: { table: Table<z.infer<typeof recentUserSchema>>}){
  const { token, setToken } = useUser();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
    // Control the open state of the sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
      title: "",
      shortDescription: "",
      thumbnail: "",
      // redirectionLink: "#",
      status: "ACTIVE"
      },
  });

    // Reset form whenever the sheet closes
  useEffect(() => {
    if (!isSheetOpen) {
      form.reset();
    }
  }, [isSheetOpen, form]);


    const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
        setSubmitting(true);
        const fileList = formData.thumbnail;
        const file = fileList[0];
        const thumbnailBase64 = await fileToBase64(file);
        try {
            const data = { ...formData,
                thumbnail: thumbnailBase64,
                redirectionLink: "#",
             };
            const response = await axios.post(apiConfig.teams.add, data, { headers: { token } })

            toast.success(response.data?.responseMessage || "Member added successfully!");
            setIsSheetOpen(false);
            table.setSorting([]);
            table.setGlobalFilter("");
            table.setPageIndex(0);

        } catch (error: unknown) {
            let errorMessage = "Failed to Add Member."
            if (axios.isAxiosError(error) && error.response?.data?.responseMessage) {
                errorMessage = error.response.data.responseMessage;
            }
            if(errorMessage === "jwt expired"){
              setToken("");
              router.push("/login");
          }else{
              toast.error(errorMessage);
          }
        } finally {
            setSubmitting(false);
        }
    };


    return (
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
        <Button variant="outline" size="sm">
        <Plus />
        <span className="hidden lg:inline">Add Member</span>
        </Button>
        </SheetTrigger>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add Team Member</SheetTitle>
            <SheetDescription>Fill the form to create a new member entry.</SheetDescription>
          </SheetHeader>
          <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-4 space-y-6">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input id="title" type="text" placeholder="Name" {...field} className="text-sm h-10" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="shortDescription"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                        <Input id="shortDescription" type="text" placeholder="Designation" {...field} className="text-sm h-10" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                        <Input id="thumbnail" type="file" placeholder="Image" onChange={e => field.onChange(e.target.files)} className="text-sm h-10" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {/* <FormField
                control={form.control}
                name="redirectionLink"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                        <Input id="redirectionLink" type="url" placeholder="www.google.com/" {...field} className="text-sm h-10" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            /> */}
            <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                    <Select value={field.value}
                            onValueChange={field.onChange}
                            aria-labelledby="status">
                        <SelectTrigger id="status"  className="text-sm h-10 w-full">
                            <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="BLOCK">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            </div>
          <SheetFooter>
            <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="size-5 animate-spin" />}
                Add
            </Button>
            <SheetClose asChild>
              <Button variant="outline" disabled={submitting}>Cancel</Button>
            </SheetClose>
          </SheetFooter>
        </form>
        </Form>
        </SheetContent>
      </Sheet>
    )
  }