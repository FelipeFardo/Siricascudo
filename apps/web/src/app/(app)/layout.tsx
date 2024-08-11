export default function RootLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  return (
    <>
      {children}
      {sheet}
    </>
  )
}
