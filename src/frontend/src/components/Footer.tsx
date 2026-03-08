import { Heart, Mail, MapPin } from "lucide-react";
import type { AppPage } from "../App";

interface FooterProps {
  navigate?: (p: AppPage) => void;
}

export default function Footer({ navigate }: FooterProps) {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-secondary/20 mt-auto">
      {/* Thin top primary accent */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1 — Brand */}
          <div>
            <p className="font-display text-xl font-bold text-foreground mb-1">
              Artiste Dhanu Gallery
            </p>
            <p className="font-serif italic text-muted-foreground text-sm leading-relaxed mb-4">
              Handcrafted with love, delivered with care.
              <br />
              Every piece carries a soul.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
              <MapPin size={11} className="text-primary flex-shrink-0" />
              <span>Shipped across all of India</span>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest mb-4 font-semibold">
              Quick Links
            </p>
            <ul className="space-y-2.5">
              {navigate ? (
                <>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate({ name: "storefront" })}
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors link-hover"
                    >
                      Shop Collection
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate({ name: "storefront" })}
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors link-hover"
                    >
                      About the Artist
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate({ name: "adminLogin" })}
                      className="font-sans text-sm text-muted-foreground hover:text-foreground transition-colors link-hover"
                    >
                      Admin
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <span className="font-sans text-sm text-muted-foreground">
                      Shop Collection
                    </span>
                  </li>
                  <li>
                    <span className="font-sans text-sm text-muted-foreground">
                      About the Artist
                    </span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 3 — Shipping Note */}
          <div>
            <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest mb-4 font-semibold">
              India Post Shipping
            </p>
            <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-3">
              All orders are carefully packed and dispatched via India Post
              within 2–3 working days.
            </p>
            <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-3">
              Delivery typically takes 5–10 days via Speed Post across all
              states and union territories.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-sans">
              <Mail size={11} className="text-primary flex-shrink-0" />
              <span>Tracking available via India Post website</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="divider-ornament max-w-xs">
            <span className="font-serif italic text-xs text-muted-foreground">
              ✦ each piece, uniquely yours ✦
            </span>
          </div>

          <p className="text-xs text-muted-foreground flex items-center gap-1 font-sans justify-center sm:justify-end">
            © {year}. Built with{" "}
            <Heart size={10} className="text-primary fill-current mx-0.5" />{" "}
            using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors ml-0.5"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
