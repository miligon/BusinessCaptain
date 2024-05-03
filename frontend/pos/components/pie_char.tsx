import React, { FC } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface PieChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export interface PieChartProps {
  prefix?: string;
  data: number[];
  labels: string[];
}

export const PieChart: FC<PieChartProps> = ({ data, labels, prefix = '' }) => {
  // Function to generate random colors
  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  };

  // Generate random colors for each segment
  const backgroundColors = data.map(() => generateRandomColor());

  const pieChartData = {
    labels: labels,
    datasets: [
      {
        label: prefix,
        data: data,
        backgroundColor: backgroundColors,
        borderColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Pie data={pieChartData} options={{ responsive: true }} />
    </>
  );
};
