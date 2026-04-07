import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { Manrope, Inter } from "next/font/google";
import { ThemeProvider } from "@/lib/context/ThemeContext";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Script
        id="cookieyes"
        src="https://cdn-cookieyes.com/client_data/[YOUR-UNIQUE-ID]/script.js"
        strategy="beforeInteractive"
      />
      <div className={`${manrope.variable} ${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
