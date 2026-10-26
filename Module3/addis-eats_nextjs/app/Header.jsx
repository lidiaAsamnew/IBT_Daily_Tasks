import Image from "next/image";
import Link from "next/link";
import MainNav from "./MainNav";
import { SITE } from "@/lib/site";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${SITE.name} — home`}>
          <Image src="/assets/logo.png" alt="" width={40} height={40} className="brand-logo" />
          <span className="brand-text">
            <span className="brand-name">{SITE.name}</span>
            <span className="brand-tag">Ethiopian food delivery</span>
          </span>
        </Link>
        <MainNav />
      </div>
    </header>
  );
}
