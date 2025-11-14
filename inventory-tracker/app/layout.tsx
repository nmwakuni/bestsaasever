import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InventoryEase - Smart Inventory Management for African Businesses",
  description: "Track inventory, manage products, and grow your business with InventoryEase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
