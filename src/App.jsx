import React, { useState, useEffect } from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { useTheme } from '@mui/material/styles';
import bgImage from './1734191248015340.jpg';

// --- Helper Functions for Calculation ---

const calculateYearProgress = () => {
  const now = new Date();
  const year = now.getFullYear();
  const startOfYear = new Date(year, 0, 1); // Jan 1st
  const endOfYear = new Date(year + 1, 0, 1); // Jan 1st of next year

  const elapsed = now.getTime() - startOfYear.getTime();
  const total = endOfYear.getTime() - startOfYear.getTime();

  const percentage = (elapsed / total) * 100;

  // Day calculations
  const dayOfYear = Math.floor(elapsed / (1000 * 60 * 60 * 24)) + 1;
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDaysInYear = isLeap ? 366 : 365;

  return {
    percentage,
    year,
    dayOfYear,
    totalDaysInYear,
  };
};


// --- The Main Component ---

function YearProgress() {
  const theme = useTheme();
  const [progress, setProgress] = useState(calculateYearProgress());
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(calculateYearProgress());
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures this runs only once on mount


  // --- Visuals ---

  // Calculate daysPassed and daysLeft
  const daysPassed = progress.dayOfYear;
  const daysLeft = progress.totalDaysInYear - daysPassed;

  // Create the block representation of the year (e.g., 100 blocks)
  const totalBlocks = 100;
  const filledBlocks = Math.floor(progress.percentage);
  const emptyBlocks = totalBlocks - filledBlocks;
  const progressBlocks = '▓'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

  // Create matrixDays: one element per day in the year, 'filled' if day index < daysPassed, else 'empty'
  const matrixDays = Array.from({ length: progress.totalDaysInYear }, (_, i) =>
    i < daysPassed ? 'filled' : 'empty'
  );

  // --- Styles ---

  const styles = {
    container: {
      position: 'relative',
      color: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      fontFamily: "'Fira Code', 'Source Code Pro', 'Courier New', monospace",
      fontWeight: '100',
      textAlign: 'center',
    },
    loadingTextContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      width: '80%',
      maxWidth: '600px',
      fontSize: '1rem',
      fontFamily: `monospace`,
      margin: '0.5rem 0 1.5rem 0',
      letterSpacing: '0',
      color: '#ffffffff',
      textTransform: 'uppercase',
    },
    percentageText: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#fff',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      padding: '0.3rem 0.6rem',
      borderRadius: '8px',
    },
    blocks: {
      fontSize: '0.75rem',
      letterSpacing: '0',
      wordBreak: 'break-all',
      width: '80%',
      maxWidth: '600px',
      lineHeight: '1.2',
      color: '#eeeeee1e',
    },
    dayMatrix: {
      display: 'grid',
      gridTemplateColumns: 'repeat(14, 14px)',
      gap: '6px',
      marginTop: '20px',
    },
    dayDot: {
      width: '12px',
      height: '12px',
      borderRadius: '4px',
      transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    },
    dateTime: {
      position: 'absolute',
      bottom: '10px',
      right: '20px',
      fontSize: '0.9rem',
      color: '#fff',
      fontFamily: 'monospace',
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '15px',
      padding: '18px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem',
      minWidth: '340px',
      position: 'relative',
    },
    bubble: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: '#fff',
      padding: '0.4rem 0.8rem',
      borderRadius: '12px',
      fontSize: '0.9rem',
      fontWeight: 'bold',
    },
    leftBubble: {
      position: 'static',
      margin: '0 0.5rem',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: '#fff',
      padding: '0.4rem 0.8rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
    },
    rightBubble: {
      position: 'static',
      margin: '0 0.5rem',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      color: '#fff',
      padding: '0.4rem 0.8rem',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
    },
  };


  return (
    <div style={styles.container}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          filter: 'blur(8px)',
          opacity: 0.9,
          zIndex: -1
        }}
      />
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span style={styles.leftBubble}>{progress.year}</span>
          <span style={styles.rightBubble}>{progress.percentage.toFixed(4)}%</span>
        </div>
        <LinearProgress
          variant="determinate"
          value={progress.percentage}
          sx={{
            width: '95%',
            maxWidth: '600px',
            height: '30px',
            borderRadius: '15px',
            backgroundColor: '#00000033',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#fff',
            },
            '&:hover': {
              boxShadow: '0 0 10px #fff',
              transition: 'box-shadow 0.3s ease',
            },
          }}
        />
        <div style={styles.dayMatrix}>
          {matrixDays.map((status, idx) => (
            <div
              key={idx}
              style={{
                ...styles.dayDot,
                backgroundColor: status === 'filled'
                  ? 'rgba(255,255,255,0.85)'
                  : 'rgba(255,255,255,0.3)',
                boxShadow: hoveredIndex === idx
                  ? `0 0 6px ${theme.palette.primary.light}`
                  : 'none',
                transform: hoveredIndex === idx ? 'scale(1.2)' : 'scale(1)',
              }}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            ></div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <span style={styles.bubble}>{daysPassed} days passed</span>
          <span style={styles.bubble}>{daysLeft} days remaining</span>
        </div>
      </div>
      <div style={styles.dateTime}>
        {new Date().toLocaleString()}
      </div>
    </div>
  );
}

export default YearProgress;