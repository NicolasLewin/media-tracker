import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { headers } from 'next/headers'
import { Header } from "@/components/Header";
import { ParticlesProvider } from "./providers/ParticlesProvider";
import { UserProvider } from "@/contexts/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Media Tracker",
  description: "Keep track of your medias",
};

async function getUser() {
  const headersList = headers()
  const token = headersList.get('cookie')?.split(';').find(c => c.trim().startsWith('token='))

  if (!token) {
    return null
  }

  try {
    const response = await fetch('http://localhost:3000/api/user/verify-token', {
      headers: { Cookie: token },
    })
    const data = await response.json()
    return data.isLoggedIn ? data.user : null
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser()
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-100"}>
        <UserProvider initialUser={user}>
          <Header />
            {children}
          <Toaster />
        </UserProvider>
      </body>
    </html>
  );
}
