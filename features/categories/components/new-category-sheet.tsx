import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertCategorySchema } from "@/db/schema";
import { useCallback } from "react";
import { z } from "zod";
import { useCreateCategory } from "../api/use-create-category";
import { useNewCategory } from "../hooks/use-new-category";
import CategoryForm from "./category-form";

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export default function NewCategorySheet() {
  const { isOpen, onClose } = useNewCategory();

  const mutation = useCreateCategory();

  const onSubmit = useCallback(
    (values: FormValues) => {
      mutation.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      });
    },
    [mutation, onClose]
  );

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-0">
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>
            Create a new category to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <CategoryForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
}
