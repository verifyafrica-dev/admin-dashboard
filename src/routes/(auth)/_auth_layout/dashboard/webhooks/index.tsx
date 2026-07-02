import { createFileRoute } from "@tanstack/react-router";
import { AdminPageShell } from "../-components/admin-page-shell";

export const Route = createFileRoute("/(auth)/_auth_layout/dashboard/webhooks/")({
	component: WebhooksPage,
});

function WebhooksPage() {
	return (
		<AdminPageShell
			title="Webhooks"
			description="Monitor webhook deliveries and tenant webhook configuration."
		/>
	);
}
