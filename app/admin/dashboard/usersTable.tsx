"use client";

import { useState } from "react";
import type { User } from "@/lib/db/schema/users";
import RegisterModal from "./registerModal";

export default function UserTable({ users }: { users: User[] }) {
	const [selectedUser, selectUser] = useState<User | null>(null);
	const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

	return (
		<div className="w-full">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
				<h1 className="font-josefin text-4xl font-bold text-accent">Users</h1>

				<div className="flex items-center w-full sm:w-auto">
					<button
						type="button"
						className="w-full sm:w-auto px-6 py-2 bg-accent text-foreground font-josefin font-bold rounded-md hover:bg-foreground hover:text-background transition"
						onClick={() => setIsRegisterModalOpen(true)}
					>
						Register New User
					</button>
				</div>
			</div>

			<div className="flex flex-col gap-4 md:hidden">
				{users.map((user) => (
					<div
						key={`mobile-${user.id}`}
						className="w-full p-4 rounded-xl border bg-secondary/30 border-secondary/50"
					>
						<div className="flex justify-between items-start gap-3 mb-3">
							<h3 className="font-josefin font-bold text-lg text-foreground leading-tight">
								{user.firstName} {user.lastName}
							</h3>
							<div className="flex gap-1.5 shrink-0">
								{user.isAdmin && (
									<span className="font-josefin font-semibold text-[10px] rounded-full px-2 py-0.5 bg-accent text-foreground">
										Admin
									</span>
								)}
							</div>
						</div>

						<div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-medium border-t border-secondary/40 pt-3 text-foreground/80">
							<div className="col-span-2">
								<span className="text-foreground/50 block font-josefin">
									Email Address
								</span>
								<span className="text-sm font-semibold block truncate">
									{user.email}
								</span>
							</div>
							<div>
								<span className="text-foreground/50 block font-josefin">
									Role Status
								</span>
								<span>{user.isAdmin ? "Administrator" : "User"}</span>
							</div>
							<div>
								<span className="text-foreground/50 block font-josefin">
									Joined On
								</span>
								<span>
									{user.createdAt
										? new Date(user.createdAt).toLocaleDateString()
										: "-"}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="w-full overflow-x-auto rounded-t-md hidden md:block overflow-hidden rounded-xl border border-accent/20">
				<div className="grid grid-cols-[2fr_2fr_1fr_1fr] text-center items-center">
					<div className="bg-accent font-josefin font-bold py-4 text-left pl-6 rounded-tl-xl">
						Name
					</div>
					<div className="bg-accent font-josefin font-bold py-4 border-l border-background">
						Email
					</div>
					<div className="bg-accent font-josefin font-bold py-4 border-l border-background">
						Role
					</div>
					<div className="bg-accent font-josefin font-bold py-4 border-l border-background rounded-tr-xl">
						Joined On
					</div>
				</div>

				{users.map((user, index) => {
					const rowBg = index % 2 === 0 ? "bg-secondary/50" : "bg-background";
					const borderbottom =
						index === users.length - 1 ? "" : "border-b border-accent/20";

					return (
						<button
							type="button"
							key={user.id}
							onClick={() => selectUser(user)}
							className={`grid grid-cols-[2fr_2fr_1fr_1fr] w-full text-center items-stretch ${rowBg} cursor-pointer hover:bg-secondary/80 transition-colors duration-150 group border-accent ${borderbottom} ${selectedUser === user ? "bg-secondary/80" : "bg-transparent"}`}
						>
							<div
								className={`flex items-center gap-5 py-5 text-left px-6 font-medium border-accent group-hover:text-accent font-josefin transition-colors ${selectedUser === user ? "text-accent" : "text-foreground"}`}
							>
								<p className="h-fit">
									{user.firstName} {user.lastName}
								</p>
							</div>

							<div className="flex items-center justify-center py-5 border-l border-accent px-4 truncate">
								{user.email}
							</div>

							<div className="flex items-center justify-center py-5 border-l border-accent">
								{user.isAdmin ? (
									<span className="font-josefin font-semibold text-xs rounded-full px-3 py-1 bg-accent group-hover:bg-foreground group-hover:text-background transition-colors">
										Admin
									</span>
								) : (
									<span>User</span>
								)}
							</div>

							<div className="flex items-center justify-center py-5 border-l border-accent">
								{user.createdAt
									? new Date(user.createdAt).toLocaleDateString()
									: "-"}
							</div>
						</button>
					);
				})}
			</div>

			<RegisterModal
				isOpen={isRegisterModalOpen}
				onClose={() => setIsRegisterModalOpen(false)}
			/>
		</div>
	);
}
