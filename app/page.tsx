"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
	ArrowRight,
	Gift,
	Send,
	Download,
	QrCode,
	Link as LinkIcon,
	Zap,
	Shield,
	Smartphone,
	Star,
	Clock,
	CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { templateConfig } from "@/template.config";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";

export default function LandingPage() {
	const [mounted, setMounted] = useState(false);
	const logo = templateConfig.branding.logoDark; // Always use dark logo
	
	// Handle auto-redirect when wallet connects
	useAuthRedirect();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-md supports-[backdrop-filter]:bg-black/20">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              width={130}
              height={40}
              alt={templateConfig.branding.appName}
              className="w-24 sm:w-32"
            />
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium hover:underline"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium hover:underline"
            >
              How It Works
            </Link>
            <WalletConnectButton showAccountId={false} />
            <Link href="/dashboard" passHref>
              <Button variant="outline">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <WalletConnectButton size="sm" showAccountId={false} />
            <Link href="/dashboard" passHref>
              <Button size="sm" variant="outline">
                Dashboard
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 md:py-32">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 77, 157, 0.05) 0%, rgba(255, 138, 57, 0.05) 100%)",
          }}
        />
        <div
          className="absolute left-1/4 top-1/4 z-0 h-96 w-96 rounded-full blur-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 77, 157, 0.1) 0%, rgba(255, 138, 57, 0.1) 100%)",
          }}
        />
        <div className="container relative z-10 px-4">
          <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center md:text-left"
            >
              <h1 className="font-display mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
                Crypto
                <span className="text-gradient_gifto"> Gift Cards </span>
                at Light Speed
              </h1>
              <p className="mx-auto mb-6 max-w-lg text-lg text-muted-foreground sm:text-xl md:mx-0 md:mb-8">
                Send crypto tokens as digital gift cards that can be shared by
                link or QR and redeemed in seconds—no custodial account, no
                complicated UX.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row md:justify-start md:gap-4">
                <Link href="/dashboard" passHref className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="btn-gifto w-full px-6 py-3 text-base sm:w-auto md:px-8 md:py-4 md:text-lg"
                  >
                    <Gift className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                    Send a Gift
                  </Button>
                </Link>
                <Link href="/redeem" passHref className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-primary px-6 py-3 text-base text-primary hover:bg-primary/10 sm:w-auto md:px-8 md:py-4 md:text-lg"
                  >
                    Redeem Gift
                    <Download className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-sm"
            >
              <div
                className="relative flex h-[360px] w-full items-center justify-center overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #1B1243 0%, #0C0E25 100%)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 77, 157, 0.15) 0%, rgba(255, 138, 57, 0.15) 100%)",
                  }}
                ></div>
                <div
                  className="absolute right-4 top-4 h-24 w-24 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 77, 157, 0.3) 0%, transparent 70%)",
                  }}
                ></div>
                <div
                  className="absolute bottom-4 left-4 h-16 w-16 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(255, 138, 57, 0.2) 0%, transparent 70%)",
                  }}
                ></div>
                <div className="relative z-10 space-y-6 text-center">
                  <div
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF4D9D 0%, #FF8A39 100%)",
                    }}
                  >
                    <Gift className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-lg font-semibold text-white">
                    Gift Card Preview
                  </p>
                  <div className="space-y-3">
                    <p
                      className="font-mono text-xl font-bold"
                      style={{ color: "#29DFFF" }}
                    >
                      50.00 HBAR
                    </p>
                    <span className="badge-pending">Ready to Send</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/10 bg-black/30 py-16 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-lg p-6"
            >
              <p className="text-gradient_gifto mb-2 text-3xl font-bold md:text-4xl">
                0
              </p>
              <p className="text-sm text-muted-foreground">Custody Risk</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-lg p-6"
            >
              <p
                className="mb-2 text-3xl font-bold md:text-4xl"
                style={{ color: "#5EF58C" }}
              >
                &lt;3s
              </p>
              <p className="text-sm text-muted-foreground">Redemption Time</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg p-6"
            >
              <p
                className="mb-2 text-3xl font-bold md:text-4xl"
                style={{ color: "#29DFFF" }}
              >
                Multi-Chain
              </p>
              <p className="text-sm text-muted-foreground">EVM Compatible</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-lg p-6"
            >
              <p
                className="mb-2 text-3xl font-bold md:text-4xl"
                style={{ color: "#F9A23C" }}
              >
                $0
              </p>
              <p className="text-sm text-muted-foreground">Transaction Fees*</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-bold md:text-4xl"
            >
              <span className="text-gradient_gifto">Why Choose</span> Gifto?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-2xl text-xl text-muted-foreground"
            >
              The safest, fastest way to send crypto gifts across multiple blockchains
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Zero Custody Risk</h3>
              <p className="text-muted-foreground">
                Funds stay in your wallet until redemption. Scheduled
                transactions ensure complete security without
                custodial accounts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Lightning Fast Redemption
              </h3>
              <p className="text-muted-foreground">
                Recipients can claim gifts in under 3 seconds. Just scan QR
                code, connect wallet, and sign—instant transfer via smart contracts.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <QrCode className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Share by Link or QR
              </h3>
              <p className="text-muted-foreground">
                Send gifts via shareable links or QR codes. Works on any
                device—perfect for social media or in-person gifting.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">No Signup Required</h3>
              <p className="text-muted-foreground">
                Frictionless onboarding for recipients. They only need an EVM-compatible
                wallet—no accounts, no KYC, no complexity.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Mobile-First Design
              </h3>
              <p className="text-muted-foreground">
                Optimized for mobile devices with touch-friendly interfaces.
                Send and redeem gifts seamlessly on any device.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="rounded-xl border border-white/10 bg-black/40 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Multi-Chain Ready</h3>
              <p className="text-muted-foreground">
                Built for expansion to ETH, Polygon, Solana and more via
                Chainlink CCIP or Wormhole integration.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="border-y border-white/5 bg-black/20 py-20 backdrop-blur-sm"
      >
        <div className="container">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-4 text-3xl font-bold md:text-4xl"
            >
              How <span className="text-gradient_gifto">Gifto</span> Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto max-w-2xl text-xl text-muted-foreground"
            >
              Send crypto gifts in three simple steps using smart contract
              scheduled transactions
            </motion.p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center p-6 text-center"
            >
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  1
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <rect width="16" height="20" x="4" y="2" rx="2" ry="2"></rect>
                  <path d="M9 22v-4h6v4"></path>
                  <path d="M8 6h.01"></path>
                  <path d="M16 6h.01"></path>
                  <path d="M12 6h.01"></path>
                  <path d="M12 10h.01"></path>
                  <path d="M12 14h.01"></path>
                  <path d="M16 10h.01"></path>
                  <path d="M16 14h.01"></path>
                  <path d="M8 10h.01"></path>
                  <path d="M8 14h.01"></path>
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Create Your Gift</h3>
              <p className="text-muted-foreground">
                Choose HBAR or any HTS token, set the amount, and select either
                a specific recipient or create an open link with PIN protection.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center p-6 text-center"
            >
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  2
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                  <path d="M12 9v4"></path>
                  <path d="M12 17h.01"></path>
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Sign & Share</h3>
              <p className="text-muted-foreground">
                Sign a scheduled transaction that locks funds safely in your
                wallet. Share the gift link or QR code with your recipient.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col items-center p-6 text-center"
            >
              <div className="relative mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                  3
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8 text-primary"
                >
                  <path d="M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z"></path>
                  <path d="M8 12h8"></path>
                  <path d="M11 9h5"></path>
                  <path d="M11 15h5"></path>
                </svg>
              </div>
              <h3 className="mb-4 text-xl font-semibold">Instant Redemption</h3>
              <p className="text-muted-foreground">
                Recipient clicks the link, connects their wallet, and
                claims the gift. Smart contract instantly executes the transfer with confetti!
                🎉
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container relative z-10"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to Send Your First{" "}
              <span className="text-gradient_gifto">Gift</span>?
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Experience the future of crypto gifting across multiple blockchains. Zero
              custody, instant redemption, maximum security.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/dashboard" passHref>
                <Button size="lg" className="btn-gifto px-8 py-4 text-lg">
                  <Gift className="mr-2 h-5 w-5" />
                  Send Your First Gift
                </Button>
              </Link>
              <Link href="/redeem" passHref>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Redeem a Gift
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/30 py-12 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Image
                src={logo}
                width={130}
                height={40}
                alt={templateConfig.branding.appName}
                className="w-32"
              />
              <p className="text-sm text-muted-foreground">
                Send crypto gifts instantly across multiple blockchains. Zero custody
                risk, lightning-fast redemption, and seamless user experience.
              </p>
            </div>
            <div>
              <h3 className="mb-4 font-medium">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="#features"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Why Gifto?
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Send a Gift
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-medium">Learn More</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://ethereum.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Ethereum
                  </a>
                </li>
                <li>
                  <a
                    href="https://docs.soliditylang.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Smart Contracts
                  </a>
                </li>
                <li>
                  <a
                    href="https://polygon.technology"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Polygon
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-medium">Created By</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://github.com/olich97"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                      <path d="M9 18c-4.51 2-5-2-7-2"></path>
                    </svg>
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/olichdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="mr-2"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    x.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://olich.me"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                      <path d="M2 12h20"></path>
                      <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"></path>
                    </svg>
                    Website
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {templateConfig.branding.appName} -
              Revolutionizing crypto gifting across multiple blockchains. Built with ❤️
              for the decentralized future.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}