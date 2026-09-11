"use client";

interface Props {
  personName: string;
  personId: string;
  clusterName?: string;
  connectionCount: number;
  onClear: () => void;
}

export default function FocusIndicator({ personName, personId, clusterName, connectionCount, onClear }: Props) {
  return (
    <div className="focus-bar animate-slide-up">
      <div className="w-2 h-2 rounded-full bg-accent-red flex-shrink-0" style={{ boxShadow: "0 0 6px rgba(220,38,38,0.6)" }} />
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-primary">{personName}</span>
          <span className="text-2xs text-muted font-mono">{personId}</span>
        </div>
        <div className="flex items-center gap-3">
          {clusterName && <span className="text-2xs text-secondary">{clusterName}</span>}
          <span className="text-2xs text-muted">{connectionCount} connections visible</span>
        </div>
      </div>
      <div className="flex-1" />
      <button
        onClick={onClear}
        className="text-2xs text-secondary hover:text-primary transition-colors px-2 py-1 rounded"
        style={{ border: "1px solid #242424" }}
      >
        CLEAR FOCUS
      </button>
    </div>
  );
}
