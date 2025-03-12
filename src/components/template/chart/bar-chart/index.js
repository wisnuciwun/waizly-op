import React from 'react';
import { Bar } from 'react-chartjs-2';
import { styles } from '@/layout/dashboard/action-count-dashboard/styles';

import { Chart, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Filler, Legend, } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Filler, Legend,);

export const BarChart = ({ dataChart }) => {
    return (
        <Bar
            className="sales-bar-chart chartjs-render-monitor"
            data={dataChart}
            style={styles.BarChart}
            options={{
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false,
                        displayColors: false,
                        backgroundColor: '#eff6ff',
                        titleFont: {
                            size: '11px',
                        },
                        titleColor: '#6783b8',
                        titleMarginBottom: 4,
                        bodyColor: '#9eaecf',
                        bodyFont: {
                            size: '10px',
                        },
                        bodySpacing: 3,
                        padding: 8,
                        footerMarginTop: 0,
                    },
                },
                scales: {
                    y: {
                        display: false,
                    },
                    x: {
                        display: false,
                    },
                },
                maintainAspectRatio: false,
            }}
        />
    );
};