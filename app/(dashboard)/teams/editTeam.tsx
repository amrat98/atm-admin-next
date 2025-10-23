"use client";
import { useState, useEffect, useRef } from "react"
import { useUser } from "@/lib/userContext";
import axios from "axios";
import { apiConfig } from "@/config/apiConfig";
import { toast } from "sonner";
import z from "zod";
import { Loader2, Pencil, Upload, X } from "lucide-react";
import { Row, Table } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { fileToBase64 } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  // redirectionLink: z.string().refine(
  //   (val) => !val || val.trim() === "" || z.string().url().safeParse(val).success,
  //   { message: "Enter a valid link" }
  // ),
  status: z.string(),
  thumbnail: z
  .any()
  .optional()
  .refine(
    (file) =>
      file === undefined || // allow no file upload (skip validation)
      (file instanceof FileList && file.length === 1),
    { message: "Image is required" }
  )
  .refine(
    (file) =>
      file === undefined || (file[0] && file[0].size <= MAX_FILE_SIZE),
    { message: "Image size must be less than 1MB" }
  )
  .refine(
    (file) =>
      file === undefined || ACCEPTED_IMAGE_TYPES.includes(file[0]?.type),
    { message: "Allowed formats are jpg, png, webp" }
  )

})


export function EditTeam({row,table}: { row: Row<z.infer<typeof recentUserSchema>>; table: Table<z.infer<typeof recentUserSchema>>;}){
    const { token, setToken } = useUser();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    // Control the open state of the sheet
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // Control whether to show file input
  const [showFileInput, setShowFileInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
        title: row.original.title,
        shortDescription: row.original.shortDescription,
        //thumbnail: row.original.thumbnail,
        thumbnail: undefined,
        // redirectionLink: row.original.redirectionLink,
        status: row.original.status
        },
    });

    const { dirtyFields } = form.formState;

    // Reset form whenever the sheet closes
  useEffect(() => {
    if (!isSheetOpen) {
      form.reset();
      setShowFileInput(false);
    }
  }, [isSheetOpen, form]);


    const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
        setSubmitting(true);
      try{
        // Build data, merge original with changed fields only
      const updatedData = {
        _id: row.original._id,
        title: row.original.title,
        shortDescription: row.original.shortDescription,
        thumbnail: row.original.thumbnail,
        // redirectionLink: row.original.redirectionLink,
        status: row.original.status,
      };

      if (dirtyFields.title) updatedData.title = formData.title;
      if (dirtyFields.shortDescription)
        updatedData.shortDescription = formData.shortDescription;
      if (dirtyFields.status) updatedData.status = formData.status;

      if (showFileInput && formData.thumbnail && formData.thumbnail instanceof FileList && formData.thumbnail.length > 0) {
        updatedData.thumbnail = await fileToBase64(formData.thumbnail[0]);
      }

      const response = await axios.post(apiConfig.teams.update, updatedData, {
        headers: { token },
      });

            toast.success(response.data?.responseMessage || "Member Updated successfully!");
            setIsSheetOpen(false);
            table.setSorting([]);
            table.setGlobalFilter("");
            table.setPageIndex(0);
        } catch (error: unknown) {
            let errorMessage = "Failed to update Member."
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
        <span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="default" className="bg-green-600">
                <Pencil />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        </span>
        </SheetTrigger>
        <SheetContent className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Edit Team Member</SheetTitle>
            <SheetDescription>Edit the form to edit a member detail.</SheetDescription>
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
            
            {showFileInput ? (
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input id="thumbnail" type="file" onChange={e => field.onChange(e.target.files?.length ? e.target.files : undefined)} className="text-sm h-10" ref={fileInputRef} />
                      </FormControl>
                      <Button type="button" variant="destructive" size="icon" className="absolute right-0 top-0 h-full w-auto aspect-square" onClick={() => { field.onChange(undefined); if (fileInputRef.current) { fileInputRef.current.value = ""; } setShowFileInput(false)}}>
                        <X />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="thumbnail"
                render={() => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input id="thumbnailUrl" type="text" value={row.original.thumbnail || ""} className="text-sm h-10 pr-12" readOnly />
                      </FormControl>
                      <Button type="button" variant="secondary" size="icon" className="absolute right-0 top-0 h-full w-auto aspect-square" onClick={() => setShowFileInput(true)}>
                        <Upload />
                      </Button>
                    </div>
                    <Image src={row.original.thumbnail} alt="Blog Image" width={300} height={300} className="w-3xs mx-auto aspect-square max-w-full object-cover rounded-2xl"/>
                  </FormItem>
                )}
              />
            )}
            

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
                Edit
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