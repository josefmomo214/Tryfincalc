import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Script from "next/script";
import { Manrope, Inter } from "next/font/google";
import { bricolageGrotesque, dmSans } from "@/lib/fonts";
import { ThemeProvider } from "@/lib/context/ThemeContext";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Script id="gtag-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
        window.gtag('js', new Date());
        window.gtag('config', 'G-Y84YC0NQTR');
      `}</Script>
      <Script
        id="gtag-loader"
        src="https://www.googletagmanager.com/gtag/js?id=G-Y84YC0NQTR"
        strategy="afterInteractive"
      />
      <div
        className={`${manrope.variable} ${inter.variable} ${bricolageGrotesque.variable} ${dmSans.variable} font-sans`}
      >
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
