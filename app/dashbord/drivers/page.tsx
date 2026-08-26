import { Users } from "lucide-react";
import WorkspacePage from "@/components/WorkspacePage";

export default function DriversPage() {
  return (
    <WorkspacePage
      title="Drivers"
      description="Manage driver profiles, assignments, and availability."
      icon={Users}
      emptyTitle="No drivers added"
      emptyDescription="Driver records will appear here when they are added to your fleet."
    />
  );
}
