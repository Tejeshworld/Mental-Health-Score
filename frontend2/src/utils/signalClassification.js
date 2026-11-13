/**
 * MindSpace – Centralized SIGNAL Classification Utility
 * 
 * Preliminary Thresholds (based on predicted score out of 10.0):
 * - STRONG SIGNAL (Green) : Score >= 7.0
 * - MEDIUM SIGNAL (Yellow): Score >= 5.0 and < 7.0
 * - WEAK SIGNAL (Red)     : Score < 5.0
 * 
 * Note: These thresholds serve as preliminary educational indicators
 * based on self-reported survey inputs and are not a medical or clinical diagnosis.
 */

export function getSignalClassification(score) {
  if (score === null || score === undefined || isNaN(Number(score))) {
    return {
      status: 'PENDING',
      label: 'PENDING EVALUATION',
      color: '#9AAFA5',
      colorHex: '#9AAFA5',
      bg: 'rgba(154, 175, 165, 0.08)',
      border: 'rgba(154, 175, 165, 0.18)',
      glow: 'none',
      description: 'Assessment score is unavailable or pending calculation.',
      notice: 'Preliminary educational indicator. Not a medical or clinical diagnosis.',
    }
  }

  const num = Number(score)

  if (num >= 7.0) {
    return {
      status: 'STRONG',
      label: 'STRONG SIGNAL',
      tag: 'Positive Equilibrium',
      color: '#36D6A0', // Refined mint green
      colorHex: '#36D6A0',
      rgb: '54, 214, 160',
      bg: 'rgba(54, 214, 160, 0.10)',
      border: 'rgba(54, 214, 160, 0.32)',
      glow: '0 0 24px rgba(54, 214, 160, 0.22)',
      description: 'Positive wellbeing indicators. Continue maintaining a healthy balance between academics, sleep, physical activity, and digital habits.',
      notice: 'Preliminary educational indicator based on self-reported survey inputs. Not a substitute for clinical or medical assessment.',
    }
  }

  if (num >= 5.0) {
    return {
      status: 'MEDIUM',
      label: 'MEDIUM SIGNAL',
      tag: 'Attention Suggested',
      color: '#F5C842', // Warm amber yellow
      colorHex: '#F5C842',
      rgb: '245, 200, 66',
      bg: 'rgba(245, 200, 66, 0.10)',
      border: 'rgba(245, 200, 66, 0.32)',
      glow: '0 0 24px rgba(245, 200, 66, 0.20)',
      description: 'Some wellbeing indicators may need attention. Consider improving sleep consistency, managing screen time, and balancing academic activities.',
      notice: 'Preliminary educational indicator based on self-reported survey inputs. Not a substitute for clinical or medical assessment.',
    }
  }

  return {
    status: 'WEAK',
    label: 'WEAK SIGNAL',
    tag: 'Support Recommended',
    color: '#F4756A', // Soft coral red
    colorHex: '#F4756A',
    rgb: '244, 117, 106',
    bg: 'rgba(244, 117, 106, 0.10)',
    border: 'rgba(244, 117, 106, 0.32)',
    glow: '0 0 24px rgba(244, 117, 106, 0.22)',
    description: 'Several wellbeing indicators may require attention. Consider speaking with a trusted person, student counsellor, or qualified professional.',
    notice: 'Preliminary educational indicator based on self-reported survey inputs. Not a substitute for clinical or medical assessment.',
  }
}

