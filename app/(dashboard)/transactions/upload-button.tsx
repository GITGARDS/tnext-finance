import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useCSVReader } from "react-papaparse";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpload: (results: any) => void;
};

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader();
  return (
    <CSVReader onUploadAccepted={onUpload}>
      {(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { getRootProps }: any
      ) => (
        <Button size={"sm"} className="w-full lg:auto" {...getRootProps()}>
          <Upload className="size-4 mr-2" />
          Import
        </Button>
      )}
    </CSVReader>
  );
};
