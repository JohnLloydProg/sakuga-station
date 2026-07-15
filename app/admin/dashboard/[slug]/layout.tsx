import SubNav from "./subNav";

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ slug: string }>;
}>) {
	const { slug } = await params;

	return (
		<div>
			<SubNav slug={slug} />
			{children}
		</div>
	);
}
