import { AlertCircle } from 'lucide-react';
import { ToolCard } from '@/features/free-tools/components/ToolCard';
import { useActiveProject } from '@/hooks/useActiveProject';

export function FreeToolsPage() {
  const project = useActiveProject();

  const TOOLS = [
    {
      id: 'link-gap',
      name: 'Link Gap',
      icon: '🔗',
      // to: `/app/${project.id}/free-tools/link-gap`,
    },
    {
      id: 'page-audit',
      name: 'Page Audit',
      icon: '🔎',
      to: `/app/${project.id}/free-tools/page-audit`,
    },
    {
      id: 'core-web-vitals',
      name: 'Page Speed Insights',
      icon: '⚡',
      to: `/app/${project.id}/free-tools/core-web-vitals`,
    },
    {
      id: 'built-with',
      name: 'Built With',
      icon: '🧩',
      to: `/app/${project.id}/free-tools/built-with`,
    },
    {
      id: 'uppercase-lowercase',
      name: 'Case Converter',
      icon: 'Tr',
      to: `/app/${project.id}/free-tools/case-converter`,
    },
    {
      id: 'small-text-generator',
      name: 'Small Text Generator',
      icon: 'T',
      to: `/app/${project.id}/free-tools/small-text-generator`,
    },
    {
      id: 'article-title-generator',
      name: 'Title Generator',
      icon: '📝',
      to: `/app/${project.id}/free-tools/article-title-generator`,
    },

    { id: 'plagiarism-checker', name: 'Plagiarism Checker', icon: '📋' },
    // { id: 'article-rewriter', name: 'Article Rewriter', icon: '✏️' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-amber-900">More tools coming soon</p>
          <p className="text-sm text-amber-800">
            Link Gap, Page Audit, Core Web Vitals, Case Converter, Small Text Generator, Article/Blog
            Title Generator, and Built With are live now (look for the "Live" badge below) — the rest
            are under development for{' '}
            {project.domain}. Check back soon for the full set of text analysis, content generation,
            and optimization tools.
          </p>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-2">SEO Tools</h1>
        <p className="text-muted-foreground">
          A complete set of tools to help with content analysis, writing, and optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TOOLS.map((tool) => (
          <ToolCard
            key={tool.id}
            name={tool.name}
            icon={tool.icon}
            to={tool.to}
            comingSoon={!tool.to}
          />
        ))}
      </div>
    </div>
  );
}
