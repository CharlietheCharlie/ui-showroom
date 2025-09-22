import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggler } from "@/components/ThemeToggler";
import ClientOnlyLiquidEther from "@/components/background/ClientOnlyLiquidEther";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Charlie's UI Showroom",
  description: "A collection of UI components and features built with React and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased")}>
        <Suspense fallback={<div>Loading... </div>}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggler />
            </div>
            <div className="fixed inset-0 -z-10">
              {/* Only render this component in non-GitHub-Actions environments */}
              {!process.env.GITHUB_ACTIONS && (
                <ClientOnlyLiquidEther
                  colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
                  mouseForce={20}
                  cursorSize={100}
                  isViscous={true}
                  viscous={30}
                  iterationsViscous={32}
                  iterationsPoisson={32}
                  resolution={0.5}
                  autoSpeed={0.2}
                  autoIntensity={2.2}
                />
              )}
            </div>
            {children}
          </ThemeProvider>
        </Suspense>
      </body>
    </html>
  );
}
