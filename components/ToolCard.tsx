import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ToolCardItem } from '@/types';

export function ToolCard({ item }: { item: ToolCardItem }) {
  return (
    <article className="panel flex h-full flex-col p-6 sm:p-7">
      <div className="badge">{item.trialLimit}</div>
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-ink">{item.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{item.description}</p>
      <ul className="mt-6 space-y-2 text-sm text-slate-700">
        {item.highlights.map((line) => (
          <li key={line}>• {line}</li>
        ))}
      </ul>
      <Link href={item.href} className="btn-primary mt-8 w-fit">
        立即试用
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </article>
  );
}
