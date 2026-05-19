import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from './components/ThemeToggle'
import { AuthProvider } from '@/lib/AuthContext';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "mohasib|محاسب",
  description: "track your transactions anywhere, anytime",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <ThemeToggle /> {children}
        </AuthProvider> 
      </body>
    </html>
  );
}
