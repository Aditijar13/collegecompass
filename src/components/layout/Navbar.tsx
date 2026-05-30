"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { GraduationCap, Menu, X, BookmarkCheck, LayoutDashboard, LogOut, ChevronDown, Search, User } from "lucide-react";
import styles from "./Navbar.module.css";

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : styles.headerDefault}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logoLink}>
          <div className={styles.logoIcon}>
            <GraduationCap size={18} color="#fff" />
          </div>
          <span className={styles.logoText}>
            College<span className={styles.logoAccent}>Compass</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className={`${styles.desktopNav} hidden md:flex`}>
          {[{ href: "/colleges", label: "Colleges" }, { href: "/compare", label: "Compare" }].map((link) => (
            <Link key={link.href} href={link.href} className={styles.navLink}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className={styles.rightGroup}>
          <Link href="/colleges" className={styles.searchLink}>
            <Search size={16} />
          </Link>

          {session ? (
            <div className={styles.userMenuWrap}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className={styles.userMenuBtn}>
                <div className={styles.userAvatar}>
                  {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className={styles.userLabel}>{session.user?.name}</span>
                <ChevronDown size={13} color="#9ca3af" />
              </button>
              {userMenuOpen && (
                <div className={styles.dropdown}>
                  {[
                    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                    { href: "/dashboard/saved", icon: BookmarkCheck, label: "Saved Colleges" },
                    { href: "/dashboard/profile", icon: User, label: "Profile" },
                  ].map(({ href, icon: Icon, label }) => (
                    <Link key={href} href={href} className={styles.dropdownLink} onClick={() => setUserMenuOpen(false)}>
                      <Icon size={14} color="#9ca3af" />{label}
                    </Link>
                  ))}
                  <div className={styles.dropdownDivider} />
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }} className={styles.signOutBtn}>
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={`${styles.authLinks} hidden md:flex`}>
              <Link href="/auth/login" className="btn-secondary" style={{ fontSize: 13, padding: "8px 16px" }}>Sign in</Link>
              <Link href="/auth/register" className="btn-accent" style={{ fontSize: 13, padding: "8px 16px" }}>Get Started</Link>
            </div>
          )}

          <button onClick={() => setMobileOpen(!mobileOpen)} className={`${styles.mobileMenuBtn} md:hidden`}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {[{ href: "/colleges", label: "Colleges" }, { href: "/compare", label: "Compare" }].map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className={styles.mobileLink}>
              {link.label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Dashboard</Link>
              <Link href="/dashboard/profile" onClick={() => setMobileOpen(false)} className={styles.mobileLink}>Profile</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className={styles.mobileLink} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%", color: "#f97316" }}>Sign out</button>
            </>
          ) : (
            <div className={styles.mobileAuthLinks}>
              <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="btn-secondary" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Sign in</Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="btn-accent" style={{ flex: 1, justifyContent: "center", fontSize: 13 }}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
