import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Catalino Notes',
  description: 'A little room for your thoughts, plans, and ideas.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
