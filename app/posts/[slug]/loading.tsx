export default function LoadingPostPage() {
	return (
		<div className="w-full min-h-screen bg-background px-4 py-8 md:py-12 text-foreground font-lato max-w-6xl mx-auto animate-pulse">
			<div className="w-full lg:w-4/5 aspect-video bg-secondary/40 rounded-lg mb-8 mx-auto border border-secondary/20" />

			<div className="space-y-3 mb-6">
				<div className="h-10 bg-accent/20 rounded w-11/12 lg:h-12" />
				<div className="h-10 bg-accent/20 rounded w-2/3 lg:h-12" />
			</div>

			<div className="flex flex-wrap gap-3 mb-6">
				<div className="h-8 bg-accent/20 rounded w-24" />
				<div className="h-8 bg-accent/20 rounded w-20" />
				<div className="h-8 bg-accent/20 rounded w-28" />
			</div>

			<div className="w-full border-t border-b border-foreground/10 py-4 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
				<div className="h-5 bg-secondary/60 rounded w-36" />
				<div className="h-5 bg-secondary/50 rounded w-48" />
			</div>

			<div className="space-y-3 mb-8">
				<div className="h-4 bg-secondary/70 rounded w-full" />
				<div className="h-4 bg-secondary/70 rounded w-full" />
				<div className="h-4 bg-secondary/70 rounded w-11/12" />
				<div className="h-4 bg-secondary/70 rounded w-4/5" />
			</div>

			<div className="space-y-8">
				<div className="space-y-3 mt-8">
					<div className="h-7 bg-accent/10 rounded w-1/2 lg:h-8" />
					<div className="h-4 bg-secondary/70 rounded w-full" />
					<div className="h-4 bg-secondary/70 rounded w-full" />
					<div className="h-4 bg-secondary/70 rounded w-5/6" />
				</div>

				<div className="w-2/3 aspect-video bg-secondary/30 rounded-lg mx-auto border border-secondary/20" />

				<div className="space-y-3">
					<div className="h-4 bg-secondary/70 rounded w-full" />
					<div className="h-4 bg-secondary/70 rounded w-full" />
					<div className="h-4 bg-secondary/70 rounded w-3/4" />
				</div>
			</div>

			<div className="flex flex-col mt-16 border-t border-secondary/60 pt-10">
				<div className="h-8 bg-secondary/80 rounded w-32 mb-6" />

				<div className="w-full h-32 bg-secondary/20 border border-secondary/30 rounded-lg mb-8" />

				<div className="space-y-4">
					{[1, 2].map((num) => (
						<div
							key={num}
							className="p-4 border-b border-secondary/30 flex flex-col gap-3"
						>
							<div className="flex justify-between items-center">
								<div className="h-4 bg-secondary/70 rounded w-24" />
								<div className="h-3 bg-secondary/40 rounded w-32" />
							</div>
							<div className="space-y-2">
								<div className="h-3.5 bg-secondary/60 rounded w-full" />
								<div className="h-3.5 bg-secondary/60 rounded w-5/6" />
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
