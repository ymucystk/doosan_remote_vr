import { Inter } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Modular IK Robotics",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
