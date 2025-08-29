import type { Metadata } from "next";
import "./globals.css";
import { Bricolage_Grotesque } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ResultProvider } from "@/context/ResultContext";
const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-bricolage-grotesque",
});

export const metadata: Metadata = {
  title: "Why2MeX | Find Company Reviews & Employee Feedback Instantly",
  description: "Why2MeX is an AI-powered platform for job seekers to explore company reviews, employee feedback, and workplace insights. Search any company name to uncover real experiences before your next career move.",
  keywords: ["Why2MeX", "Company Reviews", "Employee Feedback", "Workplace Insights"],
  authors: [{ name: "why2me" }],
  publisher: "why2me",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${bricolageGrotesque.variable} antialiased`}
        >
          <ResultProvider>
            {children}
          </ResultProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
