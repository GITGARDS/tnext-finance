import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequesType = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequesType>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (json: any) => {
      const response = await client.api.categories.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Category created!");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      toast.error("Failed to create category!");
    },
  });

  return mutation;
};
