// layout.js
import "./globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Toaster } from 'react-hot-toast';
import ClientWrapper from '../../components/ClientWrapper'; // ✅ IMPORT THIS

config.autoAddCss = false;

export const metadata = {
  title: "KesarMart",
  description: "Buy the best saffron online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <ClientWrapper>{children}</ClientWrapper>
        <Footer />
        <Toaster
  position="top-left"
  reverseOrder={false}
  toastOptions={{
    duration: 4000,
    style: {
      background: '#222',
      color: '#fff',
    },
    success: {
      iconTheme: {
        primary: '#0f0',
        secondary: '#fff',
      },
    },
  }}
/>
      </body>
    </html>
  );
}
