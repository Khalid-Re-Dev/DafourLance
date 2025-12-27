import type React from "react"

export const metadata = {
  title: "Admin Login | DaforLance",
  description: "Sign in to manage your DaforLance website content",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  // No authentication or sidebar/topbar for login page
  return <>{children}</>
}
