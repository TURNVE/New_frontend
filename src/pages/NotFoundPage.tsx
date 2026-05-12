import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { HomeIcon, CompassIcon } from "lucide-react";

export function NotFound() {
	return (
		<div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
			<Empty>
				<EmptyHeader>
					<EmptyTitle className="mask-b-from-20% mask-b-to-80% font-extrabold text-9xl text-blue-600">
						404
					</EmptyTitle>
					<EmptyDescription className="-mt-8 text-nowrap text-foreground/80">
						The page you're looking for might have been <br />
						moved or doesn't exist.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<div className="flex gap-2 flex-col sm:flex-row">
						<Button asChild className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap">
							<Link to="/">
								<HomeIcon className="size-4 mr-2" />
								Go Home
							</Link>
						</Button>

						<Button asChild variant="outline" className="whitespace-nowrap">
							<Link to="/industries">
								<CompassIcon className="size-4 mr-2" />
								Explore
							</Link>
						</Button>
					</div>
				</EmptyContent>
			</Empty>
		</div>
	);
}
