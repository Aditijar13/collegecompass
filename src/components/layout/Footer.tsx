"use client";
import Link from "next/link";
import { GraduationCap } from "lucide-react";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.brandLink}>
              <div className={styles.brandIcon}>
                <GraduationCap size={15} color="#fff" />
              </div>
              <span className={styles.brandName}>
                College<span className={styles.brandAccent}>Compass</span>
              </span>
            </Link>
            <p className={styles.brandTagline}>India&apos;s most trusted college discovery platform.</p>
          </div>
          {[
            { title: "Explore", links: [["Colleges", "/colleges"], ["Compare", "/compare"], ["Engineering", "/colleges?category=ENGINEERING"], ["Medical", "/colleges?category=MEDICAL"]] },
            { title: "Category", links: [["Management", "/colleges?category=MANAGEMENT"], ["Law", "/colleges?category=LAW"], ["Arts", "/colleges?category=ARTS"], ["Science", "/colleges?category=SCIENCE"]] },
            { title: "Account", links: [["Sign In", "/auth/login"], ["Register", "/auth/register"], ["Dashboard", "/dashboard"], ["Saved", "/dashboard/saved"]] },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className={styles.colTitle}>{title}</h4>
              <ul className={styles.linkList}>
                {links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className={styles.footerLink}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className={styles.bottom}>
          <p className={styles.bottomText}>© 2024 CollegeCompass. All rights reserved.</p>
          <p className={styles.bottomText}>Built with Next.js · PostgreSQL · Prisma</p>
        </div>
      </div>
    </footer>
  );
}
