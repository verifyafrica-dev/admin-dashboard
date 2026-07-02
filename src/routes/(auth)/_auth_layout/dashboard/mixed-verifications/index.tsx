import { createFileRoute } from "@tanstack/react-router";
import { AdminPageShell } from "../-components/admin-page-shell";

export const Route = createFileRoute(
	"/(auth)/_auth_layout/dashboard/mixed-verifications/",
)({
	component: MixedVerificationsPage,
});

function MixedVerificationsPage() {
	return (
		<AdminPageShell
			title="Mixed Verifications"
			description="Manage mixed verification templates and workflows."
		/>
	);
}
