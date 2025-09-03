import Sidebar from "@/components/layout/sidebar";
import type { Metadata } from "next";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { cn } from "@/lib/utils";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { WalletConnectButton } from "@/components/wallet-connect-button";
export const metadata: Metadata = {
	title: "Gifto | Crypto Gift Cards Dashboard",
	description: "Send and receive crypto gifts across multiple blockchains",
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AuthProvider requireAuth={true}>
			<div className="h-screen bg-transparent flex flex-col">
				{/* Mobile Header */}
				<div className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-black/30 backdrop-blur-sm flex-shrink-0 h-16">
					<MobileSidebar />
					<div className="flex justify-center items-center">
						<h1 className="text-xl font-bold text-white">Gifto</h1>
					</div>
					<WalletConnectButton size="sm" showAccountId={false} />
				</div>
				
				<div className="flex flex-1 overflow-hidden">
					<Sidebar className="hidden md:block" />
					<div className="flex-1 overflow-hidden">
						<main className="h-full p-4 md:p-6 overflow-y-auto">
							{children}
							<Toaster richColors />
							<SpeedInsights />
						</main>
					</div>
				</div>
			</div>
		</AuthProvider>
	);
}
