import { useEffect, useMemo, useState } from "react";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Label } from "#/components/ui/label";
import { Textarea } from "#/components/ui/textarea";

const REJECTION_REASONS = [
	"Company registration document is invalid or expired",
	"Directors identification documents are invalid or expired",
	"UBO declarations are incomplete or unsigned",
	"Proof of business address is unclear or outdated",
	"Proof of directors address is unclear or outdated",
	"Uploaded compliance documents are illegible",
	"Regulatory or operating licenses are invalid",
] as const;

export function RejectComplianceDialog({
	open,
	isRevokingApproval,
	isSubmitting,
	onOpenChange,
	onSubmit,
}: {
	open: boolean;
	isRevokingApproval?: boolean;
	isSubmitting?: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (reason: string) => void;
}) {
	const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
	const [customReason, setCustomReason] = useState("");

	useEffect(() => {
		if (!open) {
			setSelectedReasons([]);
			setCustomReason("");
		}
	}, [open]);

	const formattedReason = useMemo(() => {
		const reasons = [...selectedReasons];
		const trimmedCustomReason = customReason.trim();

		if (trimmedCustomReason) {
			reasons.push(`Other: ${trimmedCustomReason}`);
		}

		return reasons.map((reason, index) => `${index + 1}. ${reason}`).join("\n");
	}, [customReason, selectedReasons]);

	const canSubmit =
		selectedReasons.length > 0 || customReason.trim().length > 0;

	const toggleReason = (reason: string) => {
		setSelectedReasons((current) =>
			current.includes(reason)
				? current.filter((item) => item !== reason)
				: [...current, reason],
		);
	};

	const handleSubmit = () => {
		if (!canSubmit) {
			return;
		}

		onSubmit(formattedReason);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen && isSubmitting) {
					return;
				}

				onOpenChange(nextOpen);
			}}
		>
			<DialogContent className="sm:max-w-lg" showCloseButton={!isSubmitting}>
				<DialogHeader>
					<DialogTitle>
						{isRevokingApproval
							? "Revoke Compliance Approval"
							: "Reject Compliance Application"}
					</DialogTitle>
					<DialogDescription>
						{isRevokingApproval
							? "This disables the tenant's verified compliance status and notifies them with your reason."
							: "Select one or more reasons for rejecting this KYB application."}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label>Rejection Reasons</Label>
						<div className="space-y-2 rounded-lg border p-3">
							{REJECTION_REASONS.map((reason) => (
								<label
									key={reason}
									className="flex items-start gap-2 text-sm"
								>
									<input
										type="checkbox"
										className="mt-1"
										checked={selectedReasons.includes(reason)}
										onChange={() => toggleReason(reason)}
										disabled={isSubmitting}
									/>
									<span>{reason}</span>
								</label>
							))}
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="custom-rejection-reason">
							Other / Custom Reason
						</Label>
						<Textarea
							id="custom-rejection-reason"
							value={customReason}
							onChange={(event) => setCustomReason(event.target.value)}
							placeholder="Add any additional context for the tenant..."
							rows={3}
							disabled={isSubmitting}
						/>
					</div>
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button
						variant="destructive"
						onClick={handleSubmit}
						disabled={!canSubmit || isSubmitting}
					>
						{isSubmitting
							? "Saving..."
							: isRevokingApproval
								? "Revoke Approval"
								: "Reject Application"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
