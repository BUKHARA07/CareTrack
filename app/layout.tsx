import type { Metadata } from "next";
import "./globals.css";
import ConditionalFooter from "@/components/ConditionalFooter";
import SessionProvider from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "CareTrack Clinic MRMS | MediCore Solutions",
  description:
    "Medical Record Management System for CareTrack Clinic - manage doctors, patients and diagnoses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          {children}
          <ConditionalFooter />
        </SessionProvider>
      </body>
    </html>
  );
}
