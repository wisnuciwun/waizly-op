import { Line } from 'react-chartjs-2';

export const LineChart = ({
  datasets,
  tooltip,
  legend,
  yAxis,
  xAxis,
  labels,
}) => {
  return (
    <Line
      data={{
        labels: labels,
        datasets: datasets,
      }}
      options={{
        plugins: {
          legend: {
            display: legend,
          },
          tooltip: {
            enabled: tooltip,
            displayColors: false,
            backgroundColor: '#1c2b46',
            titleFont: {
              size: '13px',
            },
            titleColor: '#fff',
            titleMarginBottom: 6,
            bodyColor: '#fff',
            bodyFont: {
              size: '12px',
            },
            bodySpacing: 4,
            padding: 10,
            footerMarginTop: 0,
            callbacks: {
              label: function (context) {
                return context.parsed.y;
              },
            },
          },
        },
        maintainAspectRatio: false,
        scales: {
          y: {
            display: yAxis,
            ticks: {
              beginAtZero: true,
              color: '#4C4F54',
              font: {
                size: '12px',
              },
              callback: function (value) {
                return value;
              },
              min: 0,
              // stepSize: 120,
            },
            grid: {
              color: 'rgba(82, 100, 132, 0.2)',
              tickMarkLength: 0,
              zeroLineColor: 'rgba(82, 100, 132, 0.2)',
            },
          },
          x: {
            display: xAxis,
            ticks: {
              color: '#4C4F54',
              font: {
                size: '12px',
              },
              source: 'auto',
            },
            grid: {
              color: 'transparent',
              tickMarkLength: 10,
              offsetGridLines: true,
            },
          },
        },
      }}
    />
  );
};
