import React, { useState } from 'react';
import ReactHighCharts from 'highcharts-react-official';
import Highcharts from 'highcharts';
import 'highcharts/modules/histogram-bellcurve';

function BellCurve({ rizzq }) {
  const mean = 100;
  const stdDev = 15;

  const Q1 = mean - 2 * stdDev;
  const Q2 = mean - stdDev;
  const Q3 = mean + stdDev;
  const Q4 = mean + 2 * stdDev;
  const Q7 = mean;

  const data = [85, 115];

  const [config] = useState({
    title: { text: null },
    chart: {
      height: 200,
    },
    xAxis: [
      {
        title: { text: null },
        visible: true,
        tickPositions: [40, 55, 70, 85, 100, 115, 130, 145, 160],
        plotLines: [
          {
            color: 'red',
            width: 2,
            value: rizzq,
            zIndex: 5,
            label: {
              text: 'You',
              align: 'center',
              verticalAlign: 'middle',
              style: {
                color: 'red',
              },
            },
          },
        ],
      },
    ],
    yAxis: [
      { title: { text: null }, labels: { enabled: false } },
      { title: { text: null }, labels: { enabled: false }, opposite: true },
    ],
    series: [
      {
        name: null,
        type: 'bellcurve',
        baseSeries: 1,
        zoneAxis: 'x',
        zones: [
          { value: Q1, color: '#FF9999' },
          { value: Q2, color: '#d6d6d6' },
          { value: Q3, color: '#c9c9c9' },
          { value: Q7, color: '#d6d6d6' },
          { value: Q4, color: '#e0e0de' },
          { color: '#92e08d' },
        ],
        zIndex: 1,
        borderWidth: 10,
        lineWidth: 2,
        pointPadding: 0,
        groupPadding: 0,
        label: { enabled: true },
        showInLegend: false,
      },
      {
        name: 'Data',
        type: 'line',
        data: data,
        visible: false,
        showInLegend: false,
      },
    ],
  });

  return <ReactHighCharts highcharts={Highcharts} options={config} />;
}

export default BellCurve;
