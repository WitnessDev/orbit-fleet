import { Activity } from "lucide-react";
import WorkspacePage from "@/components/WorkspacePage";

export default function DevicesPage() {
  return (
    <WorkspacePage
      title="Devices"
      description="Monitor GPS devices and their connection status."
      icon={Activity}
      emptyTitle="No devices connected"
      emptyDescription="Connected GPS devices will appear here with their latest status and location."
    />
  );
}
