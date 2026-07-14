export default function ErrorDisplay({
	errors,
}: {
	errors: Record<string, string[] | undefined>;
}) {
	return (
		<div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded text-sm text-red-700">
			<p className="font-josefin font-bold mb-2">
				Please fix the following errors:
			</p>
			<ul className="list-disc list-inside space-y-1">
				{Object.entries(errors).map(([field, messages]) =>
					messages?.map((message) => (
						<li key={message}>
							<span className="font-semibold capitalize">
								{field.replace(/([A-Z])/g, " $1")}:
							</span>{" "}
							{message}
						</li>
					)),
				)}
			</ul>
		</div>
	);
}
