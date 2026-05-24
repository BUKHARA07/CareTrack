import type { Metadata } from "next";
import "./globals.css";
import ConditionalFooter from "@/components/ConditionalFooter";
import SessionProvider from "@/components/providers/SessionProvider";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "CareTrack Clinic MRMS | MediCore Solutions",
  description:
    "Medical Record Management System for CareTrack Clinic - manage doctors, patients and diagnoses.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <SessionProvider session={session}>
          {children}
          <ConditionalFooter />
        </SessionProvider>
      </body>
    </html>
  );
}

