const accessToken = localStorage.getItem("accessToken");

async function loadMetrics() {
  const res = await fetch("http://localhost:5000/api/metrics/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await res.json();

  if (!data.success) return console.error("Failed to load metrics");

  const labels = data.data.map((d) => d.metric_date);
  const scores = data.data.map((d) => d.productivity_score);

  renderLineChart("productivityChart", labels, scores, "Productivity Score");
}

loadMetrics();
