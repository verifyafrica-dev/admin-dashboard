import { createFileRoute } from "@tanstack/react-router";
import { AdminPageShell } from "../-components/admin-page-shell";

export const Route = createFileRoute("/(auth)/_auth_layout/dashboard/invoices/")({
	component: InvoicesPage,
});

function InvoicesPage() {
	return (
		<AdminPageShell
			title="Invoices"
			description="Track billing invoices and payment status across tenants."
		/>
	);
}
