const pptxgen = require('pptxgenjs');
const html2pptx = require('C:/Users/MathieuDupuis-Doiron/.bob/skills/pptx/scripts/html2pptx.js');

async function createPresentation() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Cloudability Analysis';
  pptx.title = 'Cloud Cost Analysis - Service Level Breakdown';

  // Slide 1: Title
  await html2pptx('slide1-title.html', pptx);

  // Slide 2: Executive Summary with vendor comparison chart
  const { slide: slide2, placeholders: p2 } = await html2pptx('slide2-summary.html', pptx);
  
  slide2.addChart(pptx.charts.BAR, [{
    name: "Cost by Vendor",
    labels: ["AWS", "Azure", "OCI", "Snowflake", "GCP", "MongoDB"],
    values: [5900000, 4500000, 1500000, 500000, 400000, 100000]
  }], {
    ...p2[0],
    barDir: 'col',
    showTitle: false,
    showLegend: false,
    showCatAxisTitle: true,
    catAxisTitle: 'Cloud Vendor',
    showValAxisTitle: true,
    valAxisTitle: 'Cost ($)',
    valAxisMaxVal: 6000000,
    valAxisMinVal: 0,
    valAxisMajorUnit: 1000000,
    chartColors: ["FF9900", "0078D4", "F80000", "29B5E8", "4285F4", "00ED64"],
    dataLabelPosition: 'outEnd',
    dataLabelColor: '000000',
    dataLabelFormatCode: '$#,##0'
  });

  // Slide 3: AWS with top services chart
  const { slide: slide3, placeholders: p3 } = await html2pptx('slide3-aws.html', pptx);
  
  slide3.addChart(pptx.charts.BAR, [{
    name: "AWS Top Services",
    labels: ["EC2", "Savings Plans", "RDS", "EMR", "S3", "Support"],
    values: [2649695, 754656, 631345, 407566, 341687, 102138]
  }], {
    ...p3[0],
    barDir: 'bar',
    showTitle: false,
    showLegend: false,
    showCatAxisTitle: true,
    catAxisTitle: 'Service',
    showValAxisTitle: true,
    valAxisTitle: 'Cost ($)',
    valAxisMaxVal: 3000000,
    valAxisMinVal: 0,
    valAxisMajorUnit: 500000,
    chartColors: ["FF9900"],
    dataLabelPosition: 'outEnd',
    dataLabelColor: '000000',
    dataLabelFormatCode: '$#,##0'
  });

  // Slide 4: Azure with top services chart
  const { slide: slide4, placeholders: p4 } = await html2pptx('slide4-azure.html', pptx);
  
  slide4.addChart(pptx.charts.BAR, [{
    name: "Azure Top Services",
    labels: ["Capacity", "Storage", "Wiz", "Databricks", "SQL", "Ops Insights"],
    values: [607550, 496821, 400694, 346727, 266358, 164829]
  }], {
    ...p4[0],
    barDir: 'bar',
    showTitle: false,
    showLegend: false,
    showCatAxisTitle: true,
    catAxisTitle: 'Service',
    showValAxisTitle: true,
    valAxisTitle: 'Cost ($)',
    valAxisMaxVal: 700000,
    valAxisMinVal: 0,
    valAxisMajorUnit: 100000,
    chartColors: ["0078D4"],
    dataLabelPosition: 'outEnd',
    dataLabelColor: '000000',
    dataLabelFormatCode: '$#,##0'
  });

  // Slide 5: Other providers table
  const { slide: slide5, placeholders: p5 } = await html2pptx('slide5-other.html', pptx);
  
  const tableData = [
    [
      { text: "Provider", options: { fill: { color: "1C2833" }, color: "FFFFFF", bold: true } },
      { text: "Current Period", options: { fill: { color: "1C2833" }, color: "FFFFFF", bold: true } },
      { text: "Previous Period", options: { fill: { color: "1C2833" }, color: "FFFFFF", bold: true } },
      { text: "Change", options: { fill: { color: "1C2833" }, color: "FFFFFF", bold: true } }
    ],
    ["OCI", "$1,500,000", "$1,600,000", "-$100,000 (-6.3%)"],
    ["Snowflake", "$500,000", "$450,000", "+$50,000 (+11.1%)"],
    ["GCP", "$400,000", "$410,000", "-$10,000 (-2.4%)"],
    ["MongoDB", "$100,000", "-$150,000", "+$250,000 (credits)"],
    ["Databricks", "$3,000", "$3,900", "-$900 (-23.1%)"]
  ];

  slide5.addTable(tableData, {
    ...p5[0],
    colW: [2.5, 2.5, 2.5, 2.5],
    border: { pt: 1, color: "CCCCCC" },
    align: "center",
    valign: "middle",
    fontSize: 13
  });

  await pptx.writeFile({ fileName: 'Cloudability-Cost-Analysis.pptx' });
  console.log('Presentation created: Cloudability-Cost-Analysis.pptx');
}

createPresentation().catch(console.error);

// Made with Bob
