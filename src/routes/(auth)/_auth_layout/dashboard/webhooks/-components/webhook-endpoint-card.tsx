import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "#/components/ui/alert";
import { Button } from "#/components/ui/button";
import { getWebhookEndpointUrl } from "../-data";

export function WebhookEndpointCard() {
	const [copied, setCopied] = useState(false);
	const webhookUrl = getWebhookEndpointUrl();

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(webhookUrl);
			setCopied(true);
			toast.success("Webhook link copied to clipboard");
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error("Failed to copy webhook link");
		}
	};

	return (
		<Alert className="border-blue-200 bg-blue-50 text-blue-950">
			<AlertTitle className="text-sm font-semibold">
				Webhook Endpoint
			</AlertTitle>
			<AlertDescription className="mt-3">
				<div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2">
					<code className="flex-1 break-all font-mono text-sm text-foreground">
						{webhookUrl}
					</code>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						onClick={() => void handleCopy()}
						title={copied ? "Copied" : "Copy to clipboard"}
					>
						{copied ? (
							<CheckIcon className="size-4 text-emerald-600" />
						) : (
							<CopyIcon className="size-4" />
						)}
					</Button>
				</div>
			</AlertDescription>
		</Alert>
	);
}
