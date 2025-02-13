import DataGrid from "@/components/data-card/data-grid";
import { DataCharts } from "@/components/data-charts/data-charts";
import { Suspense } from "react";

export default function DashBoardPage() {
  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Suspense>
        <DataGrid />
        <DataCharts />
      </Suspense>
    </div>
  );
}
