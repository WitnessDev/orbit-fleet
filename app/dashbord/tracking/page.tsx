import { Map } from "lucide-react";
import WorkspacePage from "@/components/WorkspacePage";

export default function TrackingPage() {
  return (
    <WorkspacePage
      title="Live Tracking"
      description="View the current position of every connected vehicle."
      icon={Map}
      emptyTitle="No vehicle locations available"
      emptyDescription="Add vehicles and connect GPS devices to begin viewing your fleet on the live map."
      actionLabel="Manage Vehicles"
      actionHref="/dashbord/vehicles"
    />
  );
}
