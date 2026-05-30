"use client";
import Link from "next/link";
import { Cpu, Stethoscope, BarChart3, Scale, Palette, FlaskConical, BookOpen, Layers } from "lucide-react";
import styles from "./CategoryGrid.module.css";

const cats = [
  { name: "Engineering", value: "ENGINEERING", icon: Cpu },
  { name: "Medical", value: "MEDICAL", icon: Stethoscope },
  { name: "Management", value: "MANAGEMENT", icon: BarChart3 },
  { name: "Law", value: "LAW", icon: Scale },
  { name: "Design", value: "DESIGN", icon: Palette },
  { name: "Science", value: "SCIENCE", icon: FlaskConical },
  { name: "Arts", value: "ARTS", icon: BookOpen },
  { name: "Commerce", value: "COMMERCE", icon: Layers },
];

export function CategoryGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Browse by Stream</h2>
        <p className={styles.subtitle}>Find colleges tailored to your career path</p>
      </div>
      <div className={`${styles.grid} grid-cols-4 sm:grid-cols-8`}>
        {cats.map(({ name, value, icon: Icon }) => (
          <Link key={value} href={`/colleges?category=${value}`} className={styles.categoryLink}>
            <div className={styles.categoryCard}>
              <div className={styles.iconWrap}>
                <Icon size={20} color="#f97316" />
              </div>
              <span className={styles.categoryName}>{name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
