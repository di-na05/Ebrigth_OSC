interface BadgeProps {
  variant?: 'blue' | 'amber' | 'green' | 'red' | 'slate' | 'purple';
  children: React.ReactNode;
}

export function Badge({ variant = 'blue', children }: BadgeProps) {
  const variantStyles = {
    blue:   'bg-blue-100  text-blue-700  border border-blue-200  dark:bg-blue-950  dark:text-blue-200  dark:border-blue-900',
    amber:  'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-900',
    green:  'bg-green-100 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-900',
    red:    'bg-red-100   text-red-700   border border-red-200   dark:bg-red-950   dark:text-red-200   dark:border-red-900',
    slate:  'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    purple: 'bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-900',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
