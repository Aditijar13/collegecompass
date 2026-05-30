import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";

export const metadata: Metadata = {
  title: { default: "CollegeCompass — Find Your Perfect College in India", template: "%s | CollegeCompass" },
  description: "Discover, compare and choose the best colleges in India. Real data on fees, placements, rankings and 500+ institutions.",
  keywords: ["college", "university", "India", "admission", "ranking", "engineering", "medical", "management", "NIRF"],
  openGraph: { title: "CollegeCompass", description: "Find your perfect college in India", type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
