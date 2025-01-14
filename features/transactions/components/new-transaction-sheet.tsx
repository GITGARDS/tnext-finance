import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { insertTransactionSchema } from "@/db/schema";
import { useCallback } from "react";
import { z } from "zod";
import { useCreateTransactions } from "../api/use-create-transactions";
import { useNewTransaction } from "../hooks/use-new-transaction";
import TransactionForm from "./transaction-form";

const formSchema = insertTransactionSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export default function NewTransactionSheet() {
  const { isOpen, onClose } = useNewTransaction();

  const mutation = useCreateTransactions();

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
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>
            Create a new transaction to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <TransactionForm
          onSubmit={onSubmit}
          disabled={mutation.isPending}
          defaultValues={{ name: "" }}
        />
      </SheetContent>
    </Sheet>
  );
}
