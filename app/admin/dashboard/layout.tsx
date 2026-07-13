import AdminHeader from "./header";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col items-center">
			<AdminHeader />
			<div className="w-full max-w-6xl">{children}</div>
		</div>
	);
}
