import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <p className="footer-brand">{SITE.name}</p>
          <p className="footer-muted">{SITE.tagline}</p>
        </div>
        <address className="footer-contact">
          <p>{SITE.owner}</p>
          <p>Contact: {SITE.contactName}</p>
          <p>Phone: <a href={`tel:${SITE.phone}`}>{SITE.phone}</a></p>
          <p>Address: {SITE.address}</p>
        </address>
      </div>
    </footer>
  );
}
