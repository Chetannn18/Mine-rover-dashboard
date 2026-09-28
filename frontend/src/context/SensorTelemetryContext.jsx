import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const SensorTelemetryContext = createContext();

export function SensorTelemetryProvider({ children }) {
  // Sound Mute State
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const audioCtxRef = useRef(null);
  const buzzerIntervalRef = useRef(null);

  // Live Gas & Environmental Sensor Telemetry
  // CH4 (% vol), CO2 (ppm), CO (ppm), O2 (% vol), Temp (°C), Humidity (%), Pressure (kPa)
  const [sensors, setSensors] = useState({
    ch4: 0.12,        // Methane (% vol) - LEL: 5.0%, UEL: 15.0%
    co2: 440,         // Carbon Dioxide (ppm) - Safe: < 1000 ppm
    co: 8.4,          // Carbon Monoxide (ppm) - Safe < 25 ppm, Warning > 25, Critical > 50
    o2: 20.9,         // Oxygen (% vol) - Safe: 19.5 - 23.5%
    temp: 22.4,       // Temp (°C)
    humidity: 48.2,   // Relative Humidity (%)
    pressure: 101.3,  // kPa
    vibration: 0.14,  // mm/s PPV
    battery: 88,      // %
    signalStrength: 98 // %
  });

  // Simulation Preset: 'normal' | 'ch4_warning' | 'co_spike' | 'explosion_imminent'
  const [simMode, setSimMode] = useState('normal');

  // Historical Telemetry Data for Real-time smooth charts (last 20 points)
  const [telemetryHistory, setTelemetryHistory] = useState(() => {
    const initial = [];
    const now = Date.now();
    for (let i = 19; i >= 0; i--) {
      const t = new Date(now - i * 3000);
      const timeStr = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0')}:${t.getSeconds().toString().padStart(2, '0')}`;
      initial.push({
        time: timeStr,
        ch4: 0.12 + (Math.random() - 0.5) * 0.02,
        co2: 440 + Math.round((Math.random() - 0.5) * 20),
        co: 8.4 + (Math.random() - 0.5) * 0.5,
        o2: 20.9 + (Math.random() - 0.5) * 0.1,
        temp: 22.4 + (Math.random() - 0.5) * 0.3,
        vibration: 0.14 + (Math.random() - 0.5) * 0.04,
      });
    }
    return initial;
  });

  // Calculate Explosion & Hazard Urgency Model (Coward's Triangle & Gas Flammability Index)
  // Methane Explosive Range: 5.0% to 15.0% in presence of > 12% Oxygen
  const calculateExplosionModel = useCallback((current) => {
    const { ch4, o2, co, co2 } = current;
    let riskScore = 0; // 0 to 100
    let status = 'SAFE & STABLE'; // 'SAFE & STABLE', 'CAUTION', 'WARNING', 'CRITICAL_EXPLOSION'
    let level = 'normal'; // 'normal', 'low', 'medium', 'high', 'critical'
    let reason = 'Atmospheric gas mixture within safe subterranean thresholds.';

    // CH4 Risk Calculation
    if (ch4 >= 5.0 && o2 >= 12.0) {
      // IN EXPLOSIVE RANGE (5% to 15% CH4)
      riskScore = Math.min(100, Math.round(75 + (ch4 <= 9.5 ? (ch4 - 5) * 5.5 : (15 - ch4) * 4.5)));
      status = 'CRITICAL EXPLOSION HAZARD';
      level = 'critical';
      reason = `METHANE EXPLOSION HAZARD: CH₄ (${ch4.toFixed(2)}%) is in the explosive range (5.0% - 15.0%) with O₂ (${o2.toFixed(1)}%)!`;
    } else if (ch4 >= 2.5) {
      riskScore = Math.min(74, Math.round(50 + (ch4 - 2.5) * 10));
      status = 'HIGH EXPLOSION RISK (LEL PROXIMITY)';
      level = 'high';
      reason = `Elevated Methane (${ch4.toFixed(2)}%) approaching Lower Explosive Limit (5.0%). Immediate ventilation purge required.`;
    } else if (ch4 >= 1.0) {
      riskScore = Math.min(49, Math.round(25 + (ch4 - 1.0) * 16));
      status = 'ELEVATED GAS CAUTION';
      level = 'medium';
      reason = `Methane CH₄ detected at ${ch4.toFixed(2)}%. Auxiliary ventilation activated.`;
    } else if (co >= 50 || co2 >= 2000 || o2 < 19.5 || o2 > 23.5) {
      riskScore = Math.min(65, 35 + (co >= 50 ? 25 : 15));
      status = 'TOXIC / ASPHYXIATION WARNING';
      level = 'high';
      reason = `Toxic / Asphyxiation Alert: CO ${co.toFixed(1)} ppm, CO₂ ${co2} ppm, O₂ ${o2.toFixed(1)}%.`;
    } else if (co >= 25 || co2 >= 1000) {
      riskScore = 20;
      status = 'MINOR CAUTION';
      level = 'low';
      reason = `Carbon Monoxide / CO₂ elevated above baseline.`;
    } else {
      riskScore = Math.max(2, Math.round((ch4 / 1.0) * 8 + (co / 25) * 5));
      status = 'SAFE & STABLE';
      level = 'normal';
      reason = 'All atmospheric gas concentrations are within normal safety operating parameters.';
    }

    return {
      riskScore,
      status,
      level,
      reason,
      lelPercent: Number(((ch4 / 5.0) * 100).toFixed(1)), // % of Lower Explosive Limit (5% = 100% LEL)
      isExplosionImminent: level === 'critical',
    };
  }, []);

  const explosionRisk = calculateExplosionModel(sensors);

  // Web Audio API Buzzer Alarm Generator
  const playBuzzerTone = useCallback((frequency = 880, type = 'sawtooth', duration = 0.18) => {
    if (isAudioMuted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      // Dual tone chirp for urgency
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.4, ctx.currentTime + duration * 0.8);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio context error:', e);
    }
  }, [isAudioMuted]);

  // Audio Buzzer Loop when Alert Level is High or Critical
  useEffect(() => {
    if (buzzerIntervalRef.current) {
      clearInterval(buzzerIntervalRef.current);
      buzzerIntervalRef.current = null;
    }

    if (!isAudioMuted && (explosionRisk.level === 'critical' || explosionRisk.level === 'high')) {
      const intervalMs = explosionRisk.level === 'critical' ? 400 : 1000;
      const freq = explosionRisk.level === 'critical' ? 1200 : 750;
      playBuzzerTone(freq, 'sawtooth', explosionRisk.level === 'critical' ? 0.22 : 0.15);

      buzzerIntervalRef.current = setInterval(() => {
        playBuzzerTone(freq, 'sawtooth', explosionRisk.level === 'critical' ? 0.22 : 0.15);
      }, intervalMs);
    }

    return () => {
      if (buzzerIntervalRef.current) {
        clearInterval(buzzerIntervalRef.current);
      }
    };
  }, [explosionRisk.level, isAudioMuted, playBuzzerTone]);

  // Real-time Smooth Telemetry Updater (Every 1.2s without lag)
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prev) => {
        let nextCh4 = prev.ch4;
        let nextCo2 = prev.co2;
        let nextCo = prev.co;
        let nextO2 = prev.o2;
        let nextTemp = prev.temp;
        let nextVib = prev.vibration;

        if (simMode === 'explosion_imminent') {
          // Dangerous explosion simulation: CH4 6.8%, O2 20.4%, CO 52ppm
          nextCh4 = 6.4 + Math.sin(Date.now() / 1000) * 0.8;
          nextCo2 = 1450 + Math.round((Math.random() - 0.5) * 50);
          nextCo = 52.0 + (Math.random() - 0.5) * 2;
          nextO2 = 19.8 + (Math.random() - 0.5) * 0.2;
          nextTemp = 28.5 + (Math.random() - 0.5) * 0.4;
          nextVib = 0.45 + (Math.random() - 0.5) * 0.1;
        } else if (simMode === 'ch4_warning') {
          // CH4 near LEL warning: CH4 3.4%
          nextCh4 = 3.2 + Math.sin(Date.now() / 1500) * 0.4;
          nextCo2 = 820 + Math.round((Math.random() - 0.5) * 30);
          nextCo = 18.0 + (Math.random() - 0.5) * 1.5;
          nextO2 = 20.6 + (Math.random() - 0.5) * 0.1;
          nextTemp = 24.2 + (Math.random() - 0.5) * 0.2;
          nextVib = 0.22 + (Math.random() - 0.5) * 0.05;
        } else if (simMode === 'co_spike') {
          // CO spike
          nextCh4 = 0.35 + (Math.random() - 0.5) * 0.05;
          nextCo2 = 1800 + Math.round((Math.random() - 0.5) * 60);
          nextCo = 58.0 + (Math.random() - 0.5) * 4;
          nextO2 = 19.2 + (Math.random() - 0.5) * 0.1;
          nextTemp = 25.1 + (Math.random() - 0.5) * 0.3;
          nextVib = 0.18 + (Math.random() - 0.5) * 0.04;
        } else {
          // Normal nominal readings with realistic micro-variations
          nextCh4 = Math.max(0.05, Math.min(0.25, +(prev.ch4 + (Math.random() - 0.5) * 0.015).toFixed(3)));
          nextCo2 = Math.max(380, Math.min(550, Math.round(prev.co2 + (Math.random() - 0.5) * 6)));
          nextCo = Math.max(4.0, Math.min(12.0, +(prev.co + (Math.random() - 0.5) * 0.3).toFixed(2)));
          nextO2 = Math.max(20.6, Math.min(21.1, +(prev.o2 + (Math.random() - 0.5) * 0.05).toFixed(2)));
          nextTemp = Math.max(21.5, Math.min(23.5, +(prev.temp + (Math.random() - 0.5) * 0.1).toFixed(1)));
          nextVib = Math.max(0.08, Math.min(0.20, +(prev.vibration + (Math.random() - 0.5) * 0.02).toFixed(2)));
        }

        const updated = {
          ...prev,
          ch4: nextCh4,
          co2: nextCo2,
          co: nextCo,
          o2: nextO2,
          temp: nextTemp,
          vibration: nextVib,
          humidity: +(48.0 + Math.sin(Date.now() / 5000) * 1.5).toFixed(1),
        };

        // Append to rolling history
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        setTelemetryHistory((hist) => [
          ...hist.slice(1),
          {
            time: timeStr,
            ch4: nextCh4,
            co2: nextCo2,
            co: nextCo,
            o2: nextO2,
            temp: nextTemp,
            vibration: nextVib,
          },
        ]);

        return updated;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [simMode]);

  // Page-specific contextual alerts database
  const getPageAlerts = useCallback((pageId) => {
    const isCrit = explosionRisk.level === 'critical';
    const isHigh = explosionRisk.level === 'high';

    switch (pageId) {
      case 'sensor_monitoring':
        return [
          {
            id: 'GAS-001',
            severity: isCrit ? 'critical' : isHigh ? 'warning' : 'safe',
            title: isCrit ? 'EXPLOSION HAZARD: Flammable Gas Mixture' : isHigh ? 'Elevated CH₄ / Gas Spike' : 'Atmospheric Gas Baseline Nominal',
            desc: explosionRisk.reason,
            time: 'Live',
            metric: `CH₄: ${sensors.ch4.toFixed(2)}% | O₂: ${sensors.o2.toFixed(1)}% | CO: ${sensors.co.toFixed(1)} ppm | CO₂: ${sensors.co2} ppm`,
          },
          {
            id: 'GAS-002',
            severity: sensors.co >= 25 ? 'warning' : 'safe',
            title: sensors.co >= 25 ? 'Carbon Monoxide Elevated' : 'CO Diffusion Threshold OK',
            desc: sensors.co >= 25 ? 'CO level above safety exposure limits (< 25 ppm).' : 'Carbon monoxide reading stable below OSHA action level.',
            time: '1m ago',
            metric: `${sensors.co.toFixed(1)} ppm`,
          },
          {
            id: 'GAS-003',
            severity: 'info',
            title: 'Multi-Gas NDIR Optical Sensor Calibrated',
            desc: 'Continuous real-time zero-drift compensation active.',
            time: '5m ago',
            metric: 'Calibration Δ: 0.002%',
          }
        ];

      case '3d_mapping':
        return [
          {
            id: 'MAP-001',
            severity: isCrit ? 'warning' : 'info',
            title: 'LiDAR Spatial SLAM Corridor Tracking',
            desc: '3D Tunnel point cloud density 44k pts. Safe navigable path clear.',
            time: 'Live',
            metric: 'Odometry Drift: 0.02m',
          },
          {
            id: 'MAP-002',
            severity: 'warning',
            title: 'Obstacle / Rockfall Debris in Shaft Bravo',
            desc: 'Identified 1.4m fallen rock cluster at X: +14m, Z: -342m.',
            time: '2m ago',
            metric: 'Obstacle Radius: 1.4m',
          },
          {
            id: 'MAP-003',
            severity: 'safe',
            title: 'Bedrock Reinforcement Mesh Confirmed',
            desc: 'Spatial point cloud confirms tunnel roof structural clearance.',
            time: '8m ago',
            metric: 'Clearance: 3.2m',
          }
        ];

      case 'blast_prediction':
        return [
          {
            id: 'BLAST-001',
            severity: 'warning',
            title: 'Controlled Blast Scheduled at 18:00 UTC',
            desc: 'Pre-blast standoff perimeter calculation requires 180m clearance.',
            time: 'T-minus 2h 15m',
            metric: 'Safe PPV Limit: 15.0 mm/s',
          },
          {
            id: 'BLAST-002',
            severity: 'info',
            title: 'Seismic Wave Transmissibility Calibrated',
            desc: 'Granite & Hard Quartzite strata attenuation coefficient updated (k=1140, b=1.6).',
            time: '12m ago',
            metric: 'Strata: Hard Granite',
          }
        ];

      case 'rover_health':
        return [
          {
            id: 'HLTH-001',
            severity: 'safe',
            title: 'LiFePO4 Power System Normal',
            desc: 'Battery cells balanced at 64.2V nominal. 4.8 hours operational runtime.',
            time: 'Live',
            metric: 'Battery: 88% | Draw: 142W',
          },
          {
            id: 'HLTH-002',
            severity: 'safe',
            title: 'Traction Drivetrain & Brushless Motors',
            desc: 'All 4 wheel hubs running at nominal thermal load (38.4°C).',
            time: 'Live',
            metric: 'Motor Temp: 38.4°C',
          },
          {
            id: 'HLTH-003',
            severity: 'info',
            title: 'Subterranean 915MHz Mesh Node Linked',
            desc: 'Strong RF link to surface repeater tower #4.',
            time: 'Live',
            metric: 'RSSI: -42 dBm',
          }
        ];

      case 'overview':
      default:
        return [
          {
            id: 'SYS-001',
            severity: isCrit ? 'critical' : isHigh ? 'warning' : 'safe',
            title: isCrit ? 'URGENT: Explosive Gas Hazard' : 'Rover Subterranean Mission Active',
            desc: explosionRisk.reason,
            time: 'Live',
            metric: `Explosion Risk Index: ${explosionRisk.riskScore}%`,
          },
          {
            id: 'SYS-002',
            severity: 'safe',
            title: 'All Rover Core Subsystems 100% Nominal',
            desc: 'Sensors, Drivetrain, LiDAR, and Mesh Radio operating normally.',
            time: 'Live',
            metric: 'Health: 99.4%',
          }
        ];
    }
  }, [explosionRisk, sensors]);

  return (
    <SensorTelemetryContext.Provider
      value={{
        sensors,
        telemetryHistory,
        explosionRisk,
        simMode,
        setSimMode,
        isAudioMuted,
        setIsAudioMuted,
        playBuzzerTone,
        getPageAlerts,
      }}
    >
      {children}
    </SensorTelemetryContext.Provider>
  );
}

export function useSensorTelemetry() {
  const ctx = useContext(SensorTelemetryContext);
  if (!ctx) {
    throw new Error('useSensorTelemetry must be used within a SensorTelemetryProvider');
  }
  return ctx;
}
