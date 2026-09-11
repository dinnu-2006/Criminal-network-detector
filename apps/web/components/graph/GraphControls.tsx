"use client";

interface Props {
  currentHops: number;
  onHopChange: (hops: number) => void;
  onReset: () => void;
  focusMode: boolean;
}

export default function GraphControls({ currentHops, onHopChange, onReset, focusMode }: Props) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between pointer-events-none">
      {/* Left: Hop controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {focusMode && (
          <>
            <span className="section-label mr-1">HOPS</span>
            {[1, 2, 3].map((h) => (
              <button
                key={h}
                className={`hop-btn ${currentHops === h ? "active" : ""}`}
                onClick={() => onHopChange(h)}
              >
                {h} HOP{h > 1 ? "S" : ""}
              </button>
            ))}
          </>
        )}
      </div>

      {/* Right: View controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {focusMode && (
          <button
            className="hop-btn"
            onClick={onReset}
          >
            ↺ RESET VIEW
          </button>
        )}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded" style={{ background: "rgba(13,13,13,0.8)", border: "1px solid #1E1E1E" }}>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-node-selected" />
            <span className="text-2xs text-muted">Selected</span>
          </div>
          <div className="w-px h-3 bg-border-subtle mx-1" />
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-node-connected" />
            <span className="text-2xs text-muted">Connected</span>
          </div>
          <div className="w-px h-3 bg-border-subtle mx-1" />
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-node-normal" />
            <span className="text-2xs text-muted">Network</span>
          </div>
        </div>
      </div>
    </div>
  );
}
