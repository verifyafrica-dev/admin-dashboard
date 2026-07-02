import { createFileRoute } from "@tanstack/react-router";
import { AdminPageShell } from "../-components/admin-page-shell";

export const Route = createFileRoute(
	"/(auth)/_auth_layout/dashboard/verification-settings/",
)({
	component: VerificationSettingsPage,
});

function VerificationSettingsPage() {
	return (
		<AdminPageShell
			title="Verification Settings"
			description="Configure platform verification products and defaults."
		/>
	);
}
