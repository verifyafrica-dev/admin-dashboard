import { z } from "zod";

export const CustomMessageRequestSchema = z.object({
	subject: z.string().trim().min(1, "Subject is required").max(200),
	message: z.string().trim().min(1, "Message is required"),
	recipient_emails: z
		.array(z.string().email("Enter a valid email"))
		.min(1, "Add at least one recipient"),
});

export type CustomMessageRequestPayload = z.infer<
	typeof CustomMessageRequestSchema
>;

export const CustomMessageResultSchema = z.object({
	queued_count: z.number(),
	recipient_emails: z.array(z.string()),
});

export type CustomMessageResult = z.infer<typeof CustomMessageResultSchema>;
