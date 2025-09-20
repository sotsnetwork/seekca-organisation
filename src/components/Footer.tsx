import { Separator } from "@/components/ui/separator";
import { Twitter, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import logoIcon from "@/assets/logo-icon.png";
import { useAuth } from "@/hooks/use-auth";

const footerLinks = {
  product: [
    { name: "Features", href: "/#features" },
    { name: "How it Works", href: "/#how-it-works" }
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" }
  ],
  resources: [
    { name: "Help Center", href: "/help" },
    { name: "API Docs", href: "/api-docs" },
    { name: "Community", href: "/community" },
    { name: "Status", href: "/status" }
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR", href: "/gdpr" }
  ]
};

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
            <img src={logoIcon} alt="SeekCa" className="w-8 h-8" />
              <span className="text-2xl font-heading font-bold text-foreground">SeekCa</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              {user 
                ? `Welcome back, ${user.user_metadata?.full_name || 'Professional'}! You're part of our global marketplace for verified professionals.`
                : "The global marketplace for verified professionals. Connect, collaborate, and complete projects remotely with confidence."
              }
            </p>
            <div className="flex items-center gap-4">
              <a href="https://x.com/SeekCahq?t=ust3STpxzyTRpKRHLhpPpw&s=09" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/seekcahq?igsh=MTk0Y2Z0NzN1dno3bw==" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.tiktok.com/@seekca?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a href="mailto:seekcamarketplace@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
            {footerLinks.company.map((link) => (
              <li key={link.name}>
                <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 SeekCa. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}