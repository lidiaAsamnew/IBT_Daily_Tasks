import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food, ordered online.",
};

// Root shell - kept minimal until Day 37 (nested layouts).
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <div className="mx-auto max-w-3xl p-6">{children}</div>
      </body>
    </html>
  );
}
