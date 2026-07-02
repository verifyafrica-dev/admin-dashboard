import { createFileRoute } from "@tanstack/react-router";
import { AdminPageShell } from "../-components/admin-page-shell";

export const Route = createFileRoute("/(auth)/_auth_layout/dashboard/users/")({
	component: UsersPage,
});

function UsersPage() {
	return (
		<AdminPageShell
			title="Users"
			description="View and manage platform user accounts."
		/>
	);
}
