import Link from "next/link";

export type PageTabItem = { label: string; href: string; active: boolean };

export function PageTabs({ label, items }: { label: string; items: PageTabItem[] }) {
  return <nav aria-label={label} className="bp-tabs">{items.map((item) => <Link key={item.href} href={item.href} aria-current={item.active ? "page" : undefined} className="bp-tab">{item.label}</Link>)}</nav>;
}
