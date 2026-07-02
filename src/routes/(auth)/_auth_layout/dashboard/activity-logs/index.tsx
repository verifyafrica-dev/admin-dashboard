import { createFileRoute } from "@tanstack/react-router";
import { AdminPageShell } from "../-components/admin-page-shell";

export const Route = createFileRoute(
	"/(auth)/_auth_layout/dashboard/activity-logs/",
)({
	component: ActivityLogsPage,
});

function ActivityLogsPage() {
	return (
		<AdminPageShell
			title="Activity Logs"
			description="Audit platform activity for support and compliance workflows."
		/>
	);
}
