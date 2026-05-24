import Link from "next/link";

export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <header className="mrmsPageHeader">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <Link href={action.href} className="mrmsBtn primary">
          {action.label}
        </Link>
      )}
    </header>
  );
}
