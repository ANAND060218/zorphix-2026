import { Toaster } from 'react-hot-toast';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              marginTop: "60px",
              border: "2px solid white",
              padding: "25px",
              fontSize: "18px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
