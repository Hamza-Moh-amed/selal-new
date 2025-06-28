import Link from "next/link";

export default function Home() {
	return (
		<div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
				<h1 className="text-4xl font-bold">Selal</h1>

				<ul className="flex gap-4">
					<li>
						<Link
							className="border border-gray-300 rounded-md px-4 py-2"
							href="/sign-in"
						>
							Sign In
						</Link>
					</li>
					<li>
						<Link
							className="border border-gray-300 rounded-md px-4 py-2"
							href="/sign-up"
						>
							Sign Up
						</Link>
					</li>
				</ul>
			</main>
		</div>
	);
}
