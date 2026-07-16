interface NewPostEmailProps {
	postTitle: string;
	postUrl: string;
}

export default function PublishedPostEmail({
	postTitle = "Subaru’s Power: Strong Mentality?",
	postUrl = "https://sakugastation.com/posts/subarus-power",
}: NewPostEmailProps) {
	return (
		<div style={mainStyle}>
			<table
				align="center"
				role="presentation"
				cellSpacing="0"
				cellPadding="0"
				border={0}
				width="100%"
				style={containerStyle}
			>
				<thead>
					<tr>
						<td style={headerSection}>
							<h1 style={logoStyle}>
								Sakuga<span style={logoAccentStyle}>Station</span>
							</h1>
						</td>
					</tr>
				</thead>

				<tbody>
					<tr>
						<td style={contentSection}>
							<p style={greetingText}>Hello Reader,</p>

							<p style={announcementText}>
								We just published a brand new post that we think you&apos;ll
								love:
							</p>

							<h2 style={titleText}>&ldquo;{postTitle}&rdquo;</h2>

							<div style={buttonContainer}>
								<a href={postUrl} style={buttonStyle}>
									Read the full post
								</a>
							</div>
						</td>
					</tr>
				</tbody>

				<tfoot>
					<tr>
						<td style={footerSection}>
							<p style={footerText}>
								© 2026 Sakuga Station. All rights reserved.
							</p>
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

/* =========================================================
   inline CSS styles (Optimized for standard HTML emails)
   ========================================================= */

const mainStyle = {
	backgroundColor: "#F9F6F0",
	fontFamily:
		'"Josefin Sans", "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
	padding: "40px 10px",
};

const containerStyle = {
	backgroundColor: "#ffffff",
	border: "1px solid #EFE5D5",
	borderRadius: "12px",
	maxWidth: "520px",
	margin: "0 auto",
	overflow: "hidden",
};

const headerSection = {
	backgroundColor: "#EFE5D5",
	padding: "24px",
	textAlign: "center" as const,
};

const logoStyle = {
	margin: "0",
	fontSize: "24px",
	fontWeight: "bold",
	color: "#2C302E",
	letterSpacing: "-0.5px",
};

const logoAccentStyle = {
	color: "#9CAF88",
	marginLeft: "2px",
};

const contentSection = {
	padding: "40px 32px",
};

const greetingText = {
	fontSize: "16px",
	color: "#827C73",
	margin: "0 0 16px 0",
};

const announcementText = {
	fontSize: "16px",
	lineHeight: "24px",
	color: "#2C302E",
	margin: "0 0 24px 0",
};

const titleText = {
	fontSize: "22px",
	fontWeight: "bold",
	lineHeight: "30px",
	color: "#2C302E",
	margin: "0 0 32px 0",
};

const buttonContainer = {
	textAlign: "center" as const,
};

const buttonStyle = {
	backgroundColor: "#9CAF88",
	color: "#2C302E",
	borderRadius: "9999px",
	fontSize: "16px",
	fontWeight: "bold",
	textDecoration: "none",
	textAlign: "center" as const,
	display: "inline-block",
	padding: "12px 32px",
};

const footerSection = {
	padding: "24px 32px",
	borderTop: "1px solid #EFE5D5",
	backgroundColor: "#F9F6F0",
};

const footerText = {
	fontSize: "12px",
	color: "#827C73",
	textAlign: "center" as const,
	margin: "0",
};
