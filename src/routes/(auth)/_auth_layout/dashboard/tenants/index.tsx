import { createFileRoute } from "@tanstack/react-router";
import { AdminPageShell } from "../-components/admin-page-shell";

export const Route = createFileRoute("/(auth)/_auth_layout/dashboard/tenants/")({
	component: TenantsPage,
});

function TenantsPage() {
	return (
		<AdminPageShell
			title="Tenants"
			description="Manage organizations, billing details, and tenant configuration."
		/>
	);
}
