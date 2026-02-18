import { RATING_LEVELS } from '@/lib/types';

const levelColorClasses: Record<number, string> = {
  1: 'bg-level-1',
  2: 'bg-level-2',
  3: 'bg-level-3',
  4: 'bg-level-4',
  5: 'bg-level-5',
};

const levelTextClasses: Record<number, string> = {
  1: 'text-level-1',
  2: 'text-level-2',
  3: 'text-level-3',
  4: 'text-level-4',
  5: 'text-level-5',
};

const levelBorderClasses: Record<number, string> = {
  1: 'border-level-1',
  2: 'border-level-2',
  3: 'border-level-3',
  4: 'border-level-4',
  5: 'border-level-5',
};

export const RatingBadge = ({ level, size = 'md' }: { level: number; size?: 'sm' | 'md' | 'lg' }) => {
  const info = RATING_LEVELS.find(r => r.level === level);
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-lg',
    lg: 'h-16 w-16 text-2xl',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center justify-center rounded-full font-bold text-primary-foreground ${levelColorClasses[level]} ${sizeClasses[size]}`}>
        L{level}
      </div>
      {size !== 'sm' && info && (
        <div>
          <p className={`font-semibold ${levelTextClasses[level]}`}>{info.name}</p>
          {size === 'lg' && <p className="text-sm text-muted-foreground">{info.description}</p>}
        </div>
      )}
    </div>
  );
};

export const RatingBar = ({ scores }: { scores: { [key: string]: number } }) => {
  return (
    <div className="space-y-2">
      {Object.entries(scores).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <span className="w-40 truncate text-xs text-muted-foreground capitalize">
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </span>
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${levelColorClasses[value]}`}
              style={{ width: `${(value / 5) * 100}%` }}
            />
          </div>
          <span className={`text-xs font-bold ${levelTextClasses[value]}`}>{value}/5</span>
        </div>
      ))}
    </div>
  );
};

export const LevelIndicator = ({ level, compact = false }: { level: number; compact?: boolean }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(l => (
      <div
        key={l}
        className={`rounded-sm transition-all ${compact ? 'h-2 w-6' : 'h-3 w-8'} ${
          l <= level ? levelColorClasses[l] : 'bg-muted'
        }`}
      />
    ))}
  </div>
);

export const RatingLevelsOverview = () => (
  <div className="grid gap-4 md:grid-cols-5">
    {RATING_LEVELS.map(r => (
      <div key={r.level} className={`rounded-lg border-2 p-4 text-center transition-all hover:shadow-lg ${levelBorderClasses[r.level]}`}>
        <div className={`mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold text-primary-foreground ${levelColorClasses[r.level]}`}>
          L{r.level}
        </div>
        <h3 className="font-bold">{r.name}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{r.description}</p>
      </div>
    ))}
  </div>
);
