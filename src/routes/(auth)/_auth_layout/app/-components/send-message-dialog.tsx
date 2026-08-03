import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { getV2ErrorMessage } from "#/api/http/shared";
import { useSendCustomMessageV2Mutation } from "#/api/http/v2/mail/mail.hooks";
import { Button } from "#/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";

type SendMessageFormValues = {
	subject: string;
	message: string;
	recipients: string;
};

const SendMessageFormSchema = z.object({
	subject: z.string().trim().min(1, "Subject is required").max(200),
	message: z.string().trim().min(1, "Message is required"),
	recipients: z
		.string()
		.trim()
		.min(1, "Add at least one recipient email")
		.superRefine((value, context) => {
			const emails = value
				.split(/[\n,;]+/)
				.map((email) => email.trim())
				.filter(Boolean);
			if (emails.length === 0) {
				context.addIssue({
					code: "custom",
					message: "Add at least one recipient email",
				});
				return;
			}
			for (const email of emails) {
				if (!z.string().email().safeParse(email).success) {
					context.addIssue({
						code: "custom",
						message: `Invalid email: ${email}`,
					});
					return;
				}
			}
		}),
});

function parseRecipientEmails(value: string): string[] {
	const seen = new Set<string>();
	const emails: string[] = [];
	for (const part of value.split(/[\n,;]+/)) {
		const email = part.trim().toLowerCase();
		if (!email || seen.has(email)) continue;
		seen.add(email);
		emails.push(email);
	}
	return emails;
}

export function SendMessageDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const sendMessageMutation = useSendCustomMessageV2Mutation();
	const isSubmitting = sendMessageMutation.isPending;

	const defaultValues: SendMessageFormValues = {
		subject: "",
		message: "",
		recipients: "",
	};

	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: SendMessageFormSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const result = await sendMessageMutation.mutateAsync({
					subject: value.subject.trim(),
					message: value.message.trim(),
					recipient_emails: parseRecipientEmails(value.recipients),
				});
				toast.success(
					`Message queued for ${result.queued_count} recipient${result.queued_count === 1 ? "" : "s"}.`,
				);
				form.reset();
				onOpenChange(false);
			} catch (error) {
				toast.error(getV2ErrorMessage(error));
			}
		},
	});

	useEffect(() => {
		if (!open) {
			form.reset();
		}
	}, [open, form]);

	const handleOpenChange = (nextOpen: boolean) => {
		if (isSubmitting) return;
		onOpenChange(nextOpen);
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-lg" showCloseButton={!isSubmitting}>
				<DialogHeader>
					<DialogTitle>Send custom message</DialogTitle>
					<DialogDescription>
						Send an announcement email to selected recipients using the
						VerifyAfrica custom message template.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={(event) => {
						event.preventDefault();
						void form.handleSubmit();
					}}
				>
					<FieldGroup className="gap-4">
						<form.Field name="subject">
							{(field) => (
								<Field
									className="flex flex-col gap-2"
									data-invalid={field.state.meta.errors.length > 0}
								>
									<FieldLabel htmlFor="custom-message-subject">
										Subject
									</FieldLabel>
									<Input
										id="custom-message-subject"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) =>
											field.handleChange(event.target.value)
										}
										disabled={isSubmitting}
										placeholder="e.g. Platform maintenance notice"
										aria-invalid={field.state.meta.errors.length > 0}
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							)}
						</form.Field>

						<form.Field name="message">
							{(field) => (
								<Field
									className="flex flex-col gap-2"
									data-invalid={field.state.meta.errors.length > 0}
								>
									<FieldLabel htmlFor="custom-message-body">
										Message
									</FieldLabel>
									<Textarea
										id="custom-message-body"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) =>
											field.handleChange(event.target.value)
										}
										disabled={isSubmitting}
										rows={8}
										placeholder="Write the announcement body…"
										aria-invalid={field.state.meta.errors.length > 0}
									/>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							)}
						</form.Field>

						<form.Field name="recipients">
							{(field) => (
								<Field
									className="flex flex-col gap-2"
									data-invalid={field.state.meta.errors.length > 0}
								>
									<FieldLabel htmlFor="custom-message-recipients">
										Recipients
									</FieldLabel>
									<Textarea
										id="custom-message-recipients"
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(event) =>
											field.handleChange(event.target.value)
										}
										disabled={isSubmitting}
										rows={4}
										placeholder={"one@example.com\ntwo@example.com"}
										aria-invalid={field.state.meta.errors.length > 0}
									/>
									<p className="text-xs text-muted-foreground">
										Enter one email per line (commas also accepted).
									</p>
									<FieldError errors={field.state.meta.errors} />
								</Field>
							)}
						</form.Field>
					</FieldGroup>

					<DialogFooter className="mt-6">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Sending…" : "Send message"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
