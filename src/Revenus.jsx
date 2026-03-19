/**
 * REVENUS DASHBOARD - GAMING RPG STYLE (Dofus-inspired)
 * Suivi épargne avec effet collectible/trophy
 */

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── DONNÉES ──────────────────────────────────────────────────────────────────
const revenusConfig = {
  "joursConges": ["2026-02-03", "2026-02-04"],
  "retraitsEpargne": 0,
  "epargneReelleTotale": 3000,
  "historiqueEpargne": {
    "2026-01": 256,
    "2026-02": 2000
  }
};

const chargesData = {
  "chargesFixes": {
    "maisonLocation": [
      { "libelle": "Loyer", "montant": 1000, "jourPrelevement": 5 },
      { "libelle": "Gaz", "montant": 209, "jourPrelevement": 5 },
      { "libelle": "Électricité", "montant": 77, "jourPrelevement": 5 },
      { "libelle": "Garage", "montant": 80, "jourPrelevement": 5 },
      { "libelle": "Eau", "montant": 50, "jourPrelevement": 5 }
    ],
    "abonnements": [
      { "libelle": "Free Sophia", "montant": 10, "jourPrelevement": 10 },
      { "libelle": "Orange (1ère partie)", "montant": 29, "jourPrelevement": 9 },
      { "libelle": "Orange (2ème partie)", "montant": 4, "jourPrelevement": 24 },
      { "libelle": "Free Hicham", "montant": 9, "jourPrelevement": 10 },
      { "libelle": "Netflix", "montant": 10, "jourPrelevement": 10 },
      { "libelle": "Amazon Prime", "montant": 10, "jourPrelevement": 10 },
      { "libelle": "Apple Storage", "montant": 13, "jourPrelevement": 10 },
      { "libelle": "Adobe", "montant": 37, "jourPrelevement": 9 },
      { "libelle": "Microsoft", "montant": 10, "jourPrelevement": 10 },
      { "libelle": "LCL", "montant": 12, "jourPrelevement": 10 },
      { "libelle": "Basic Fit", "montant": 25, "jourPrelevement": 9 },
      { "libelle": "Freepik", "montant": 19, "jourPrelevement": 3 },
      { "libelle": "Claude", "montant": 110, "jourPrelevement": 18 },
      { "libelle": "Uber Eats", "montant": 6, "jourPrelevement": 10 }
    ],
    "chargesVoiture": [
      { "libelle": "Assurance", "montant": 125, "jourPrelevement": 5 },
      { "libelle": "Gazoil (semaine 1)", "montant": 50, "jourPrelevement": 5 },
      { "libelle": "Gazoil (semaine 2)", "montant": 50, "jourPrelevement": 11 },
      { "libelle": "Gazoil (semaine 3)", "montant": 50, "jourPrelevement": 19 },
      { "libelle": "Gazoil (semaine 4)", "montant": 50, "jourPrelevement": 25 }
    ],
    "famille": [
      { "libelle": "Hajiba", "montant": 150, "jourPrelevement": 5 },
      { "libelle": "Sophia", "montant": 100, "jourPrelevement": 5 },
      { "libelle": "Hicham SAPIN (1ère partie)", "montant": 75, "jourPrelevement": 5 },
      { "libelle": "Hicham SAPIN (2ème partie)", "montant": 75, "jourPrelevement": 20 }
    ],
    "courses": [
      { "libelle": "Courses (semaine 1)", "montant": 200, "jourPrelevement": 5 },
      { "libelle": "Courses (semaine 2)", "montant": 200, "jourPrelevement": 12 },
      { "libelle": "Courses (semaine 3)", "montant": 200, "jourPrelevement": 19 },
      { "libelle": "Courses (semaine 4)", "montant": 200, "jourPrelevement": 26 }
    ],
    "deplacementBureau": [
      { "libelle": "Déplacement (semaine 1)", "montant": 25, "jourPrelevement": 5 },
      { "libelle": "Déplacement (semaine 2)", "montant": 25, "jourPrelevement": 12 },
      { "libelle": "Déplacement (semaine 3)", "montant": 25, "jourPrelevement": 19 },
      { "libelle": "Déplacement (semaine 4)", "montant": 25, "jourPrelevement": 26 }
    ],
    "chargesAnnexes": [
      { "libelle": "Charges Annexes (1-10)", "montant": 100, "jourPrelevement": 10 },
      { "libelle": "Charges Annexes (11-20)", "montant": 100, "jourPrelevement": 20 },
      { "libelle": "Charges Annexes (21-30)", "montant": 100, "jourPrelevement": 30 }
    ]
  },
  "credits": [
    { "libelle": "LCL Crédit", "montant": 333, "jourPrelevement": 9, "dateFin": "2026-05-31" },
    { "libelle": "Mac", "montant": 273, "jourPrelevement": 21, "dateFin": "2026-06-30" },
    { "libelle": "Voiture", "montant": 583, "jourPrelevement": 15, "dateFin": "2028-03-31" },
    { "libelle": "Rajaa", "montant": 200, "jourPrelevement": 5, "dateFin": "2027-09-30" }
  ]
};

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const MISSION_START = new Date('2026-01-19');
const TJM_NET = 340;
const SAVINGS_RATE = 0.30;

// Objectifs épargne
const GOAL_6_MONTHS = 10000;
const GOAL_1_YEAR = 20000;
const GOAL_2_YEARS = 50000;

// Achievements (trophées débloquables)
const MILESTONES = [
  { amount: 1000, label: '1K', emoji: '🥉', color: '#cd7f32', rarity: 'common' },
  { amount: 2000, label: '2K', emoji: '🥈', color: '#c0c0c0', rarity: 'uncommon' },
  { amount: 5000, label: '5K', emoji: '🥇', color: '#ffd700', rarity: 'rare' },
  { amount: 10000, label: '10K', emoji: '💎', color: '#8b5cf6', rarity: 'epic' },
  { amount: 20000, label: '20K', emoji: '👑', color: '#f59e0b', rarity: 'legendary' },
  { amount: 50000, label: '50K', emoji: '🚀', color: '#ef4444', rarity: 'mythic' },
];

// Jours fériés français 2026
const JOURS_FERIES_2026 = [
  '2026-01-01', '2026-04-06', '2026-05-01', '2026-05-08', '2026-05-14',
  '2026-05-25', '2026-07-14', '2026-08-15', '2026-11-01', '2026-11-11', '2026-12-25',
];

// ─── CALCUL JOURS OUVRÉS ─────────────────────────────────────────────────────
const isJourOuvre = (date) => {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const dateStr = date.toISOString().split('T')[0];
  const isFerie = JOURS_FERIES_2026.includes(dateStr);
  const isConge = revenusConfig.joursConges.includes(dateStr);
  return !isWeekend && !isFerie && !isConge;
};

const countJoursOuvresBetween = (startDate, endDate) => {
  let count = 0;
  let current = new Date(startDate);
  const end = new Date(endDate);
  current.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  while (current <= end) {
    if (isJourOuvre(current)) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
};

// ─── CALCUL CHARGES MENSUELLES ───────────────────────────────────────────────
const calculateChargesForMonth = (date) => {
  const maisonTotal = chargesData.chargesFixes.maisonLocation.reduce((sum, c) => sum + c.montant, 0);
  const abonnementsTotal = chargesData.chargesFixes.abonnements.reduce((sum, c) => sum + c.montant, 0);
  const voitureTotal = chargesData.chargesFixes.chargesVoiture.reduce((sum, c) => sum + c.montant, 0);
  const familleTotal = chargesData.chargesFixes.famille.reduce((sum, c) => sum + c.montant, 0);
  const coursesTotal = chargesData.chargesFixes.courses.reduce((sum, c) => sum + c.montant, 0);
  const deplacementTotal = chargesData.chargesFixes.deplacementBureau.reduce((sum, c) => sum + c.montant, 0);
  const chargesAnnexesTotal = chargesData.chargesFixes.chargesAnnexes.reduce((sum, c) => sum + c.montant, 0);
  const chargesFixes = maisonTotal + abonnementsTotal + voitureTotal + familleTotal + coursesTotal + deplacementTotal + chargesAnnexesTotal;

  const creditsActifs = chargesData.credits.filter(credit => {
    const dateFin = new Date(credit.dateFin);
    return date <= dateFin;
  });
  const creditsTotal = creditsActifs.reduce((sum, credit) => sum + credit.montant, 0);

  return { chargesFixes, credits: creditsActifs, creditsTotal, total: chargesFixes + creditsTotal };
};

// ─── GÉNÉRER PROJECTIONS MENSUELLES ──────────────────────────────────────────
const generateMonthlyProjections = () => {
  const projections = [];
  const startDate = new Date('2026-01-01');
  const endDate = new Date('2027-12-31');
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    let firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Exception janvier 2026
    if (year === 2026 && month === 0) {
      firstDay = new Date('2026-01-19');
    }

    const joursOuvres = countJoursOuvresBetween(firstDay, lastDay);
    const revenu = joursOuvres * TJM_NET;
    const charges = calculateChargesForMonth(currentDate);
    const epargne = revenu * SAVINGS_RATE;

    const nomMois = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const moisCourt = currentDate.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();

    projections.push({
      date: new Date(currentDate),
      nomMois,
      moisCourt,
      annee: year,
      jours: joursOuvres,
      revenu,
      charges: charges.total,
      epargne,
    });

    currentDate = new Date(year, month + 1, 1);
  }
  return projections;
};

// ─── COMPOSANT PRINCIPAL ──────────────────────────────────────────────────────
const Revenus = () => {
  const [showRevenusModal, setShowRevenusModal] = useState(false);
  const [showDepensesModal, setShowDepensesModal] = useState(false);
  const [showEpargneModal, setShowEpargneModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  window.addEventListener('resize', () => setIsMobile(window.innerWidth < 768));

  const stats = useMemo(() => {
    const today = new Date();

    // Calculs revenus
    const janEnd = new Date('2026-01-31');
    const joursJanvier = countJoursOuvresBetween(MISSION_START, janEnd);
    const revenuJanvier = joursJanvier * TJM_NET;

    const fevStart = new Date('2026-02-01');
    const fevEnd = new Date('2026-02-28');
    const joursFevrier = countJoursOuvresBetween(fevStart, fevEnd);
    const revenuFevrier = joursFevrier * TJM_NET;

    const marsStart = new Date('2026-03-01');
    const marsEnd = today.getMonth() === 2 ? today : new Date('2026-03-31');
    const joursMars = today >= marsStart ? countJoursOuvresBetween(marsStart, marsEnd) : 0;
    const revenuMars = joursMars * TJM_NET;

    // Mars COMPLET (pour projection fin de mois)
    const marsEndComplet = new Date('2026-03-31');
    const joursMarsComplet = countJoursOuvresBetween(marsStart, marsEndComplet);
    const revenuMarsComplet = joursMarsComplet * TJM_NET;

    const totalJours = joursJanvier + joursFevrier + joursMars;
    const totalRevenu = revenuJanvier + revenuFevrier + revenuMars;

    // Calculs charges
    const chargesJanvier = calculateChargesForMonth(new Date('2026-01-15'));
    const chargesFevrier = calculateChargesForMonth(new Date('2026-02-15'));
    const chargesMars = calculateChargesForMonth(new Date('2026-03-15'));
    const totalCharges = chargesJanvier.total + chargesFevrier.total + chargesMars.total;

    // Calculs épargne - 100% DYNAMIQUE basé sur la règle: Jours × TJM × 30%
    const retraits = revenusConfig.retraitsEpargne || 0;

    const epargneJanvier = revenuJanvier * SAVINGS_RATE;
    const epargneFevrier = revenuFevrier * SAVINGS_RATE;
    const epargneMars = revenuMars * SAVINGS_RATE;
    const epargneMarsComplet = revenuMarsComplet * SAVINGS_RATE;

    const epargneBrute = epargneJanvier + epargneFevrier + epargneMars;
    const epargneTotale = epargneBrute - retraits;

    // Projection fin mars
    const epargneFinMars = epargneJanvier + epargneFevrier + epargneMarsComplet - retraits;

    // Projections futures
    const in6Months = new Date(MISSION_START);
    in6Months.setMonth(in6Months.getMonth() + 6);
    const joursIn6Months = countJoursOuvresBetween(MISSION_START, in6Months);
    const revenuIn6Months = joursIn6Months * TJM_NET;
    const epargneIn6Months = revenuIn6Months * SAVINGS_RATE;

    const endOf2026 = new Date('2026-12-31');
    const joursEndOf2026 = countJoursOuvresBetween(MISSION_START, endOf2026);
    const revenuEndOf2026 = joursEndOf2026 * TJM_NET;
    const epargneEndOf2026 = revenuEndOf2026 * SAVINGS_RATE;

    const endOf2027 = new Date('2027-12-31');
    const joursEndOf2027 = countJoursOuvresBetween(MISSION_START, endOf2027);
    const revenuEndOf2027 = joursEndOf2027 * TJM_NET;
    const epargneEndOf2027 = revenuEndOf2027 * SAVINGS_RATE;

    // Achievements
    const unlockedMilestones = MILESTONES.filter(m => epargneTotale >= m.amount);
    const nextMilestone = MILESTONES.find(m => epargneTotale < m.amount);

    // Streak
    let streak = 0;
    let checkDate = new Date(today);
    while (checkDate >= MISSION_START) {
      if (isJourOuvre(checkDate)) streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      totalJours,
      totalRevenu,
      totalCharges,
      epargne: {
        totale: epargneTotale,
        brute: epargneBrute,
        retraits,
        janvier: epargneJanvier,
        fevrier: epargneFevrier,
        mars: epargneMars,
      },
      epargneFinMars,
      projections: {
        in6Months: { jours: joursIn6Months, revenu: revenuIn6Months, epargne: epargneIn6Months },
        endOf2026: { jours: joursEndOf2026, revenu: revenuEndOf2026, epargne: epargneEndOf2026 },
        endOf2027: { jours: joursEndOf2027, revenu: revenuEndOf2027, epargne: epargneEndOf2027 },
      },
      milestones: { unlocked: unlockedMilestones, next: nextMilestone },
      streak,
      historiqueRevenu: [
        { mois: 'Janvier', jours: joursJanvier, revenu: revenuJanvier },
        { mois: 'Février', jours: joursFevrier, revenu: revenuFevrier },
        { mois: 'Mars', jours: joursMars, revenu: revenuMars },
      ],
      historiqueCharges: [
        { mois: 'Janvier', charges: chargesJanvier.total },
        { mois: 'Février', charges: chargesFevrier.total },
        { mois: 'Mars', charges: chargesMars.total },
      ],
      historiqueEpargne: [
        { mois: 'Janvier', epargne: epargneJanvier },
        { mois: 'Février', epargne: epargneFevrier },
        { mois: 'Mars', epargne: epargneMars },
      ],
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1335 50%, #0a0e1a 100%)',
      padding: isMobile ? '16px' : '40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Effet particules gaming */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* HERO ÉPARGNE - Style Gaming RPG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.4) 0%, rgba(124, 58, 237, 0.25) 50%, rgba(99, 102, 241, 0.3) 100%)',
            border: '3px solid rgba(139, 92, 246, 0.8)',
            borderRadius: isMobile ? '20px' : '32px',
            padding: isMobile ? '24px' : '56px',
            marginBottom: isMobile ? '24px' : '40px',
            boxShadow: '0 0 80px rgba(139, 92, 246, 0.6), inset 0 0 40px rgba(139, 92, 246, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >

          {/* Racing stripe */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: 'linear-gradient(90deg, #8b5cf6 0%, #f59e0b 50%, #8b5cf6 100%)',
            boxShadow: '0 0 30px rgba(139, 92, 246, 1)',
          }} />

          <div style={{ textAlign: 'center' }}>
            {/* Titre avec effet gaming */}
            <motion.p
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              style={{
                margin: '0 0 24px 0',
                fontSize: '16px',
                fontWeight: '900',
                color: '#a78bfa',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                textShadow: '0 0 20px rgba(167, 139, 250, 0.8)',
              }}
            >
              💎 ÉPARGNE TOTALE
            </motion.p>

            {/* Montant principal avec effet XP */}
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: 'spring', delay: 0.2 }}
              style={{
                margin: '0 0 16px 0',
                fontSize: isMobile ? '56px' : '96px',
                fontWeight: '900',
                color: '#ffffff',
                lineHeight: 1,
                fontFamily: 'monospace',
                textShadow: '0 0 80px rgba(139, 92, 246, 1), 0 0 40px rgba(139, 92, 246, 0.8), 0 4px 8px rgba(0,0,0,0.5)',
                background: 'linear-gradient(180deg, #ffffff 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {stats.epargne.totale.toLocaleString('fr-FR')}€
            </motion.p>

            {/* Barre XP vers prochain achievement */}
            {stats.milestones.next && (
              <div style={{
                width: '100%',
                maxWidth: '700px',
                margin: '0 auto 32px auto',
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '16px',
                height: '32px',
                border: '2px solid rgba(139, 92, 246, 0.6)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.5)',
              }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((stats.epargne.totale / stats.milestones.next.amount) * 100, 100)}%` }}
                  transition={{ duration: 1.5, delay: 0.5, type: 'spring' }}
                  style={{
                    height: '100%',
                    background: `linear-gradient(90deg, ${stats.milestones.next.color} 0%, ${stats.milestones.next.color}cc 50%, ${stats.milestones.next.color}99 100%)`,
                    boxShadow: `0 0 30px ${stats.milestones.next.color}, inset 0 1px 2px rgba(255,255,255,0.3)`,
                    position: 'relative',
                  }}
                >
                  {/* Effet de brillance animé */}
                  <motion.div
                    animate={{ x: ['0%', '200%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-50%',
                      width: '50%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    }}
                  />
                </motion.div>
                <p style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: '900',
                  color: '#ffffff',
                  textShadow: '0 0 10px rgba(0, 0, 0, 1), 0 2px 4px rgba(0,0,0,0.8)',
                  letterSpacing: '1px',
                }}>
                  {stats.epargne.totale.toLocaleString('fr-FR')}€ / {stats.milestones.next.amount.toLocaleString('fr-FR')}€
                </p>
              </div>
            )}

            {/* Objectif avec effet gaming */}
            {stats.milestones.next && (
              <p style={{
                margin: '0 0 40px 0',
                fontSize: '14px',
                color: '#94a3b8',
                fontWeight: '700',
              }}>
                <span style={{ color: stats.milestones.next.color, fontWeight: '900', textTransform: 'uppercase' }}>{stats.milestones.next.rarity} {stats.milestones.next.emoji}</span> •
                {' '}Encore <span style={{ color: '#f59e0b', fontWeight: '900' }}>{(stats.milestones.next.amount - stats.epargne.totale).toLocaleString('fr-FR')}€</span> à farmer 🔥
                <br />
                <span style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', display: 'inline-block' }}>
                  D'ici fin mars tu auras <span style={{ color: '#10b981', fontWeight: '900' }}>{stats.epargneFinMars.toLocaleString('fr-FR')}€</span> au total
                </span>
              </p>
            )}

            {/* ACHIEVEMENTS / TROPHÉES */}
            <div style={{
              padding: '32px',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '20px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              marginBottom: '32px',
            }}>
              <p style={{
                margin: '0 0 24px 0',
                fontSize: '12px',
                fontWeight: '900',
                color: '#a78bfa',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}>
                🏆 ACHIEVEMENTS ROADMAP
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                {MILESTONES.map((milestone, index) => {
                  const unlocked = stats.epargne.totale >= milestone.amount;
                  return (
                    <div key={milestone.amount} style={{ width: '100%', maxWidth: isMobile ? '100%' : '400px', position: 'relative' }}>
                      {/* Timeline connector */}
                      {index < MILESTONES.length - 1 && (
                        <div style={{
                          position: 'absolute',
                          left: '50%',
                          top: '100%',
                          width: '3px',
                          height: '16px',
                          background: unlocked
                            ? `linear-gradient(180deg, ${milestone.color} 0%, ${MILESTONES[index + 1].color} 100%)`
                            : 'rgba(71, 85, 105, 0.3)',
                          transform: 'translateX(-50%)',
                          zIndex: 0,
                        }} />
                      )}

                      <motion.div
                        whileHover={unlocked ? { scale: 1.05 } : {}}
                        style={{
                          width: '100%',
                          padding: isMobile ? '12px 14px' : '20px',
                          background: unlocked
                            ? `linear-gradient(135deg, ${milestone.color}40, ${milestone.color}20)`
                            : 'rgba(71, 85, 105, 0.2)',
                          border: `3px solid ${unlocked ? milestone.color : '#475569'}`,
                          borderRadius: isMobile ? '16px' : '20px',
                          opacity: unlocked ? 1 : 0.4,
                          filter: unlocked ? 'none' : 'grayscale(100%)',
                          transition: 'all 0.3s',
                          cursor: unlocked ? 'pointer' : 'default',
                          boxShadow: unlocked ? `0 0 24px ${milestone.color}80, 0 4px 12px rgba(0,0,0,0.4)` : 'none',
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '16px' : '20px', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px' }}>
                            <span style={{
                              fontSize: isMobile ? '40px' : '48px',
                              textShadow: unlocked ? `0 0 20px ${milestone.color}` : 'none',
                              filter: unlocked ? `drop-shadow(0 0 15px ${milestone.color})` : 'none',
                            }}>
                              {milestone.emoji}
                            </span>
                            <div>
                              <div style={{
                                fontSize: isMobile ? '20px' : '24px',
                                fontWeight: '900',
                                color: unlocked ? milestone.color : '#64748b',
                                fontFamily: 'monospace',
                                textShadow: unlocked ? `0 0 12px ${milestone.color}` : 'none',
                                marginBottom: '4px',
                              }}>
                                {milestone.label}
                              </div>
                              <div style={{
                                fontSize: isMobile ? '11px' : '12px',
                                fontWeight: '800',
                                color: unlocked ? '#94a3b8' : '#475569',
                                textTransform: 'uppercase',
                                letterSpacing: '1.5px',
                              }}>
                                {milestone.rarity}
                              </div>
                            </div>
                          </div>
                          {unlocked && (
                            <div style={{
                              fontSize: isMobile ? '24px' : '28px',
                              filter: `drop-shadow(0 0 10px ${milestone.color})`,
                            }}>
                              ✓
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
              <p style={{
                margin: '20px 0 0 0',
                fontSize: isMobile ? '11px' : '13px',
                color: '#94a3b8',
                fontWeight: '700',
                textAlign: 'center',
              }}>
                <span style={{ color: '#10b981', fontWeight: '900' }}>{stats.milestones.unlocked.length}/{MILESTONES.length}</span> trophées débloqués
                {stats.milestones.next && (
                  <>
                    <br />
                    <span style={{ marginTop: '8px', display: 'inline-block' }}>
                      • <span style={{ color: '#f59e0b' }}>Prochain</span> : {stats.milestones.next.emoji} {stats.milestones.next.label} ({stats.milestones.next.amount.toLocaleString('fr-FR')}€)
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* PROJECTIONS MOTIVANTES */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap: isMobile ? '16px' : '20px',
              marginBottom: isMobile ? '24px' : '32px',
            }}>
              {/* Dans 6 mois */}
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(139, 92, 246, 0.1))',
                border: '2px solid rgba(139, 92, 246, 0.5)',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '900', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  📅 Dans 6 mois
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '40px', fontWeight: '900', color: '#ffffff', fontFamily: 'monospace', textShadow: '0 0 20px rgba(139, 92, 246, 0.8)' }}>
                  {stats.projections.in6Months.epargne.toLocaleString('fr-FR')}€
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>
                  Objectif : {GOAL_6_MONTHS.toLocaleString('fr-FR')}€
                  {stats.projections.in6Months.epargne >= GOAL_6_MONTHS ? ' ✅' : ' 🎯'}
                </p>
              </div>

              {/* Fin 2026 */}
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.1))',
                border: '2px solid rgba(245, 158, 11, 0.5)',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)',
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '900', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  📅 Fin 2026 (1 an)
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '40px', fontWeight: '900', color: '#ffffff', fontFamily: 'monospace', textShadow: '0 0 20px rgba(245, 158, 11, 0.8)' }}>
                  {stats.projections.endOf2026.epargne.toLocaleString('fr-FR')}€
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>
                  Objectif : {GOAL_1_YEAR.toLocaleString('fr-FR')}€
                  {stats.projections.endOf2026.epargne >= GOAL_1_YEAR ? ' ✅' : ' 🎯'}
                </p>
              </div>

              {/* Fin 2027 */}
              <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(239, 68, 68, 0.1))',
                border: '2px solid rgba(239, 68, 68, 0.5)',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
              }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '900', color: '#ef4444', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  🚀 Fin 2027 (2 ans)
                </p>
                <p style={{ margin: '0 0 8px 0', fontSize: '40px', fontWeight: '900', color: '#ffffff', fontFamily: 'monospace', textShadow: '0 0 20px rgba(239, 68, 68, 0.8)' }}>
                  {stats.projections.endOf2027.epargne.toLocaleString('fr-FR')}€
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>
                  Objectif : {GOAL_2_YEARS.toLocaleString('fr-FR')}€
                  {stats.projections.endOf2027.epargne >= GOAL_2_YEARS ? ' ✅' : ' 🎯'}
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* 3 KPI CLIQUABLES - Style cartes équipement */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: isMobile ? '16px' : '32px',
        }}>
          {/* REVENUS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={() => setShowRevenusModal(true)}
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3) 0%, rgba(5, 150, 105, 0.2) 100%)',
              border: '3px solid rgba(16, 185, 129, 0.6)',
              borderRadius: isMobile ? '16px' : '24px',
              padding: isMobile ? '24px' : '40px',
              boxShadow: '0 12px 40px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow effect */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 1)',
            }} />
            <p style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              fontWeight: '900',
              color: '#6ee7b7',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              💰 REVENUS
            </p>
            <p style={{
              margin: '0 0 8px 0',
              fontSize: isMobile ? '36px' : '48px',
              fontWeight: '900',
              color: '#10b981',
              lineHeight: 1,
              fontFamily: 'monospace',
              textShadow: '0 0 30px rgba(16, 185, 129, 1), 0 4px 8px rgba(0,0,0,0.5)',
            }}>
              {stats.totalRevenu.toLocaleString('fr-FR')}€
            </p>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#94a3b8',
              fontWeight: '700',
            }}>
              {stats.totalJours} jours • Click pour détails
            </p>
          </motion.div>

          {/* DÉPENSES */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => setShowDepensesModal(true)}
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.3) 0%, rgba(202, 138, 4, 0.2) 100%)',
              border: '3px solid rgba(234, 179, 8, 0.6)',
              borderRadius: isMobile ? '16px' : '24px',
              padding: isMobile ? '24px' : '40px',
              boxShadow: '0 12px 40px rgba(234, 179, 8, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, transparent, #eab308, transparent)',
              boxShadow: '0 0 20px rgba(234, 179, 8, 1)',
            }} />
            <p style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              fontWeight: '900',
              color: '#fde047',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              💸 DÉPENSES
            </p>
            <p style={{
              margin: '0 0 8px 0',
              fontSize: isMobile ? '36px' : '48px',
              fontWeight: '900',
              color: '#eab308',
              lineHeight: 1,
              fontFamily: 'monospace',
              textShadow: '0 0 30px rgba(234, 179, 8, 1), 0 4px 8px rgba(0,0,0,0.5)',
            }}>
              {stats.totalCharges.toLocaleString('fr-FR')}€
            </p>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#94a3b8',
              fontWeight: '700',
            }}>
              depuis jan 2026 • Click pour détails
            </p>
          </motion.div>

          {/* ÉPARGNE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={() => setShowEpargneModal(true)}
            whileHover={{ scale: 1.05, y: -8 }}
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(124, 58, 237, 0.2) 100%)',
              border: '3px solid rgba(139, 92, 246, 0.6)',
              borderRadius: isMobile ? '16px' : '24px',
              padding: isMobile ? '24px' : '40px',
              boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, transparent, #8b5cf6, transparent)',
              boxShadow: '0 0 20px rgba(139, 92, 246, 1)',
            }} />
            <p style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              fontWeight: '900',
              color: '#c4b5fd',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}>
              💎 ÉPARGNE
            </p>
            <p style={{
              margin: '0 0 8px 0',
              fontSize: isMobile ? '36px' : '48px',
              fontWeight: '900',
              color: '#8b5cf6',
              lineHeight: 1,
              fontFamily: 'monospace',
              textShadow: '0 0 30px rgba(139, 92, 246, 1), 0 4px 8px rgba(0,0,0,0.5)',
            }}>
              {stats.epargne.totale.toLocaleString('fr-FR')}€
            </p>
            <p style={{
              margin: 0,
              fontSize: '13px',
              color: '#94a3b8',
              fontWeight: '700',
            }}>
              objectif 30% • Click pour détails
            </p>
          </motion.div>
        </div>

        {/* MODALS */}
        <AnimatePresence>
          {showRevenusModal && (
            <ModalRevenus
              stats={stats}
              onClose={() => setShowRevenusModal(false)}
              isMobile={isMobile}
            />
          )}
          {showDepensesModal && (
            <ModalDepenses
              stats={stats}
              onClose={() => setShowDepensesModal(false)}
              isMobile={isMobile}
            />
          )}
          {showEpargneModal && (
            <ModalEpargne
              stats={stats}
              onClose={() => setShowEpargneModal(false)}
              isMobile={isMobile}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ─── MODAL REVENUS ────────────────────────────────────────────────────────────
const ModalRevenus = ({ stats, onClose, isMobile }) => {
  const projections = generateMonthlyProjections();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: isMobile ? '16px' : '40px',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.5)',
          borderRadius: isMobile ? '16px' : '24px',
          padding: isMobile ? '12px' : '40px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '20px' : '32px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ margin: 0, fontSize: isMobile ? '18px' : '24px', fontWeight: '900', color: '#10b981' }}>
            💰 REVENUS - Historique & Projections
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: isMobile ? '6px 12px' : '8px 16px',
              color: '#ef4444',
              fontWeight: '900',
              cursor: 'pointer',
              fontSize: isMobile ? '12px' : '14px',
            }}
          >
            ✕ FERMER
          </button>
        </div>

        {/* Historique */}
        <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: isMobile ? '12px' : '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
            📊 HISTORIQUE
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '16px' }}>
            {stats.historiqueRevenu.map((m) => (
              <div key={m.mois} style={{
                padding: '20px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '12px',
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '800', color: '#6ee7b7' }}>
                  {m.mois.toUpperCase()}
                </p>
                <p style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: '900', color: '#10b981', fontFamily: 'monospace' }}>
                  {m.revenu.toLocaleString('fr-FR')}€
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                  {m.jours} jours
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Projections */}
        <div>
          <p style={{ margin: '0 0 16px 0', fontSize: isMobile ? '12px' : '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
            🔮 PROJECTIONS (Jan 2026 → Déc 2027)
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '8px' : '12px',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '4px',
          }}>
            {projections.map((p) => (
              <div key={`${p.annee}-${p.date.getMonth()}`} style={{
                padding: '16px',
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: '800', color: '#6ee7b7' }}>
                  {p.moisCourt} {p.annee}
                </p>
                <p style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '900', color: '#ffffff', fontFamily: 'monospace' }}>
                  {p.revenu.toLocaleString('fr-FR')}€
                </p>
                <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>
                  {p.jours}j
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── MODAL DÉPENSES ───────────────────────────────────────────────────────────
const ModalDepenses = ({ stats, onClose, isMobile }) => {
  const projections = generateMonthlyProjections();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: isMobile ? '16px' : '40px',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '2px solid rgba(234, 179, 8, 0.5)',
          borderRadius: isMobile ? '16px' : '24px',
          padding: isMobile ? '12px' : '40px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#eab308' }}>
            💸 DÉPENSES - Historique & Projections
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: '8px 16px',
              color: '#ef4444',
              fontWeight: '900',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ✕ FERMER
          </button>
        </div>

        {/* Historique */}
        <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: isMobile ? '12px' : '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
            📊 HISTORIQUE
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '16px' }}>
            {stats.historiqueCharges.map((m) => (
              <div key={m.mois} style={{
                padding: '20px',
                background: 'rgba(234, 179, 8, 0.1)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                borderRadius: '12px',
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '800', color: '#fde047' }}>
                  {m.mois.toUpperCase()}
                </p>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: '900', color: '#eab308', fontFamily: 'monospace' }}>
                  {m.charges.toLocaleString('fr-FR')}€
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Projections */}
        <div>
          <p style={{ margin: '0 0 16px 0', fontSize: isMobile ? '12px' : '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
            🔮 PROJECTIONS (Jan 2026 → Déc 2027)
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '8px' : '12px',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '4px',
          }}>
            {projections.map((p) => (
              <div key={`${p.annee}-${p.date.getMonth()}`} style={{
                padding: '16px',
                background: 'rgba(234, 179, 8, 0.05)',
                border: '1px solid rgba(234, 179, 8, 0.2)',
                borderRadius: '12px',
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: '800', color: '#fde047' }}>
                  {p.moisCourt} {p.annee}
                </p>
                <p style={{ margin: '0', fontSize: '20px', fontWeight: '900', color: '#ffffff', fontFamily: 'monospace' }}>
                  {p.charges.toLocaleString('fr-FR')}€
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── MODAL ÉPARGNE ────────────────────────────────────────────────────────────
const ModalEpargne = ({ stats, onClose, isMobile }) => {
  const projections = generateMonthlyProjections();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: isMobile ? '16px' : '40px',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
          border: '2px solid rgba(139, 92, 246, 0.5)',
          borderRadius: isMobile ? '16px' : '24px',
          padding: isMobile ? '12px' : '40px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#8b5cf6' }}>
            💎 ÉPARGNE - Historique & Projections
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              padding: '8px 16px',
              color: '#ef4444',
              fontWeight: '900',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            ✕ FERMER
          </button>
        </div>

        {/* Historique */}
        <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: isMobile ? '12px' : '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
            📊 HISTORIQUE
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '16px' }}>
            {stats.historiqueEpargne.map((m) => (
              <div key={m.mois} style={{
                padding: '20px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
              }}>
                <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '800', color: '#c4b5fd' }}>
                  {m.mois.toUpperCase()}
                </p>
                <p style={{ margin: '0', fontSize: '28px', fontWeight: '900', color: '#8b5cf6', fontFamily: 'monospace' }}>
                  {m.epargne.toLocaleString('fr-FR')}€
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Projections avec comparaison */}
        <div>
          <p style={{ margin: '0 0 16px 0', fontSize: isMobile ? '12px' : '14px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>
            🔮 PROJECTIONS (Jan 2026 → Déc 2027)
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: isMobile ? '8px' : '12px',
            maxHeight: '400px',
            overflowY: 'auto',
            padding: '4px',
          }}>
            {projections.map((p) => {
              const moisKey = `${p.annee}-${String(p.date.getMonth() + 1).padStart(2, '0')}`;
              const epargneReelle = revenusConfig.historiqueEpargne?.[moisKey];
              const today = new Date();
              const isCurrentMonth = (p.annee === today.getFullYear() && p.date.getMonth() === today.getMonth());
              const isPastMonth = p.date < today && !isCurrentMonth;

              let bgColor = 'rgba(139, 92, 246, 0.05)';
              let borderColor = 'rgba(139, 92, 246, 0.2)';
              let textColor = '#8b5cf6';

              if (epargneReelle !== undefined && isPastMonth) {
                const difference = epargneReelle - p.epargne;
                if (difference < 0) {
                  bgColor = 'rgba(239, 68, 68, 0.1)';
                  borderColor = 'rgba(239, 68, 68, 0.4)';
                  textColor = '#ef4444';
                } else {
                  bgColor = 'rgba(16, 185, 129, 0.1)';
                  borderColor = 'rgba(16, 185, 129, 0.4)';
                  textColor = '#10b981';
                }
              }

              return (
                <div key={`${p.annee}-${p.date.getMonth()}`} style={{
                  padding: '16px',
                  background: bgColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '12px',
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '11px', fontWeight: '800', color: '#c4b5fd' }}>
                    {p.moisCourt} {p.annee}
                  </p>
                  <p style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '900', color: textColor, fontFamily: 'monospace' }}>
                    {(epargneReelle ?? p.epargne).toLocaleString('fr-FR')}€
                  </p>
                  {epargneReelle !== undefined && isPastMonth && (
                    <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>
                      prévu: <span style={{ textDecoration: 'line-through' }}>{p.epargne.toLocaleString('fr-FR')}€</span>
                    </p>
                  )}
                  {epargneReelle === undefined && (
                    <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>
                      projection
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Revenus;

