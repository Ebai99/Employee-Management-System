function renderChart(ctx, data) {
  new Chart(ctx, {
    type: "bar",
    data,
    options: {
      animation: { duration: 1200, easing: "easeOutQuart" },
    },
  });
}
