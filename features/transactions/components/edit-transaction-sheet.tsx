import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import { useConfirm } from "@/hooks/use-confirm";
import { Loader2 } from "lucide-react";
import { useCallback } from "react";
import { z } from "zod";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useGetTransaction } from "../api/use-get-transaction";
import { useOpenTransaction } from "../hooks/use-open-transaction";
import TransactionForm from "./transaction-form";

const formSchema = insertTransactionSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export default function EditTransactionSheet() {
  const { isOpen, onClose, id } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "You are about to delete this transaction"
  );

  const transactionQuery = useGetTransaction(id);

  const editMutation = useEditTransaction(id);

  const deleteMutation = useDeleteTransaction(id);

  const isPending = editMutation.isPending || deleteMutation.isPending;

  const isLoading = transactionQuery.isLoading;

  const onSubmit = useCallback(
    (values: FormValues) => {
      editMutation.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      });
    },
    [editMutation, onClose]
  );

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const defaultValues = transactionQuery.data
    ? { name: transactionQuery.data.name }
    : { name: "" };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-0">
          <SheetHeader>
            <SheetTitle>Edit Transaction</SheetTitle>
            <SheetDescription>Edit an existing transaction</SheetDescription>
          </SheetHeader>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center ">
              <Loader2 className="size-4 text-muted animate-spin" />
            </div>
          ) : (
            <TransactionForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
              onDelete={onDelete}
            />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
