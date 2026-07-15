export function PageHeader({ eyebrow, title, description, actions, className = "" }: { eyebrow?: string; title: string; description?: string; actions?: React.ReactNode; className?: string }) {
  return <header className={`bp-page-header ${className}`}>
    <div className="bp-page-header-copy">{eyebrow ? <p className="bp-eyebrow">{eyebrow}</p> : null}<h1 className="bp-page-title">{title}</h1>{description ? <p className="bp-page-description">{description}</p> : null}</div>
    {actions ? <div className="bp-page-header-actions">{actions}</div> : null}
  </header>;
}
