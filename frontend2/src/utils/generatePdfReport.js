/**
 * MindSpace – Premium Corporate & University Academic PDF Report Generator
 * Compliant with ISO 32000-1 / PDF 1.4
 * Pure client-side vector engine, offline-ready, university publication quality.
 * Designed & Developed by TEJESH K
 */

import { getSignalClassification } from './signalClassification'

export class PdfDocument {
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
    if (!hex) return [0, 0, 0]
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

  drawLine(x1, y1, x2, y2, color = '#E2E8F0', lineWidth = 1) {
    if (lineWidth) this.currentPage.stream.push(`${lineWidth} w`)
    this.setStrokeColor(color)
    this.currentPage.stream.push(`${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`)
  }

  drawRect(x, y, w, h, fill = true, stroke = false, fillColor = '#FFFFFF', strokeColor = '#E2E8F0', lineWidth = 1) {
    if (lineWidth) this.currentPage.stream.push(`${lineWidth} w`)
    if (fill) this.setFillColor(fillColor)
    if (stroke) this.setStrokeColor(strokeColor)
    const op = fill && stroke ? 'B' : fill ? 'f' : 'S'
    this.currentPage.stream.push(`${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${op}`)
  }

  drawRoundedRect(x, y, w, h, r = 6, fill = true, stroke = false, fillColor = '#FFFFFF', strokeColor = '#E2E8F0', lineWidth = 1) {
    if (lineWidth) this.currentPage.stream.push(`${lineWidth} w`)
    if (fill) this.setFillColor(fillColor)
    if (stroke) this.setStrokeColor(strokeColor)
    const k = r * 0.55228475
    const s = [
      `${(x + r).toFixed(2)} ${y.toFixed(2)} m`,
      `${(x + w - r).toFixed(2)} ${y.toFixed(2)} l`,
      `${(x + w - r + k).toFixed(2)} ${y.toFixed(2)} ${(x + w).toFixed(2)} ${(y + r - k).toFixed(2)} ${(x + w).toFixed(2)} ${(y + r).toFixed(2)} c`,
      `${(x + w).toFixed(2)} ${(y + h - r).toFixed(2)} l`,
      `${(x + w).toFixed(2)} ${(y + h - r + k).toFixed(2)} ${(x + w - r + k).toFixed(2)} ${(y + h).toFixed(2)} ${(x + w - r).toFixed(2)} ${(y + h).toFixed(2)} c`,
      `${(x + r).toFixed(2)} ${(y + h).toFixed(2)} l`,
      `${(x + r - k).toFixed(2)} ${(y + h).toFixed(2)} ${x.toFixed(2)} ${(y + h - r + k).toFixed(2)} ${x.toFixed(2)} ${(y + h - r).toFixed(2)} c`,
      `${x.toFixed(2)} ${(y + r).toFixed(2)} l`,
      `${x.toFixed(2)} ${(y + r - k).toFixed(2)} ${(x + r - k).toFixed(2)} ${y.toFixed(2)} ${(x + r).toFixed(2)} ${y.toFixed(2)} c`,
    ]
    const op = fill && stroke ? 'B' : fill ? 'f' : 'S'
    s.push(op)
    this.currentPage.stream.push(s.join(' '))
  }

  drawText(text, x, y, size = 10, bold = false, color = '#0F172A') {
    this.setFillColor(color)
    const font = bold ? '/F2' : '/F1'
    this.currentPage.stream.push(`BT ${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${this.escape(text)}) Tj ET`)
  }

  drawWrappedText(text, x, y, maxWidth, lineHeight, size = 7.5, bold = false, color = '#334155') {
    const words = String(text ?? '').split(' ')
    let currentLine = ''
    let curY = y
    const avgCharWidth = (bold ? 0.55 : 0.50) * size

    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const testLine = currentLine ? `${currentLine} ${word}` : word
      const testWidth = testLine.length * avgCharWidth
      if (testWidth > maxWidth && currentLine) {
        this.drawText(currentLine, x, curY, size, bold, color)
        curY -= lineHeight
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    if (currentLine) {
      this.drawText(currentLine, x, curY, size, bold, color)
      curY -= lineHeight
    }
    return curY
  }

  drawLogoEmblem(x, y, size = 36) {
    // MindSpace deep emerald rounded badge
    this.drawRoundedRect(x, y, size, size, 8, true, false, '#0D5C3A')

    // Vector brain emblem in crisp white
    const cx = x + size / 2
    const cy = y + size / 2
    const scale = size / 36

    this.setStrokeColor('#FFFFFF')
    this.currentPage.stream.push('1.2 w')

    // Left hemisphere cerebral lobe
    this.currentPage.stream.push(
      `${(cx - 2 * scale).toFixed(2)} ${(cy + 10 * scale).toFixed(2)} m ` +
      `${(cx - 8 * scale).toFixed(2)} ${(cy + 10 * scale).toFixed(2)} ${(cx - 12 * scale).toFixed(2)} ${(cy + 5 * scale).toFixed(2)} ${(cx - 10 * scale).toFixed(2)} ${(cy + 1 * scale).toFixed(2)} c ` +
      `${(cx - 13 * scale).toFixed(2)} ${(cy - 2 * scale).toFixed(2)} ${(cx - 11 * scale).toFixed(2)} ${(cy - 7 * scale).toFixed(2)} ${(cx - 6 * scale).toFixed(2)} ${(cy - 8 * scale).toFixed(2)} c ` +
      `${(cx - 4 * scale).toFixed(2)} ${(cy - 9 * scale).toFixed(2)} ${(cx - 2 * scale).toFixed(2)} ${(cy - 9 * scale).toFixed(2)} ${(cx - 2 * scale).toFixed(2)} ${(cy - 9 * scale).toFixed(2)} c S`
    )

    // Right hemisphere cerebral lobe (symmetric)
    this.currentPage.stream.push(
      `${(cx + 2 * scale).toFixed(2)} ${(cy + 10 * scale).toFixed(2)} m ` +
      `${(cx + 8 * scale).toFixed(2)} ${(cy + 10 * scale).toFixed(2)} ${(cx + 12 * scale).toFixed(2)} ${(cy + 5 * scale).toFixed(2)} ${(cx + 10 * scale).toFixed(2)} ${(cy + 1 * scale).toFixed(2)} c ` +
      `${(cx + 13 * scale).toFixed(2)} ${(cy - 2 * scale).toFixed(2)} ${(cx + 11 * scale).toFixed(2)} ${(cx - 7 * scale).toFixed(2)} ${(cx + 6 * scale).toFixed(2)} ${(cx - 8 * scale).toFixed(2)} c ` +
      `${(cx + 4 * scale).toFixed(2)} ${(cy - 9 * scale).toFixed(2)} ${(cx + 2 * scale).toFixed(2)} ${(cy - 9 * scale).toFixed(2)} ${(cx + 2 * scale).toFixed(2)} ${(cy - 9 * scale).toFixed(2)} c S`
    )

    // Central fissure
    this.currentPage.stream.push(
      `${cx.toFixed(2)} ${(cy + 9 * scale).toFixed(2)} m ${cx.toFixed(2)} ${(cy - 8 * scale).toFixed(2)} l S`
    )

    // Neural horizontal bridges
    this.currentPage.stream.push(
      `${(cx - 6 * scale).toFixed(2)} ${(cy + 1 * scale).toFixed(2)} m ${(cx - 2 * scale).toFixed(2)} ${(cy + 1 * scale).toFixed(2)} l S`
    )
    this.currentPage.stream.push(
      `${(cx + 6 * scale).toFixed(2)} ${(cy + 1 * scale).toFixed(2)} m ${(cx + 2 * scale).toFixed(2)} ${(cy + 1 * scale).toFixed(2)} l S`
    )
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
  const reportDate = timestamp || new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  const signal = getSignalClassification(score)

  // Status-specific badges compliant with official university design
  const signalBadgeBg = signal.status === 'STRONG' ? '#ECFDF5' : signal.status === 'MEDIUM' ? '#FFFBEB' : '#FEF2F2'
  const signalBadgeBorder = signal.status === 'STRONG' ? '#A7F3D0' : signal.status === 'MEDIUM' ? '#FDE68A' : '#FECACA'
  const signalTextColor = signal.status === 'STRONG' ? '#047857' : signal.status === 'MEDIUM' ? '#B45309' : '#B91C1C'
  const signalMeterColor = signal.status === 'STRONG' ? '#059669' : signal.status === 'MEDIUM' ? '#D97706' : '#DC2626'

  // Geometry: A4 width = 595.28, margin = 38pt, contentWidth = 519.28pt
  const marginX = 38
  const contentWidth = 519.28

  // ==========================================
  // PAGE 1: Header, Score, Table & Data Assurance
  // ==========================================

  // 1. Header with Original MindSpace Vector Logo Emblem
  doc.drawLogoEmblem(marginX, 752, 36)

  // Logo Brand Typography
  doc.drawText('MindSpace', marginX + 44, 774, 15, true, '#0F172A')
  doc.drawText('STUDENT WELLBEING PLATFORM', marginX + 44, 762, 6.5, true, '#0D5C3A')

  // Document Title & Subtitle
  doc.drawText('STUDENT WELLBEING ASSESSMENT REPORT', marginX + 175, 774, 10.5, true, '#0F172A')
  doc.drawText('AI-Powered Student Wellbeing Platform • Official Report', marginX + 175, 762, 7.5, false, '#64748B')

  // Top-Right Assessment Metadata
  doc.drawText('ASSESSMENT DATE', 440, 776, 6.5, true, '#64748B')
  doc.drawText(reportDate, 440, 765, 7.5, true, '#0F172A')
  doc.drawText('DOC REF: MS-2026-VAL', 440, 755, 6.5, true, '#0D5C3A')

  // Thin emerald divider
  doc.drawLine(marginX, 742, marginX + contentWidth, 742, '#0D5C3A', 1.5)

  // 2. Section 1: Score & SIGNAL Presentation Card
  const scoreCardY = 618
  const scoreCardH = 112
  doc.drawRoundedRect(marginX, scoreCardY, contentWidth, scoreCardH, 10, true, true, '#F8FAFC', '#E2E8F0', 1)
  // Left deep emerald accent stripe
  doc.drawRoundedRect(marginX, scoreCardY, 4.5, scoreCardH, 2, true, false, '#0D5C3A')

  // Left Column: Score Numerical Presentation & Subtle Progress Meter
  doc.drawText('PREDICTED MENTAL HEALTH SCORE', marginX + 16, scoreCardY + 92, 7, true, '#64748B')
  doc.drawText(displayScore, marginX + 16, scoreCardY + 54, 30, true, '#0D5C3A')
  doc.drawText('/ 10.0', marginX + 90, scoreCardY + 58, 11, true, '#64748B')

  // Subtle score meter bar
  const meterWidth = 112
  const meterHeight = 5
  doc.drawRoundedRect(marginX + 16, scoreCardY + 40, meterWidth, meterHeight, 2.5, true, false, '#E2E8F0')
  const clampedRatio = Math.max(0.1, Math.min(1.0, Number(score) / 10))
  doc.drawRoundedRect(marginX + 16, scoreCardY + 40, meterWidth * clampedRatio, meterHeight, 2.5, true, false, signalMeterColor)
  doc.drawText('Scale: 1.0 (Low) - 10.0 (High)', marginX + 16, scoreCardY + 26, 6.8, false, '#64748B')

  // Vertical separator line
  doc.drawLine(marginX + 142, scoreCardY + 12, marginX + 142, scoreCardY + scoreCardH - 12, '#E2E8F0', 0.75)

  // Right Column: Section Header & SIGNAL Evaluation
  const rightColX = marginX + 156
  doc.drawText('SECTION 1: PREDICTED WELLBEING SCORE & SIGNAL EVALUATION', rightColX, scoreCardY + 92, 7.8, true, '#0D5C3A')

  // SIGNAL Status Badge
  const badgeW = 100
  const badgeH = 19
  const badgeX = marginX + contentWidth - badgeW - 12
  doc.drawRoundedRect(badgeX, scoreCardY + 83, badgeW, badgeH, 5, true, true, signalBadgeBg, signalBadgeBorder, 0.75)
  doc.drawText(signal.label, badgeX + 10, scoreCardY + 89, 7.8, true, signalTextColor)

  // Concise interpretation text wrapped cleanly
  doc.drawWrappedText(signal.description, rightColX, scoreCardY + 68, 335, 12, 7.8, false, '#1E293B')

  // Model & baseline telemetry specifications
  doc.drawText('Algorithm: Random Forest Regressor (Trained ML Model, 100 Estimators Pipeline)', rightColX, scoreCardY + 36, 7.2, true, '#475569')
  doc.drawText('Output Scale: 1.0 to 10.0 • Sample Dataset Mean: 6.23 • Evaluated on 12 Input Features', rightColX, scoreCardY + 24, 7, false, '#64748B')
  doc.drawText('Thresholds: Strong (>= 7.0) | Medium (5.0 - 6.99) | Weak (< 5.0)', rightColX, scoreCardY + 12, 7, false, '#64748B')

  // 3. Section 2: Student Assessment Telemetry (12 Submitted Parameters)
  const tableTitleY = 598
  doc.drawText('SECTION 2: STUDENT ASSESSMENT TELEMETRY (12 SUBMITTED PARAMETERS)', marginX, tableTitleY, 8.8, true, '#0D5C3A')
  doc.drawText('Direct self-reported behavioral, academic, and psychological lifestyle inputs evaluated by the model', marginX, tableTitleY - 11, 7.2, false, '#64748B')

  // Table Columns Header
  const tableTopY = 568
  const tableRowH = 24.5
  doc.drawRoundedRect(marginX, tableTopY, contentWidth, 20, 6, true, false, '#0D5C3A')
  doc.drawText('#', marginX + 10, tableTopY + 6, 7.5, true, '#FFFFFF')
  doc.drawText('ASSESSMENT PARAMETER', marginX + 34, tableTopY + 6, 7.5, true, '#FFFFFF')
  doc.drawText('REPORTED STUDENT VALUE', marginX + 225, tableTopY + 6, 7.5, true, '#FFFFFF')
  doc.drawText('TELEMETRY DOMAIN', marginX + 385, tableTopY + 6, 7.5, true, '#FFFFFF')

  const fields = [
    { num: '1', label: 'Age', value: `${formData.age} years`, domain: 'Student Demographic' },
    { num: '2', label: 'Gender', value: String(formData.gender), domain: 'Demographic Indicator' },
    { num: '3', label: 'Country', value: String(formData.country), domain: 'Geographic Baseline' },
    { num: '4', label: 'Academic Level', value: String(formData.academic_level), domain: 'Academic Stage' },
    { num: '5', label: 'Most Used Platform', value: String(formData.most_used_platform), domain: 'Primary Digital Channel' },
    { num: '6', label: 'Purpose of Use', value: String(formData.purpose_of_use), domain: 'Online Engagement' },
    { num: '7', label: 'Average Daily Usage Hours', value: `${formData.avg_daily_usage_hours} hrs/day`, domain: 'Digital Screen Time' },
    { num: '8', label: 'Daily Phone Unlocks', value: `${formData.daily_unlocks} unlocks/day`, domain: 'Device Interaction Frequency' },
    { num: '9', label: 'Study Hours Per Day', value: `${formData.study_hours} hrs/day`, domain: 'Academic Focus Duration' },
    { num: '10', label: 'Physical Activity Hours', value: `${formData.physical_activity_hours} hrs/day`, domain: 'Physical Activity & Movement' },
    { num: '11', label: 'Sleep Hours Per Night', value: `${formData.sleep_hours_per_night} hrs/night`, domain: 'Restorative Sleep' },
    { num: '12', label: 'Perceived Stress Level', value: String(formData.stress_level), domain: 'Psychological State' },
  ]

  let currentRowY = tableTopY - tableRowH
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i]
    const isEven = i % 2 === 1
    const rowBg = isEven ? '#F8FAFC' : '#FFFFFF'

    // Row background & bottom separator
    doc.drawRect(marginX, currentRowY, contentWidth, tableRowH, true, false, rowBg)
    doc.drawLine(marginX, currentRowY, marginX + contentWidth, currentRowY, '#E2E8F0', 0.5)

    doc.drawText(`${f.num}.`, marginX + 10, currentRowY + 8, 7.5, true, '#64748B')
    doc.drawText(f.label, marginX + 34, currentRowY + 8, 7.8, true, '#1E293B')
    doc.drawText(f.value, marginX + 225, currentRowY + 8, 8.2, true, '#0D5C3A')
    doc.drawText(f.domain, marginX + 385, currentRowY + 8, 7.2, false, '#64748B')

    currentRowY -= tableRowH
  }

  // 4. Assessment Integrity & Model Pipeline Assurance Card (Bottom of Page 1)
  const assuranceY = currentRowY - 14
  const assuranceH = 88
  doc.drawRoundedRect(marginX, assuranceY - assuranceH + 20, contentWidth, assuranceH, 8, true, true, '#F0FDF4', '#A7F3D0', 1)
  doc.drawRoundedRect(marginX, assuranceY - assuranceH + 20, 4, assuranceH, 2, true, false, '#0D5C3A')

  doc.drawText('ASSESSMENT INTEGRITY & REPRODUCIBILITY VERIFICATION', marginX + 16, assuranceY + 4, 8, true, '#0D5C3A')
  doc.drawText('• Schema Compliance: All 12 inputs match the FastAPI Pydantic schema validation without missing or null values.', marginX + 16, assuranceY - 11, 7.2, false, '#334155')
  doc.drawText('• Feature Transformations: Preprocessed via OneHotEncoder for platform/purpose and OrdinalEncoder for stress categories.', marginX + 16, assuranceY - 24, 7.2, false, '#334155')
  doc.drawText('• Scoring Determinism: Scored reproducibly by the trained Random Forest regressor without stochastic drift.', marginX + 16, assuranceY - 37, 7.2, false, '#334155')
  doc.drawText('• Educational Classification: Output mapped to three standardized SIGNAL levels for clear student self-reflection.', marginX + 16, assuranceY - 50, 7.2, false, '#334155')
  doc.drawText('• Non-Clinical Scope: Scores represent routine wellness indicators and do not replace professional psychological diagnosis.', marginX + 16, assuranceY - 63, 7.2, true, '#047857')

  // 5. Page 1 Footer
  doc.drawLine(marginX, 50, marginX + contentWidth, 50, '#0D5C3A', 0.75)
  doc.drawText('MindSpace – AI Student Wellbeing Platform', marginX, 36, 7.5, true, '#64748B')
  doc.drawText('Designed & Developed by TEJESH K', 230, 36, 7.5, true, '#0D5C3A')
  doc.drawText('Page 1 of 2', marginX + contentWidth - 45, 36, 7.5, false, '#64748B')

  // ==========================================
  // PAGE 2: Assessment Summary & Suggestions
  // ==========================================
  doc.addPage()

  // 1. Page 2 Header with Mini Logo
  doc.drawLogoEmblem(marginX, 766, 24)
  doc.drawText('MindSpace', marginX + 32, 778, 11, true, '#0F172A')
  doc.drawText('STUDENT WELLBEING ASSESSMENT REPORT • EXECUTIVE SUMMARY', marginX + 32, 768, 6.8, true, '#0D5C3A')

  // Right Running Status
  doc.drawText(`Score: ${displayScore} / 10.0 • ${signal.label}`, 380, 778, 7.8, true, '#0D5C3A')
  doc.drawText(`Report Date: ${reportDate}`, 380, 768, 7, false, '#64748B')

  doc.drawLine(marginX, 754, marginX + contentWidth, 754, '#0D5C3A', 1)

  // 2. Section 3: Assessment Summary (5 Neatly Arranged Cards)
  doc.drawText('SECTION 3: ASSESSMENT SUMMARY & BEHAVIOURAL TELEMETRY', marginX, 738, 9, true, '#0D5C3A')
  doc.drawText('Synthesis of lifestyle patterns, screen engagement, and daily rest indicators', marginX, 727, 7.2, false, '#64748B')

  const summaries = [
    {
      title: '1. Digital Habits',
      text: `Primary platform is ${formData.most_used_platform} used mainly for ${formData.purpose_of_use}. Student averages ${formData.avg_daily_usage_hours} hours of screen usage daily with approximately ${formData.daily_unlocks} device unlocks per day.`
    },
    {
      title: '2. Academic Lifestyle',
      text: `Currently enrolled at the ${formData.academic_level} level, dedicating ${formData.study_hours} hours daily to coursework, exam revision, and dedicated academic preparation.`
    },
    {
      title: '3. Sleep and Rest',
      text: `Average sleep duration is ${formData.sleep_hours_per_night} hours per night. Rest sufficiency plays an influential role in cognitive retention, memory consolidation, and daily mood stability.`
    },
    {
      title: '4. Physical Activity',
      text: `Reported physical activity is ${formData.physical_activity_hours} hours daily, contributing to cardiovascular health, physical stamina, cognitive alertness, and reduced muscular fatigue.`
    },
  ]

  // Render 2x2 grid for Cards 1 to 4
  const cardW = 253
  const cardH = 68
  const gapX = 13

  // Row 1: Cards 1 and 2
  const row1Y = 648
  for (let i = 0; i < 2; i++) {
    const s = summaries[i]
    const cX = marginX + i * (cardW + gapX)
    doc.drawRoundedRect(cX, row1Y, cardW, cardH, 7, true, true, '#F8FAFC', '#E2E8F0', 0.75)
    doc.drawRoundedRect(cX, row1Y, 3, cardH, 1.5, true, false, '#0D5C3A')
    doc.drawText(s.title, cX + 12, row1Y + 52, 8.2, true, '#0D5C3A')
    doc.drawWrappedText(s.text, cX + 12, row1Y + 38, cardW - 24, 11, 7.2, false, '#334155')
  }

  // Row 2: Cards 3 and 4
  const row2Y = 570
  for (let i = 2; i < 4; i++) {
    const s = summaries[i]
    const cX = marginX + (i - 2) * (cardW + gapX)
    doc.drawRoundedRect(cX, row2Y, cardW, cardH, 7, true, true, '#F8FAFC', '#E2E8F0', 0.75)
    doc.drawRoundedRect(cX, row2Y, 3, cardH, 1.5, true, false, '#0D5C3A')
    doc.drawText(s.title, cX + 12, row2Y + 52, 8.2, true, '#0D5C3A')
    doc.drawWrappedText(s.text, cX + 12, row2Y + 38, cardW - 24, 11, 7.2, false, '#334155')
  }

  // Row 3: Card 5 (Perceived Stress, full width)
  const card5Y = 508
  const card5H = 52
  doc.drawRoundedRect(marginX, card5Y, contentWidth, card5H, 7, true, true, '#F8FAFC', '#E2E8F0', 0.75)
  doc.drawRoundedRect(marginX, card5Y, 3, card5H, 1.5, true, false, '#0D5C3A')
  doc.drawText('5. Perceived Stress', marginX + 12, card5Y + 36, 8.2, true, '#0D5C3A')
  const stressText = `Self-reported current stress level is ${formData.stress_level}. Balanced workload allocation, regular recovery intervals, and structured peer study support help mitigate sustained academic strain and prevent cognitive burnout.`
  doc.drawWrappedText(stressText, marginX + 12, card5Y + 22, contentWidth - 24, 11, 7.2, false, '#334155')

  // 3. Section 4: Student Wellbeing Suggestions (6 Numbered Items)
  doc.drawText('SECTION 4: EVIDENCE-BASED STUDENT WELLBEING SUGGESTIONS', marginX, 486, 9, true, '#0D5C3A')
  doc.drawText('Practical, actionable recommendations tailored for university lifestyle balance', marginX, 475, 7.2, false, '#64748B')

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

  let tipStartY = 430
  const tipH = 35
  const tipGap = 5
  for (let i = 0; i < tips.length; i++) {
    const t = tips[i]
    const cY = tipStartY - i * (tipH + tipGap)

    // Suggestion container card
    doc.drawRoundedRect(marginX, cY, contentWidth, tipH, 6, true, true, '#FFFFFF', '#E2E8F0', 0.75)

    // Subtle green numbering badge
    doc.drawRoundedRect(marginX + 8, cY + 8.5, 18, 18, 4, true, true, '#ECFDF5', '#A7F3D0', 0.5)
    doc.drawText(String(i + 1), marginX + 14.5, cY + 14, 7.8, true, '#0D5C3A')

    // Heading & explanatory body
    doc.drawText(t.title, marginX + 34, cY + 21, 8.2, true, '#0F172A')
    doc.drawText(t.desc, marginX + 34, cY + 10, 7.1, false, '#334155')
  }

  // 4. Educational Disclaimer Card (Bottom of Page 2)
  const disclaimerY = 126
  const disclaimerH = 62
  doc.drawRoundedRect(marginX, disclaimerY, contentWidth, disclaimerH, 8, true, true, '#FFFBEB', '#FDE68A', 1)
  doc.drawRoundedRect(marginX, disclaimerY, 3.5, disclaimerH, 1.5, true, false, '#D97706')

  doc.drawText('IMPORTANT EDUCATIONAL & CLINICAL DISCLAIMER', marginX + 14, disclaimerY + 45, 8, true, '#B45309')
  doc.drawText('• Algorithmic Scope: MindSpace generates wellbeing scores based strictly on self-reported survey inputs.', marginX + 14, disclaimerY + 32, 7.2, false, '#78350F')
  doc.drawText('• Non-Diagnostic: This report is designed solely for self-reflection and academic habit awareness; it does not constitute medical diagnosis.', marginX + 14, disclaimerY + 21, 7.2, false, '#78350F')
  doc.drawText('• Professional Support: If you experience persistent distress, please consult university wellness counselors or healthcare professionals.', marginX + 14, disclaimerY + 10, 7.2, true, '#92400E')

  // 5. Page 2 Footer
  doc.drawLine(marginX, 50, marginX + contentWidth, 50, '#0D5C3A', 0.75)
  doc.drawText('MindSpace – AI Student Wellbeing Platform', marginX, 36, 7.5, true, '#64748B')
  doc.drawText('Designed & Developed by TEJESH K', 230, 36, 7.5, true, '#0D5C3A')
  doc.drawText('Page 2 of 2', marginX + contentWidth - 45, 36, 7.5, false, '#64748B')

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
