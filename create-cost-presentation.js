const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const fs = require('fs');

async function createGradient(filename, color1, color2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="562.5">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color1}"/>
        <stop offset="100%" style="stop-color:${color2}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;
  
  await sharp(Buffer.from(svg)).png().toFile(filename);
  return filename;
}

async function createPresentation() {
  // Create gradient background
  await createGradient('title-bg.png', '#1e3a8a', '#0ea5e9');
  
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.author = 'Cloud Cost Analysis';
  pptx.title = 'Cloud Cost Analysis - 60 Day Report';

  // Slide 1: Title
  const slide1 = pptx.addSlide();
  slide1.background = { path: 'title-bg.png' };
  slide1.addText('Cloud Cost Analysis', {
    x: 0.5, y: 1.5, w: 9, h: 1,
    fontSize: 48, bold: true, color: 'FFFFFF', align: 'center'
  });
  slide1.addText('60-Day Comparison Report', {
    x: 0.5, y: 2.7, w: 9, h: 0.6,
    fontSize: 24, color: 'e0f2fe', align: 'center'
  });
  slide1.addText('May 17 - June 16, 2026', {
    x: 0.5, y: 3.5, w: 9, h: 0.4,
    fontSize: 16, color: 'bfdbfe', align: 'center'
  });

  // Slide 2: Executive Summary
  const slide2 = pptx.addSlide();
  slide2.background = { color: 'f8fafc' };
  
  // Header
  slide2.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: '1e3a8a' }
  });
  slide2.addText('Executive Summary', {
    x: 0.4, y: 0.15, w: 9, h: 0.5,
    fontSize: 32, bold: true, color: 'FFFFFF'
  });

  // Metrics boxes
  const metrics = [
    { label: 'Current Period', value: '$12.63M', change: '+2.1%', x: 0.5, positive: true },
    { label: 'Previous Period', value: '$12.38M', change: '', x: 3.5, positive: false },
    { label: 'Total Change', value: '+$255K', change: '+2.1% increase', x: 6.5, positive: true }
  ];

  metrics.forEach(m => {
    slide2.addShape(pptx.shapes.RECTANGLE, {
      x: m.x, y: 1.2, w: 2.8, h: 1.3,
      fill: { color: 'FFFFFF' },
      line: { color: '0ea5e9', width: 0, pt: 6 }
    });
    slide2.addShape(pptx.shapes.RECTANGLE, {
      x: m.x, y: 1.2, w: 0.08, h: 1.3,
      fill: { color: '0ea5e9' }
    });
    
    slide2.addText(m.label, {
      x: m.x + 0.2, y: 1.35, w: 2.4, h: 0.3,
      fontSize: 14, color: '64748b'
    });
    slide2.addText(m.value, {
      x: m.x + 0.2, y: 1.7, w: 2.4, h: 0.5,
      fontSize: 28, bold: true, color: '1e293b'
    });
    if (m.change) {
      slide2.addText(m.change, {
        x: m.x + 0.2, y: 2.2, w: 2.4, h: 0.25,
        fontSize: 14, color: m.positive ? 'dc2626' : '16a34a'
      });
    }
  });

  // Key insights
  slide2.addText('Key Insights:', {
    x: 0.5, y: 2.8, w: 9, h: 0.4,
    fontSize: 18, bold: true, color: '1e293b'
  });
  
  const insights = [
    'Azure costs increased 20.7% (+$833K), offsetting AWS savings',
    'AWS EC2 costs decreased 12.8% (-$390K)',
    'New services: Celonis Platform (+$531K) and Wiz Security (+$400K)',
    'GCP costs declined 31.6% (-$156K)'
  ];
  
  insights.forEach((text, i) => {
    slide2.addText([
      { text: '• ', options: { fontSize: 14, color: '0ea5e9' } },
      { text: text, options: { fontSize: 14, color: '475569' } }
    ], {
      x: 0.7, y: 3.3 + (i * 0.35), w: 8.8, h: 0.3
    });
  });

  // Slide 3: Vendor Breakdown
  const slide3 = pptx.addSlide();
  slide3.background = { color: 'f8fafc' };
  
  slide3.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: '1e3a8a' }
  });
  slide3.addText('Vendor Cost Breakdown', {
    x: 0.4, y: 0.15, w: 9, h: 0.5,
    fontSize: 32, bold: true, color: 'FFFFFF'
  });

  // Chart placeholder
  const chartData = [
    {
      name: 'Current Period',
      labels: ['AWS', 'Azure', 'OCI', 'Snowflake', 'GCP', 'MongoDB', 'Databricks'],
      values: [5285, 4847, 1523, 508, 336, 131, 3]
    },
    {
      name: 'Previous Period',
      labels: ['AWS', 'Azure', 'OCI', 'Snowflake', 'GCP', 'MongoDB', 'Databricks'],
      values: [5839, 4014, 1615, 451, 492, -37, 4]
    }
  ];

  slide3.addChart(pptx.charts.BAR, chartData, {
    x: 0.5, y: 1.2, w: 9, h: 3.5,
    barDir: 'col',
    showTitle: false,
    showLegend: true,
    legendPos: 'b',
    showCatAxisTitle: true,
    catAxisTitle: 'Cloud Vendor',
    showValAxisTitle: true,
    valAxisTitle: 'Cost ($000s)',
    valAxisMinVal: 0,
    valAxisMaxVal: 6000,
    chartColors: ['0ea5e9', '64748b']
  });

  // Slide 4: Top Service Changes
  const slide4 = pptx.addSlide();
  slide4.background = { color: 'f8fafc' };
  
  slide4.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: '1e3a8a' }
  });
  slide4.addText('Top Service Changes', {
    x: 0.4, y: 0.15, w: 9, h: 0.5,
    fontSize: 32, bold: true, color: 'FFFFFF'
  });

  // Table data
  const tableData = [
    [
      { text: 'Service', options: { fill: { color: '1e3a8a' }, color: 'FFFFFF', bold: true } },
      { text: 'Current', options: { fill: { color: '1e3a8a' }, color: 'FFFFFF', bold: true } },
      { text: 'Previous', options: { fill: { color: '1e3a8a' }, color: 'FFFFFF', bold: true } },
      { text: 'Change', options: { fill: { color: '1e3a8a' }, color: 'FFFFFF', bold: true } },
      { text: '% Change', options: { fill: { color: '1e3a8a' }, color: 'FFFFFF', bold: true } }
    ],
    ['Celonis Platform (Azure)', '$531K', '$0', '+$531K', 'New'],
    ['Wiz Security (Azure)', '$401K', '$0', '+$401K', 'New'],
    ['Amazon EC2', '$2,650K', '$3,039K', '-$390K', '-12.8%'],
    ['Azure Capacity', '$608K', '$719K', '-$111K', '-15.5%'],
    ['Amazon EMR', '$408K', '$521K', '-$113K', '-21.8%'],
    ['GCP Atlan', '$0', '$147K', '-$147K', 'Removed'],
    ['AWS Support', '$102K', '$159K', '-$57K', '-35.7%']
  ];

  slide4.addTable(tableData, {
    x: 0.5, y: 1.2, w: 9, h: 3.3,
    colW: [2.5, 1.5, 1.5, 1.5, 1.5],
    border: { pt: 1, color: 'cbd5e1' },
    align: 'center',
    valign: 'middle',
    fontSize: 11
  });

  // Slide 5: Recommendations
  const slide5 = pptx.addSlide();
  slide5.background = { color: 'f8fafc' };
  
  slide5.addShape(pptx.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.8,
    fill: { color: '1e3a8a' }
  });
  slide5.addText('Recommendations', {
    x: 0.4, y: 0.15, w: 9, h: 0.5,
    fontSize: 32, bold: true, color: 'FFFFFF'
  });

  const recommendations = [
    {
      title: 'Monitor Azure Growth',
      desc: 'Azure costs increased 20.7%. Review new Celonis and Wiz deployments for optimization opportunities.'
    },
    {
      title: 'Leverage AWS Savings',
      desc: 'EC2 costs down 12.8%. Continue rightsizing initiatives and evaluate additional Reserved Instance opportunities.'
    },
    {
      title: 'Optimize GCP Usage',
      desc: 'GCP costs declined 31.6%. Assess if this reduction aligns with business needs or indicates underutilization.'
    },
    {
      title: 'Review New Services',
      desc: 'Two major new services added ($931K combined). Ensure proper tagging and cost allocation for tracking.'
    }
  ];

  recommendations.forEach((rec, i) => {
    const y = 1.3 + (i * 0.85);
    
    slide5.addShape(pptx.shapes.RECTANGLE, {
      x: 0.5, y: y, w: 9, h: 0.75,
      fill: { color: 'FFFFFF' },
      line: { color: 'e2e8f0', width: 1 }
    });
    
    slide5.addText(rec.title, {
      x: 0.7, y: y + 0.1, w: 8.6, h: 0.25,
      fontSize: 16, bold: true, color: '1e3a8a'
    });
    
    slide5.addText(rec.desc, {
      x: 0.7, y: y + 0.4, w: 8.6, h: 0.3,
      fontSize: 12, color: '475569'
    });
  });

  // Save presentation
  await pptx.writeFile({ fileName: 'Cloud-Cost-Analysis.pptx' });
  console.log('✓ Presentation created: Cloud-Cost-Analysis.pptx');
  
  // Cleanup
  fs.unlinkSync('title-bg.png');
}

createPresentation().catch(console.error);

// Made with Bob
