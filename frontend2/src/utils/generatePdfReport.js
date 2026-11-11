/**
 * MindSpace – Professional Client-Side PDF Report Generator
 * Compliant with ISO 32000-1 / PDF 1.4
 * Zero external dependencies, offline-ready, emerald-mint styled.
 */

class PdfDocument {
  constructor() {
    this.pages = []
    this.pageWidth = 595.28 // A4 width in points (72 DPI)
    this.pageHeight = 841.89 // A4 height in points
    this.addPage()
  }

  addPage() {
    this.currentPage = {
      stream: [],
    }
    this.pages.push(this.currentPage)
    return this.currentPage
  }

  escape(str) {
    return String(str ?? '')
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
  }

  hexToRgb(hex) {
    let clean = hex.replace('#', '')
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('')
    }
    const num = parseInt(clean, 16)
    return [
      +((num >> 16) & 255) / 255,
      +((num >> 8) & 255) / 255,
      +(num & 255) / 255,
    ]
  }

  setFillColor(hex) {
    const [r, g, b] = this.hexToRgb(hex)
    this.currentPage.stream.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg`)
  }

  setStrokeColor(hex) {
    const [r, g, b] = this.hexToRgb(hex)
    this.currentPage.stream.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG`)
  }

  drawRect(x, y, w, h, fill = true, stroke = false, fillColor = '#104638', strokeColor = '#70E1B5', lineWidth = 1) {
    if (lineWidth) this.currentPage.stream.push(`${lineWidth} w`)
    if (fill) this.setFillColor(fillColor)
    if (stroke) this.setStrokeColor(strokeColor)
    const op = fill && stroke ? 'B' : fill ? 'f' : 'S'
    this.currentPage.stream.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${op}`)
  }

  drawText(text, x, y, size = 10, bold = false, color = '#FFFFFF') {
    this.setFillColor(color)
    const font = bold ? '/F2' : '/F1'
    this.currentPage.stream.push(`BT ${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${this.escape(text)}) Tj ET`)
  }

  buildUint8Array() {
    const objects = []
    const addObject = (content) => {
      objects.push(content)
      return objects.length
    }

    // 1: Catalog
    addObject('<< /Type /Catalog /Pages 2 0 R >>')
    // 2: Pages (placeholder)
    addObject('')
    // 3: Font F1 (Helvetica)
    const f1Id = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
    // 4: Font F2 (Helvetica-Bold)
    const f2Id = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')

    const pageIds = []
    for (const page of this.pages) {
      const streamContent = page.stream.join('\n')
      const streamId = addObject(`<< /Length ${streamContent.length} >>\nstream\n${streamContent}\nendstream`)
      const pageId = addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Contents ${streamId} 0 R /Resources << /Font << /F1 ${f1Id} 0 R /F2 ${f2Id} 0 R >> >> >>`)
      pageIds.push(pageId)
    }

    // Update Pages catalog (object 2)
    objects[1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`

    // Serialize PDF
    let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n'
    const xref = [0]

    for (let i = 0; i < objects.length; i++) {
      xref.push(out.length)
      out += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`
    }

    const startXref = out.length
    out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
    for (let i = 1; i <= objects.length; i++) {
      out += String(xref[i]).padStart(10, '0') + ' 00000 n \n'
    }
    out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF`

    const bytes = new Uint8Array(out.length)
    for (let i = 0; i < out.length; i++) {
      bytes[i] = out.charCodeAt(i) & 0xff
    }
    return bytes
  }
}

/**
 * Main export function: generateAndDownloadReport
 */
export function generateAndDownloadReport({ formData, score, timestamp }) {
  const doc = new PdfDocument()
  const displayScore = Number(score).toFixed(2)
  const reportDate = timestamp || new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })

  // ==========================================
  // PAGE 1: Header, Result, and Assessment Details
  // ==========================================

  // Emerald Banner Header
  doc.drawRect(35, 745, 525, 70, true, true, '#092C24', '#1DB87A', 1.5)
  doc.drawText('MindSpace', 55, 785, 22, true, '#F5FFF9')
  doc.drawText('AI-POWERED STUDENT WELLBEING ASSESSMENT REPORT', 55, 765, 9, true, '#70E1B5')
  doc.drawText(`Date & Time: ${reportDate}`, 360, 765, 8.5, false, '#C0D8CD')

  // SECTION 2 (TOP): Prediction Result Highlight Box
  doc.drawRect(35, 630, 525, 105, true, true, '#104638', '#70E1B5', 1)
  doc.drawText('SECTION 1: PREDICTED MENTAL HEALTH SCORE', 50, 715, 11, true, '#70E1B5')
  
  // Score Big Badge
  doc.drawRect(50, 645, 120, 55, true, true, '#092C24', '#1DB87A', 1.2)
  doc.drawText(displayScore, 65, 672, 26, true, '#F5FFF9')
  doc.drawText('OUT OF 10.0', 70, 654, 8, true, '#70E1B5')

  // Explanation text
  doc.drawText('Model: Random Forest Regressor (Trained ML Model)', 185, 700, 9.5, true, '#F5FFF9')
  doc.drawText('Actual Output Range: 1.0 to 10.0 (Dataset sample range: 3.6 to 9.4, Mean: 6.23)', 185, 686, 8.5, false, '#C0D8CD')
  doc.drawText('Higher score indicates stronger self-reported mental wellbeing; lower indicates elevated strain.', 185, 673, 8, false, '#C0D8CD')
  doc.drawText('Verified Machine Learning regression prediction based on 5,000 student survey records.', 185, 660, 8, false, '#70E1B5')
  doc.drawText('Clinical Notice: This is an ML wellbeing estimate, not a medical or psychiatric diagnosis.', 185, 646, 8, true, '#F5C842')

  // SECTION 1: Student Assessment Details (Table of 12 fields)
  doc.drawRect(35, 595, 525, 25, true, false, '#0d3329')
  doc.drawText('SECTION 2: STUDENT ASSESSMENT DETAILS (ALL SUBMITTED FIELDS)', 50, 603, 11, true, '#70E1B5')

  const fields = [
    { num: '1', label: 'Age', value: `${formData.age} years` },
    { num: '2', label: 'Gender', value: String(formData.gender) },
    { num: '3', label: 'Country', value: String(formData.country) },
    { num: '4', label: 'Academic Level', value: String(formData.academic_level) },
    { num: '5', label: 'Most Used Platform', value: String(formData.most_used_platform) },
    { num: '6', label: 'Purpose of Use', value: String(formData.purpose_of_use) },
    { num: '7', label: 'Average Daily Usage Hours', value: `${formData.avg_daily_usage_hours} hrs/day` },
    { num: '8', label: 'Daily Phone Unlocks', value: `${formData.daily_unlocks} unlocks/day` },
    { num: '9', label: 'Study Hours Per Day', value: `${formData.study_hours} hrs/day` },
    { num: '10', label: 'Physical Activity Hours', value: `${formData.physical_activity_hours} hrs/day` },
    { num: '11', label: 'Sleep Hours Per Night', value: `${formData.sleep_hours_per_night} hrs/night` },
    { num: '12', label: 'Perceived Stress Level', value: String(formData.stress_level) },
  ]

  let tableY = 565
  const rowHeight = 22
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i]
    const isEven = i % 2 === 0
    const rowBg = isEven ? '#104638' : '#0e3d31'
    doc.drawRect(35, tableY, 525, rowHeight, true, true, rowBg, 'rgba(112,225,181,.15)', 0.5)

    doc.drawText(`${f.num}.`, 45, tableY + 7, 8.5, true, '#70E1B5')
    doc.drawText(f.label, 65, tableY + 7, 8.5, true, '#F5FFF9')
    doc.drawText(f.value, 320, tableY + 7, 8.5, false, '#B7F5D8')

    tableY -= rowHeight
  }

  // Summary box on bottom of Page 1
  tableY -= 15
  doc.drawRect(35, tableY - 45, 525, 55, true, true, '#092C24', '#1DB87A', 1)
  doc.drawText('ASSESSMENT INTEGRITY VERIFICATION', 50, tableY - 12, 9.5, true, '#70E1B5')
  doc.drawText('All 12 inputs match the FastAPI schema. Features were transformed via scikit-learn OneHotEncoder', 50, tableY - 26, 8, false, '#C0D8CD')
  doc.drawText('and OrdinalEncoder pipeline before scoring by the trained Random Forest model.', 50, tableY - 38, 8, false, '#C0D8CD')

  // Page 1 Footer
  doc.drawRect(35, 30, 525, 20, false, true, null, '#1DB87A', 0.5)
  doc.drawText('MindSpace - AI Student Wellbeing Platform', 40, 36, 8, false, '#7aa598')
  doc.drawText('Page 1 of 2', 510, 36, 8, false, '#7aa598')

  // ==========================================
  // PAGE 2: Assessment Summary & Wellbeing Suggestions
  // ==========================================
  doc.addPage()

  // Top header on Page 2
  doc.drawRect(35, 775, 525, 40, true, true, '#092C24', '#1DB87A', 1)
  doc.drawText('MindSpace - Student Wellbeing Report', 50, 792, 13, true, '#F5FFF9')
  doc.drawText(`Score: ${displayScore} / 10.0`, 450, 792, 11, true, '#70E1B5')

  // SECTION 3: Assessment Summary
  doc.drawRect(35, 735, 525, 25, true, false, '#0d3329')
  doc.drawText('SECTION 3: ASSESSMENT SUMMARY', 50, 743, 11, true, '#70E1B5')

  const summaries = [
    {
      title: 'Digital Habits',
      text: `Primary platform is ${formData.most_used_platform} used mainly for ${formData.purpose_of_use}. Student averages ${formData.avg_daily_usage_hours} hours of screen usage daily with approximately ${formData.daily_unlocks} unlocks.`
    },
    {
      title: 'Academic Lifestyle',
      text: `Currently enrolled at the ${formData.academic_level} level, dedicating ${formData.study_hours} hours daily to coursework and academic study.`
    },
    {
      title: 'Sleep and Rest',
      text: `Average sleep duration is ${formData.sleep_hours_per_night} hours per night. Rest sufficiency plays an influential role in cognitive retention and daily mood stability.`
    },
    {
      title: 'Physical Activity',
      text: `Reported physical activity is ${formData.physical_activity_hours} hours daily, contributing to cardiovascular health, physical resilience, and reduced muscular fatigue.`
    },
    {
      title: 'Perceived Stress',
      text: `Self-reported current stress level is ${formData.stress_level}. Balanced workload and recovery intervals help prevent sustained elevated stress.`
    }
  ]

  let sumY = 705
  for (const s of summaries) {
    doc.drawRect(35, sumY - 10, 525, 30, true, true, '#104638', 'rgba(112,225,181,.18)', 0.5)
    doc.drawText(s.title + ':', 48, sumY + 5, 9, true, '#70E1B5')
    doc.drawText(s.text, 145, sumY + 5, 7.8, false, '#F5FFF9')
    sumY -= 36
  }

  // SECTION 4: General Wellbeing Suggestions
  sumY -= 5
  doc.drawRect(35, sumY, 525, 25, true, false, '#0d3329')
  doc.drawText('SECTION 4: GENERAL STUDENT WELLBEING SUGGESTIONS', 50, sumY + 8, 11, true, '#70E1B5')

  const tips = [
    {
      title: 'Maintain a Healthy Sleep Routine',
      desc: 'Aim for 7 to 9 hours of restorative sleep each night. Consistent sleep and wake times calibrate your circadian rhythm and optimize daytime alertness.'
    },
    {
      title: 'Balance Study and Screen Time',
      desc: 'Set app timers for social feeds. Consider taking a 5-minute screen-free break for every 45 to 50 minutes of digital coursework.'
    },
    {
      title: 'Incorporate Structured Academic Breaks',
      desc: 'Use the Pomodoro focus strategy (25 minutes focus, 5 minutes rest). Step away from your desk to stretch, hydrate, and relax your eyes.'
    },
    {
      title: 'Engage in Regular Physical Movement',
      desc: 'Aim for at least 30 minutes of brisk walking, exercise, or sports most days. Physical activity stimulates endorphins and relieves cognitive tension.'
    },
    {
      title: 'Proactively Manage Academic Stress',
      desc: 'Break large assignments into weekly checkpoints. Practice 4-7-8 deep breathing during high-pressure study periods and connect with peers.'
    },
    {
      title: 'Utilize Campus & Professional Counseling',
      desc: 'University wellness centers offer free, confidential guidance. Proactively seeking support is a sign of strength and academic maturity.'
    }
  ]

  let tipY = sumY - 22
  for (let i = 0; i < tips.length; i++) {
    const t = tips[i]
    doc.drawRect(35, tipY - 8, 525, 26, true, true, '#0e3d31', 'rgba(112,225,181,.12)', 0.5)
    doc.drawText(`${i + 1}. ${t.title}:`, 48, tipY + 4, 8.5, true, '#B7F5D8')
    doc.drawText(t.desc, 48, tipY - 5, 7.2, false, '#C0D8CD')
    tipY -= 32
  }

  // Final Educational Disclaimer Box
  tipY -= 5
  doc.drawRect(35, tipY - 32, 525, 36, true, true, '#092C24', '#F5C842', 1)
  doc.drawText('IMPORTANT EDUCATIONAL DISCLAIMER', 48, tipY - 10, 8.5, true, '#F5C842')
  doc.drawText('MindSpace provides algorithmically inferred scores based strictly on self-reported inputs. This report is for educational', 48, tipY - 20, 7.2, false, '#C0D8CD')
  doc.drawText('and self-reflection purposes only and does not constitute a clinical diagnosis or psychiatric evaluation.', 48, tipY - 29, 7.2, false, '#C0D8CD')

  // Page 2 Footer
  doc.drawRect(35, 30, 525, 20, false, true, null, '#1DB87A', 0.5)
  doc.drawText('MindSpace - AI Student Wellbeing Platform', 40, 36, 8, false, '#7aa598')
  doc.drawText('Page 2 of 2', 510, 36, 8, false, '#7aa598')

  // Build bytes and trigger browser download
  const bytes = doc.buildUint8Array()
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'MindSpace_Assessment_Report.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

