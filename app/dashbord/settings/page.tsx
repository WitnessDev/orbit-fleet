import { Settings } from "lucide-react";
import WorkspacePage from "@/components/WorkspacePage";

export default function SettingsPage() {
  return (
    <WorkspacePage
      title="Settings"
      description="Configure your Orbit Fleet workspace."
      icon={Settings}
      emptyTitle="Workspace settings"
      emptyDescription="Fleet preferences and account settings will be available here."
    />
  );
}
