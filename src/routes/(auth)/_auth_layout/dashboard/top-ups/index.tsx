import { createFileRoute } from "@tanstack/react-router";
import { AdminPageShell } from "../-components/admin-page-shell";

export const Route = createFileRoute(
	"/(auth)/_auth_layout/dashboard/top-ups/",
)({
	component: TopUpsPage,
});

function TopUpsPage() {
	return (
		<AdminPageShell
			title="Top-ups"
			description="Review manual credits and wallet top-up activity."
		/>
	);
}
