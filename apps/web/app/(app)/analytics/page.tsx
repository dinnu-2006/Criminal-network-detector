"use client";
export default function AnalyticsPage() {
  const metrics = [
    { label: "Total Persons", val: "58M", sub: "Architecture" },
    { label: "Demo Profiles", val: "10", sub: "In prototype" },
    { label: "Relationships", val: "9", sub: "Evidence-linked" },
    { label: "Network Clusters", val: "8", sub: "Communities" },
    { label: "ICJS Sources", val: "12", sub: "Mock adapters" },
    { label: "Cases", val: "6", sub: "Linked" },
  ];

  return (
    <div className="h-full overflow-y-auto p-6" style={{ background: "#050505" }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-lg font-semibold text-primary mb-2">Analytics</h1>
        <p className="text-xs text-secondary mb-6">Network-level analytics and statistical overview</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-lg p-4" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}>
              <div className="text-2xl font-semibold text-primary mb-1">{m.val}</div>
              <div className="text-xs text-secondary">{m.label}</div>
              <div className="text-2xs text-muted">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Cluster breakdown */}
        <div className="rounded-lg p-4" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E" }}>
          <div className="section-label mb-3">CLUSTER BREAKDOWN</div>
          <div className="space-y-2">
            {[
              { name: "Southern Cluster", count: 921 },
              { name: "North Region Network", count: 812 },
              { name: "Eastern Syndicate", count: 723 },
              { name: "Financial Fraud Ring", count: 654 },
              { name: "Cross-border Network", count: 589 },
              { name: "Mixed Network", count: 503 },
              { name: "Urban Cell Alpha", count: 498 },
              { name: "Isolated Cells", count: 342 },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs text-secondary w-48 flex-shrink-0">{c.name}</span>
                <div className="flex-1 strength-bar">
                  <div className="strength-fill" style={{ width: `${(c.count / 921) * 100}%` }} />
                </div>
                <span className="text-xs text-muted w-16 text-right">{c.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
