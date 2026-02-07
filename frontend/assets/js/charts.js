// ======================= CHART UTILITIES =======================

const chartColors = {
  primary: '#00d4ff',
  success: '#238636',
  warning: '#ff9800',
  danger: '#f44336',
  info: '#2196f3',
  secondary: '#7c3aed',
  light: '#f5f5f5',
  dark: '#0d1117'
};

const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      grid: { color: '#21262d' },
      ticks: { color: '#8b949e' }
    },
    x: {
      grid: { color: '#21262d' },
      ticks: { color: '#8b949e' }
    }
  }
};

/**
 * Render Attendance Chart (Line chart)
 */
function renderAttendanceChart(data, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) {
    console.warn(`Canvas element ${canvasId} not found`);
    return null;
  }

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels || [],
      datasets: [
        {
          label: 'Attendance Rate %',
          data: data.values || [],
          borderColor: chartColors.primary,
          backgroundColor: 'rgba(0, 212, 255, 0.12)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          fill: true
        }
      ]
    },
    options: {
      ...chartDefaults,
      scales: {
        y: {
          ...chartDefaults.scales.y,
          min: 0,
          max: 100,
          ticks: {
            ...chartDefaults.scales.y.ticks,
            callback: (value) => value + '%'
          }
        },
        x: chartDefaults.scales.x
      }
    }
  });
}

/**
 * Render Task Status Chart (Pie/Doughnut chart)
 */
function renderTaskChart(data, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) {
    console.warn(`Canvas element ${canvasId} not found`);
    return null;
  }

  const colors = [
    chartColors.success,
    chartColors.warning,
    chartColors.danger,
    chartColors.info
  ];

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels || [],
      datasets: [
        {
          data: data.values || [],
          backgroundColor: colors,
          borderWidth: 1,
          borderColor: chartDefaults.scales.x.grid.color
        }
      ]
    },
    options: {
      ...chartDefaults,
      cutout: '68%',
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

/**
 * Render Performance Chart (Bar chart)
 */
function renderPerformanceChart(data, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) {
    console.warn(`Canvas element ${canvasId} not found`);
    return null;
  }

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels || [],
      datasets: [
        {
          label: 'Performance Score',
          data: data.values || [],
          backgroundColor: chartColors.success,
          borderRadius: 6,
          barThickness: 32
        }
      ]
    },
    options: {
      ...chartDefaults,
      scales: {
        y: {
          ...chartDefaults.scales.y,
          beginAtZero: true,
          max: 100,
          ticks: {
            ...chartDefaults.scales.y.ticks,
            callback: (value) => value + '%'
          }
        },
        x: {
          ...chartDefaults.scales.x,
          grid: { display: false }
        }
      }
    }
  });
}

/**
 * Render Employee Growth Chart (Line chart)
 */
function renderGrowthChart(data, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) {
    console.warn(`Canvas element ${canvasId} not found`);
    return null;
  }

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels || [],
      datasets: [
        {
          label: 'New Hires',
          data: data.values || [],
          borderColor: chartColors.primary,
          backgroundColor: 'rgba(0, 212, 255, 0.12)',
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      ...chartDefaults,
      scales: {
        y: {
          ...chartDefaults.scales.y,
          min: 0
        },
        x: chartDefaults.scales.x
      }
    }
  });
}

/**
 * Render Department Distribution Chart (Doughnut)
 */
function renderDepartmentChart(data, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) {
    console.warn(`Canvas element ${canvasId} not found`);
    return null;
  }

  const colors = [
    chartColors.primary,
    chartColors.success,
    chartColors.warning,
    chartColors.secondary,
    chartColors.danger
  ];

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.labels || [],
      datasets: [
        {
          data: data.values || [],
          backgroundColor: colors.slice(0, data.values?.length || 0),
          borderWidth: 1,
          borderColor: chartDefaults.scales.x.grid.color
        }
      ]
    },
    options: {
      ...chartDefaults,
      cutout: '68%',
      plugins: {
        legend: { display: false }
      }
    }
  });
}

/**
 * Render Multi-line Comparison Chart
 */
function renderComparisonChart(datasets, labels, canvasId) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) {
    console.warn(`Canvas element ${canvasId} not found`);
    return null;
  }

  const colors = [
    chartColors.primary,
    chartColors.success,
    chartColors.warning,
    chartColors.info
  ];

  const chartDatasets = datasets.map((dataset, index) => ({
    label: dataset.label,
    data: dataset.data,
    borderColor: colors[index % colors.length],
    backgroundColor: colors[index % colors.length] + '20',
    tension: 0.4,
    borderWidth: 2,
    pointRadius: 0,
    pointHoverRadius: 6
  }));

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: chartDatasets
    },
    options: {
      ...chartDefaults,
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        }
      },
      scales: {
        y: {
          ...chartDefaults.scales.y,
          beginAtZero: true
        },
        x: chartDefaults.scales.x
      }
    }
  });
}

/**
 * Destroy a chart instance
 */
function destroyChart(chartInstance) {
  if (chartInstance && typeof chartInstance.destroy === 'function') {
    chartInstance.destroy();
  }
}

/**
 * Clear and recreate a chart
 */
function recreateChart(chartInstance, newConfig) {
  destroyChart(chartInstance);
  const canvas = document.getElementById(chartInstance.canvas.id);
  if (canvas) {
    return new Chart(canvas, newConfig);
  }
  return null;
}
