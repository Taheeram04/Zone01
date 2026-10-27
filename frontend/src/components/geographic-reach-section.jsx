// src/components/geographic-reach-section.jsx
import React, { useEffect, useRef, useState, useId } from 'react';

/**
 * @typedef {Object} RegionReachItem
 * @property {string} id - Unique identifier
 * @property {string} percentage - Formatted percentage display (e.g. '58%')
 * @property {number} rawPercentage - Numeric percentage value
 * @property {string} name - Region display name
 * @property {string[]} nameLines - Multi-line formatted name
 * @property {number} lat - Latitude degrees
 * @property {number} lon - Longitude degrees
 * @property {string} color - Accent color
 * @property {number} intensity - Visual prominence (1.0 = dominant)
 * @property {{ x: number, y: number, w: number, h: number }} defaultDesktopPos - 1140x740 desktop frame coordinates
 */

/**
 * Configurable data object powering the Geographic Reach section.
 * Markers use standard geographic latitude & longitude conventions.
 */
const GEOGRAPHIC_REACH_DATA = {
  heading: {
    prefix: 'Geographic ',
    highlight: 'reach',
    suffix: ' of employers and clients',
  },
  regions: [
    {
      id: 'kenya',
      percentage: '58%',
      rawPercentage: 58,
      name: 'Kenya',
      nameLines: ['Kenya'],
      lat: -1.0,
      lon: 37.0,
      color: '#0063F9',
      intensity: 1.0, // Dominant cohort location
      defaultDesktopPos: { x: 645, y: 505, w: 152, h: 58 },
    },
    {
      id: 'rest-of-africa',
      percentage: '14%',
      rawPercentage: 14,
      name: 'Rest of Africa',
      nameLines: ['Rest of', 'Africa'],
      lat: 5.0,
      lon: 18.0,
      color: '#85BAFD',
      intensity: 0.8,
      defaultDesktopPos: { x: 230, y: 440, w: 205, h: 83 },
    },
    {
      id: 'europe',
      percentage: '16%',
      rawPercentage: 16,
      name: 'Europe',
      nameLines: ['Europe'],
      lat: 48.0,
      lon: 10.0,
      color: '#70ACFC',
      intensity: 0.75,
      defaultDesktopPos: { x: 740, y: 235, w: 152, h: 58 },
    },
    {
      id: 'middle-east-asia',
      percentage: '3%',
      rawPercentage: 3,
      name: 'Middle east & Asia',
      nameLines: ['Middle east', '& Asia'],
      lat: 25.0,
      lon: 52.0,
      color: '#4A90FA',
      intensity: 0.6,
      defaultDesktopPos: { x: 800, y: 345, w: 205, h: 82 },
    },
    {
      id: 'north-america',
      percentage: '9%',
      rawPercentage: 9,
      name: 'North America',
      nameLines: ['North', 'America'],
      lat: 40.0,
      lon: -98.0,
      color: '#5B9CFB',
      intensity: 0.65,
      defaultDesktopPos: { x: 85, y: 260, w: 205, h: 83 },
    },
  ],
  accessibility: {
    title: 'Geographic reach of employers and clients',
    description:
      'Interactive 3D globe visualizing geographic reach of Zone01 graduates: Kenya represents the dominant 58%, Europe 16%, Rest of Africa 14%, North America 9%, and Middle East and Asia 3%.',
    summary:
      'Summary of graduate employer locations: Kenya 58%, Europe 16%, Rest of Africa 14%, North America 9%, Middle East and Asia 3%.',
  },
};

const MAX_DPR = 2;
const MW = 288;
const MH = 144;

// Initial rotation centered on Kenya (37°E, 1°S)
const KENYA_SPIN = (37.0 * Math.PI) / 180;
const KENYA_TILT = (-1.0 * Math.PI) / 180;

const LAND_B64 =
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPcBAOD/HwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACA" +
    "//+P//f/LwgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4/v/4/////wcAAAAEAPABAAAAfAAAAAAAAAAAAAAAAAAAAADg9w/4" +
    "/////wEAAP4AAAAAAAAA+AAAAAAAAAAAAAAAAAAAAIAG+Of//////wAAAHwGAAAAAAAAAAMAAAAAAAAAAAAAAACABwAc/4P/////" +
    "/wAAADAAAAAAQAAAAD4AAAAAAAAAAAAAAAAAfMbDcQAA/v///wAAAAAAAADABwAA//8HAMAPAAAAAAAAAABgAAAAAAAA/P///wAA" +
    "AAAAAABwAADg//8AAAAAAAAAAAAAAADwG457dwcA8P//HwAAAAAAAAAYAAD///9/eAAAAAAAAAAAAAD4/g0H/w8A8P//PwAAAAAA" +
    "AAAOgOv/////fwD/AAAAAAA/AAAA/B84/v8A8P//LwAAAAD4AAAA4PP//////////wAAAOD///H/+D/3cPgDoP//DwAAAID/BwAA" +
    "x/v/////////P4AA/P///////////////////////w8AAOcBAAgAAAAAAAAAAAAAgP///////////////////////wcAACYAAAQA" +
    "AAAAAAAAAAAAgf///////////////////////wMM8AAAAAAAAAAAAAAAAAAAIID/////////e+wPwH8AgA8AAP/5z///////////" +
    "//////8/ANH///////9/AIALgD8AAAAAwH/+//////////////////9/APj///////8fADwAAD8AAAAA8D/+////////////////" +
    "//sPAPC/+f////8fAPwAADgAAAAA8D/+////////////////D/wBAMCfAP////8PAPwYAAAAAAAA8H/4//////////////9/DgcA" +
    "AAAcAOD///8/APw/AAAAAAAQAB7w//////////////8BgAMAAAACAMD/////Afh/AAAAAAA4gBz+/////////////38A4AMAAMAA" +
    "AMD/////B/z/AAAAAABwwAb+/////////////x8A8AEAAAAAAAD/////P///AwAAAADmgOH//////////////z8A4AAAAAAAAAD+" +
    "////P/7/BwAAAAD28P////////////////8D4AAAAAAAAAD8////f/7/BwAAAADz+f////////////////8HIAAAAAAAAAD6////" +
    "////BAAAAABw/v////////////////8EAAAAAAAAAADo//////8jHgAAAACA//////////////////8MAAAAAAAAAADQ//////8O" +
    "PgAAAADw//////////////////8AAAAAAAAAAADg//////+PIAAAAADA////v////////////38EAAAAAAAAAADg////////AAAA" +
    "AACA//v/zD/8/////////z8AAAAAAAAAAADg//////8bAAAAAACA//N/gD///////////x8GAAAAAAAAAADw//////8AAAAAAAD+" +
    "B8c/AD/+/////////wcPAAAAAAAAAADg//////8AAAAAAAD+gx4/DH74/////////wABAAAAAAAAAADg/////x8AAAAAAAD+gbCn" +
    "///8////////fQABAAAAAAAAAADg/////w8AAAAAAAD/gCDn///4//////9/MgADAAAAAAAAAADA/////w8AAAAAAAD+AADm/3/4" +
    "//////8/cIABAAAAAAAAAADA/////wcAAAAAAAA44AHC///5////////4+ABAAAAAAAAAACA/////wcAAAAAAACI/wEA4P//////" +
    "////4OgAAAAAAAAAAAAA/////wMAAAAAAAD4/wAA4P//////////ADYAAAAAAAAAAAAA/P///wEAAAAAAAD+/wEA8P//////////" +
    "AQcAAAAAAAAAAAAA+P//fwAAAAAAAAD//w8P8P//////////AQEAAAAAAAAAAAAAyP//fwAAAAAAAAD//3//////////////AQAA" +
    "AAAAAAAAAAAA0P+PYQAAAAAAAAD//////z//////////AwAAAAAAAAAAAAAAoP8HwAAAAAAAAMD/////83/+////////AQAAAAAA" +
    "AAAAAAAAIP8DwAAAAAAAAOD/////5//I////////AAAAAAAAAAAAAAAAQP4DgAAAAAAAAPD/////z/+A////////AAAAAAAAAAAA" +
    "AAAAAPwDAAIAAAAAAPD/////z/8ZwP////9/AQAAAAAAAAAAAAAAAPgDQAAAAAAAAPj/////j/9/gP////8fAQAAAAAAAAAAAAAA" +
    "APADEAMAAAAAAPz/////v///AP9//P8DAAAAAAAAAAAAAAAAAPADAwwAAAAAAPj/////P/9/APw//B8AAAAAAAAAAAAIAAAAAPCH" +
    "A8AAAAAAAPj/////P/4/APwP+J8BAAAAAAAAAAAAAAAAAMD/A0YEAAAAAPj/////f/4fAPwH+B8AAwAAAAAAAAAAAAAAAAD/AQAA" +
    "AAAAAPj/////f/wHAPgD8D8AAwAAAAAAAAAAAAAAAADgHwAAAAAAAPj///////wDAPgAwH8AAQAAAAAAAAAAAAAAAADAHwAAAAAA" +
    "APz//////30AAPAAwH8AAAAAAAAAAAAAAAAAAAAAHAAAAAAAAPj//////wsAAPAAgH4AAQAAAAAAAAAAAAAAAAAAGEAAAAAAAPj/" +
    "/////wMBAPAAgHwAAAAAAAAAAAAAAAAAAAAAGPAhAAAAAPD///////cBAOAAgDiABAAAAAAAAAAAAAAAAAAAIPl/AAAAAOD/////" +
    "//8AAGABABBAFAAAAAAAAAAAAAAAAAAAgP7/AQAAAMD///////8AAAABgAAAHAAAAAAAAAAAAAAAAAAAAPz/AQAAAID///////8A" +
    "AAABAAEgCAAAAAAAAAAAAAAAAAAAAPz/HwAAAAD/8P///38AAAAAAANgAAAAAAAAAAAAAAAAAAAAAPz/fwAAAAAAoP///z8AAAAA" +
    "YAd4AAAAAAAAAAAAAAAAAAAAAPz/fwAAAAAAAP///x8AAAAAwAY8AAAAAAAAAAAAAAAAAAAAAP7//wAAAAAAAP///w8AAAAAgAc+" +
    "AAAAAAAAAAAAAAAAAAAAAP///wAAAAAAAP///wcAAAAAgIM/TwAAAAAAAAAAAAAAAAAAAP///wEAAAAAgP///wMAAAAAAIc/QAQA" +
    "AAAAAAAAAAAAAAAAgP///w8AAAAAgP///wEAAAAAAA6fAUQAAAAAAAAAAAAAAAAAAP////8AAAAAAP///wAAAAAAAB6ewuwDAgAA" +
    "AAAAAAAAAAAAgP////8DAAAAAP7//wAAAAAAABwAAvAPAgAAAAAAAAAAAAAAgP////8PAAAAAPz/fwAAAAAAABAAAMCfAQAAAAAA" +
    "AAAAAAAAAP////8PAAAAAPz//wAAAAAAAOADAIA/MAAAAAAAAAAAAAAAAP7///8PAAAAAPz/fwAAAAAAAAAPAMBngAAAAAAAAAAA" +
    "AAAAAP7///8PAAAAAPz//wAAAAAAAAAACABAAAAAAAAAAAAAAAAAAPz///8HAAAAAPj//wAAAAAAAAAAAAAAAAIAAAAAAAAAAAAA" +
    "APz///8DAAAAAPj//wAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAPj///8BAAAAAPz//4AAAAAAAAAAAB8GAAAAAAAAAAAAAAAAAPj/" +
    "//8BAAAAAPz//8EAAAAAAAAAIB8OAAAAAAAAAAAAAAAAAPD///8BAAAAAP7//+AAAAAAAAAA+B8OACAAAAAAAAAAAAAAAMD///8B" +
    "AAAAAP7/f/gAAAAAAAAA/H8eAAAAAAAAAAAAAAAAAID///8AAAAAAP7/H/gAAAAAAAAA/P8fAABAAAAAAAAAAAAAAAD///8AAAAA" +
    "APz/D3AAAAAAAAAA/v8/AAAAAAAAAAAAAAAAAAD///8AAAAAAPj/D3gAAAAAAADA//9/AAgAAAAAAAAAAAAAAAD//38AAAAAAPj/" +
    "DzgAAAAAAADw////AAAAAAAAAAAAAAAAAAD//x8AAAAAAPD/DzgAAAAAAAD4////AQAAAAAAAAAAAAAAAAD//wMAAAAAAPD/DzgA" +
    "AAAAAAD4////AwAAAAAAAAAAAAAAAID//wEAAAAAAPD/AwAAAAAAAAD4////AwAAAAAAAAAAAAAAAID//wEAAAAAAPD/AwAAAAAA" +
    "AAD4////BwAAAAAAAAAAAAAAAID//wEAAAAAAOD/AwAAAAAAAAD4////BwAAAAAAAAAAAAAAAID//wAAAAAAAOD/AQAAAAAAAADw" +
    "////BwAAAAAAAAAAAAAAAID//wAAAAAAAMD/AAAAAAAAAADw////AwAAAAAAAAAAAAAAAID/fwAAAAAAAIB/AAAAAAAAAADgf/z/" +
    "AwAAAAAAAAAAAAAAAID/PwAAAAAAAIA/AAAAAAAAAADgB/D/AQAAAAAAAAAAAAAAAMD/HQAAAAAAAIABAAAAAAAAAADwAND/AQAA" +
    "AAAAAAAAAAAAAMD/AwAAAAAAAAAAAAAAAAAAAAAAAID/AAAIAAAAAAAAAAAAAMD/BwAAAAAAAAAAAAAAAAAAAAAAAAD/AAAQAAAA" +
    "AAAAAAAAAOD/AwAAAAAAAAAAAAAAAAAAAAAAAAA+AABwAAAAAAAAAAAAAOA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAA" +
    "AAAAAOA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAOAPAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAGAAAAAAAAAAAA" +
    "AMAPAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAADAAAAAAAAAAAAAPAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMABAAAAAAAAAAAAAPAD" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAOABAAAAAAAAAAAAAPAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAHAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPADAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAPABAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPCBAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGABAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAA" +
    "AAAAAAAAAAAAAAAcAAAAAAAAAAAAAAA+AABAAJ8//j8PAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAPD/fwD///////8/AAAAAAAA" +
    "AAAAAAAAAIA+AAAAAAAAAAAAPP///8D/////////HwAAAAAAAAAAAAAAAIA9AAAAAAAA8Pz/////P/j//////////wMAAAAAAAAA" +
    "AMAAAPB9AAAAAID/////////P/7///////////8BAAAAAAAAAOABAwB/AAAAAPD///////////////////////8AAAAAAFACPoD/" +
    "//9/AAAAAPD//////////////////////x8AAAAA+P////////8HAAAAAP///////////////////////wcAAAAA/v///////wMA" +
    "AAAA/v///////////////////////wcAAAD8/////////w8AAA7w/////////////////////////w8AAMAB/////////wMAgB84" +
    "/////////////////////////wEAAAAA/P///////3/w4AcA/////////////////////////wAAAADg//////////8/gM//////" +
    "/////////////////////wMAAADg/////////////f///////////////////////////z8A7wMA/v//////////////////////" +
    "//////////////////8/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
    "AAAAAAAAAAAA";

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}

/**
 * Unified longitude/latitude to 3D unit sphere projection.
 * Coordinates:
 *   +X points right (East)
 *   +Y points up (North)
 *   +Z points towards viewer (Prime meridian when unrotated)
 */
function projectSpherical(latDeg, lonDeg) {
  const latRad = (latDeg * Math.PI) / 180;
  const lonRad = (lonDeg * Math.PI) / 180;
  const cl = Math.cos(latRad);
  return {
    x0: cl * Math.sin(lonRad),
    y0: Math.sin(latRad),
    z0: cl * Math.cos(lonRad),
  };
}

/**
 * Rotate a 3D unit vector by camera spin and tilt.
 */
function rotatePoint(x0, y0, z0, cs, sn, ct, st) {
  const x1 = x0 * cs - z0 * sn;
  const z1 = x0 * sn + z0 * cs;
  const y2 = y0 * ct - z1 * st;
  const z2 = y0 * st + z1 * ct;
  return { x1, y2, z2 };
}

/**
 * Categorize lat/lon coordinates into regional bounds
 */
function getRegionCategory(lat, lon) {
  // Kenya: lat [-4.7, 5.0], lon [33.9, 41.9]
  if (lat >= -4.7 && lat <= 5.0 && lon >= 33.9 && lon <= 41.9) {
    return 'kenya';
  }
  // Rest of Africa: lat [-35.0, 37.5], lon [-17.5, 51.5]
  if (lat >= -35.0 && lat <= 37.5 && lon >= -17.5 && lon <= 51.5) {
    return 'rest-of-africa';
  }
  // Europe: lat [35.0, 72.0], lon [-11.0, 42.0]
  if (lat >= 35.0 && lat <= 72.0 && lon >= -11.0 && lon <= 42.0) {
    return 'europe';
  }
  // North America: lat [15.0, 75.0], lon [-168.0, -52.0]
  if (lat >= 15.0 && lat <= 75.0 && lon >= -168.0 && lon <= -52.0) {
    return 'north-america';
  }
  // Middle East & Asia: lat [5.0, 75.0], lon [35.0, 150.0]
  if (lat >= 5.0 && lat <= 75.0 && lon >= 35.0 && lon <= 150.0) {
    return 'middle-east-asia';
  }
  return 'other';
}

/**
 * GeographicReachSection
 * Pixel-accurate recreation of "Geographic reach of employers and clients"
 * Features an interactive 3D canvas globe with inertia, slow auto-spin, tilted orbit ring,
 * real geographic projections, 5 anchor markers, dynamic cards, collision avoidance, and mobile stack.
 */
export default function GeographicReachSection() {
  const { heading, regions, accessibility } = GEOGRAPHIC_REACH_DATA;
  const sectionId = useId();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const cardRefs = useRef({});
  const isIntersectingRef = useRef(true);

  const [activeRegionId, setActiveRegionId] = useState(null);
  const activeRegionIdRef = useRef(null);

  useEffect(() => {
    activeRegionIdRef.current = activeRegionId;
  }, [activeRegionId]);

  const [isDragging, setIsDragging] = useState(false);

  // Target camera rotation for smooth transitions on hover/click
  const targetRotationRef = useRef(null);

  // Pointer & physics state
  const physicsRef = useRef({
    // Initial rotation: reference orientation centred on Kenya (37°E, 1°S)
    spin: KENYA_SPIN,
    tilt: KENYA_TILT,
    vel: 0,
    vtilt: 0,
    dragging: false,
    moved: false,
    dragStartX: 0,
    dragStartY: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    smoothedVelX: 0,
    smoothedVelY: 0,
    lastInteraction: 0,
    pointerType: 'mouse',
  });

  // Handle card click or hover to rotate globe to face that region
  const handleSelectRegion = React.useCallback((region) => {
    setActiveRegionId(region.id);
    const targetSpin = (region.lon * Math.PI) / 180;
    const targetTilt = clamp((region.lat * Math.PI) / 180, -0.35, 0.35);
    targetRotationRef.current = {
      targetSpin,
      targetTilt,
    };
    if (physicsRef.current) {
      physicsRef.current.vel = 0;
      physicsRef.current.vtilt = 0;
      physicsRef.current.lastInteraction = Date.now();
    }
  }, []);

  const handleClearActive = () => {
    setActiveRegionId(null);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // IntersectionObserver to pause rendering when offscreen
    let observer = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            isIntersectingRef.current = entry.isIntersecting;
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    // Decode land bitmap
    let land = null;
    try {
      const bin = atob(LAND_B64);
      land = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) land[i] = bin.charCodeAt(i);
    } catch {
      land = null;
    }

    const isLand = (lon, lat) => {
      if (!land) return false;
      const gx = Math.floor(((lon + 180) / 360) * MW);
      const gy = Math.floor(((90 - lat) / 180) * MH);
      if (gx < 0 || gx >= MW || gy < 0 || gy >= MH) return false;
      const b = gy * MW + gx;
      return ((land[b >> 3] >> (b & 7)) & 1) === 1;
    };

    // Precompute spherical land sampling grid
    const nodes = [];
    const step = 1.9; // Fine step for rich continent definition
    for (let lat = -86; lat <= 86; lat += step) {
      const latRad = (lat * Math.PI) / 180;
      const rl = Math.cos(latRad);
      const n = Math.max(1, Math.round(180 * rl));
      for (let i = 0; i < n; i++) {
        const lon = -180 + (360 * i) / n;
        if (isLand(lon, lat)) {
          nodes.push({
            latRad,
            lonRad: (lon * Math.PI) / 180,
            region: getRegionCategory(lat, lon),
          });
        }
      }
    }

    // Exact 3D ellipse vectors fitted to the orbit ring framing the globe
    const u0 = [202.0, -18.0, 0.0];
    const v0 = [12.0, -56.0, 195.0];

    let rafId = 0;
    let lastTime = performance.now();

    // Render loop
    const render = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      if (!isIntersectingRef.current) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const physics = physicsRef.current;
      const isDesktop = window.innerWidth >= 900;

      // Coordinate dimensions - spacious 1140x740 desktop frame
      const canvasRect = canvas.getBoundingClientRect();
      const cw = isDesktop ? 1140 : Math.round(canvasRect.width) || 360;
      const ch = isDesktop ? 740 : Math.round(canvasRect.height) || cw;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      const bw = Math.max(1, Math.round(cw * dpr));
      const bh = Math.max(1, Math.round(ch * dpr));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);

      // Sphere center & radius: 155px radius on desktop
      const cx = isDesktop ? 570 : cw / 2;
      const cy = isDesktop ? 430 : ch / 2;
      const R = isDesktop ? 155 : Math.min(cw, ch) * 0.40;
      const scaleR = R / 116;

      const curCxE = cx + 21.5 * scaleR;
      const curCyE = cy - 23.5 * scaleR;

      // Handle targeting animation if user clicked/hovered a card
      if (targetRotationRef.current) {
        const { targetSpin, targetTilt } = targetRotationRef.current;
        let dSpin = (targetSpin - physics.spin) % (Math.PI * 2);
        if (dSpin > Math.PI) dSpin -= Math.PI * 2;
        if (dSpin < -Math.PI) dSpin += Math.PI * 2;

        const lerpFactor = Math.min(1, dt * 5.0);
        physics.spin += dSpin * lerpFactor;
        physics.tilt += (targetTilt - physics.tilt) * lerpFactor;

        if (Math.abs(dSpin) < 0.002 && Math.abs(targetTilt - physics.tilt) < 0.002) {
          physics.spin = targetSpin;
          physics.tilt = targetTilt;
          targetRotationRef.current = null;
        }
      } else if (!physics.dragging && !prefersReducedMotion) {
        // Idle motion & realistic inertia
        const timeSinceInteraction = (now - physics.lastInteraction) / 1000;
        if (timeSinceInteraction > 2.0) {
          // Slow ambient eastward prograde rotation
          const idleSpeed = -0.06;
          physics.vel += (idleSpeed - physics.vel) * Math.min(1, dt * 1.5);
        } else {
          // Decelerate inertia with smooth exponential damping
          physics.vel *= Math.exp(-dt * 2.8);
        }

        physics.vtilt *= Math.exp(-dt * 4.0);
        physics.tilt = clamp(physics.tilt + physics.vtilt * dt, -0.45, 0.45);
        if (Math.abs(physics.vtilt) < 0.05 && timeSinceInteraction > 1.2) {
          physics.tilt += (KENYA_TILT - physics.tilt) * Math.min(1, dt * 1.5);
        }

        physics.spin += physics.vel * dt;
      }

      // Camera trig caching
      const cs = Math.cos(physics.spin);
      const sn = Math.sin(physics.spin);
      const ct = Math.cos(physics.tilt);
      const st = Math.sin(physics.tilt);

      // Reference trig for initial Kenya-centered card tracking
      const cs0 = Math.cos(KENYA_SPIN);
      const sn0 = Math.sin(KENYA_SPIN);
      const ct0 = Math.cos(KENYA_TILT);
      const st0 = Math.sin(KENYA_TILT);

      // --- Pass 1: Back half of Orbit Ring ---
      const numOrbitPts = 120;
      const orbit3D = [];
      for (let i = 0; i <= numOrbitPts; i++) {
        const phi = (i / numOrbitPts) * Math.PI * 2;
        const cPhi = Math.cos(phi);
        const sPhi = Math.sin(phi);

        const x0 = (u0[0] * cPhi + v0[0] * sPhi) * scaleR;
        const y0 = (u0[1] * cPhi + v0[1] * sPhi) * scaleR;
        const z0 = (u0[2] * cPhi + v0[2] * sPhi) * scaleR;

        // Apply camera tilt to orbit ring
        const y2 = y0 * ct - z0 * st;
        const z2 = y0 * st + z0 * ct;

        orbit3D.push({
          px: curCxE + x0,
          py: curCyE - y2,
          z2,
        });
      }

      ctx.save();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.40)';

      // Draw back segments (z2 <= 0)
      for (let i = 0; i < numOrbitPts; i++) {
        const p1 = orbit3D[i];
        const p2 = orbit3D[i + 1];
        if (p1.z2 <= 0 || p2.z2 <= 0) {
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        }
      }
      ctx.restore();

      // --- Pass 2: Solid Blue Sphere ---
      const grad = ctx.createRadialGradient(
        cx - R * 0.3,
        cy - R * 0.3,
        R * 0.1,
        cx,
        cy,
        R
      );
      grad.addColorStop(0, '#539CFF');
      grad.addColorStop(0.6, '#2E80FA');
      grad.addColorStop(1, '#1A6DE3');

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Clip continents to sphere interior
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // --- Pass 3: Continents / Landmass Points ---
      // Correct projection: x0 = cl * sin(lonRad), y0 = sin(latRad), z0 = cl * cos(lonRad)
      // Positive X is East (viewer right), Positive Y is North (viewer up)
      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i];
        const cl = Math.cos(nd.latRad);
        const x0 = cl * Math.sin(nd.lonRad);
        const y0 = Math.sin(nd.latRad);
        const z0 = cl * Math.cos(nd.lonRad);

        const x1 = x0 * cs - z0 * sn;
        const z1 = x0 * sn + z0 * cs;
        const y2 = y0 * ct - z1 * st;
        const z2 = y0 * st + z1 * ct;

        if (z2 <= 0.01) continue; // back side

        const px = cx + x1 * R;
        const py = cy - y2 * R;

        let dotColor = 'rgba(255, 255, 255, 0.25)';
        let dotSize = 2.2;

        // Distinct highlighting per region - Kenya brightest/strongest
        if (nd.region === 'kenya') {
          dotColor = '#FFFFFF';
          dotSize = 3.6;
        } else if (nd.region === 'rest-of-africa') {
          dotColor = 'rgba(235, 245, 255, 0.90)';
          dotSize = 3.0;
        } else if (nd.region === 'europe') {
          dotColor = 'rgba(220, 240, 255, 0.82)';
          dotSize = 2.8;
        } else if (nd.region === 'north-america') {
          dotColor = 'rgba(205, 230, 255, 0.78)';
          dotSize = 2.8;
        } else if (nd.region === 'middle-east-asia') {
          dotColor = 'rgba(195, 225, 255, 0.72)';
          dotSize = 2.6;
        }

        ctx.fillStyle = dotColor;
        ctx.beginPath();
        ctx.arc(px, py, dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore(); // unclip sphere

      // --- Pass 4: Front half of Orbit Ring ---
      ctx.save();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.40)';
      for (let i = 0; i < numOrbitPts; i++) {
        const p1 = orbit3D[i];
        const p2 = orbit3D[i + 1];
        if (p1.z2 > 0 || p2.z2 > 0) {
          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.stroke();
        }
      }
      ctx.restore();

      // --- Pass 5: Five Region Anchor Markers on the Globe ---
      // Land and markers share the identical spherical projection
      const nextCardStates = [];
      for (let i = 0; i < regions.length; i++) {
        const r = regions[i];
        const p0 = projectSpherical(r.lat, r.lon);

        // Current rotation
        const p = rotatePoint(p0.x0, p0.y0, p0.z0, cs, sn, ct, st);
        const dotX = cx + p.x1 * R;
        const dotY = cy - p.y2 * R;
        const z2 = p.z2;

        const isActive = activeRegionIdRef.current === r.id;
        const baseR = (r.id === 'kenya' ? 13 : 11) * scaleR;
        const dotR = baseR * (0.85 + 0.15 * ((z2 + 1) / 2));

        // Draw marker dot when on visible hemisphere
        if (z2 > -0.05) {
          ctx.save();
          const dotAlpha = z2 > 0.08 ? 1.0 : clamp((z2 - -0.05) / 0.13, 0.2, 1.0);
          ctx.globalAlpha = dotAlpha;

          // Pulse highlight ring if active/hovered
          if (isActive) {
            ctx.beginPath();
            ctx.arc(dotX, dotY, dotR * 1.55, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 99, 249, 0.25)';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = 'rgba(0, 99, 249, 0.5)';
            ctx.stroke();
          }

          // Solid marker dot
          ctx.beginPath();
          ctx.arc(dotX, dotY, isActive ? dotR * 1.25 : dotR, 0, Math.PI * 2);
          ctx.fillStyle = '#0063F9';
          ctx.fill();

          // Crisp white border
          ctx.lineWidth = isActive ? 2.5 : 1.5;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();

          ctx.restore();
        }

        // Card tracking relative to resting dot position at initial Kenya view
        const def = r.defaultDesktopPos;
        const initP = rotatePoint(p0.x0, p0.y0, p0.z0, cs0, sn0, ct0, st0);
        const initDotX = cx + initP.x1 * R;
        const initDotY = cy - initP.y2 * R;

        const deltaX = (dotX - initDotX) * 0.45;
        const deltaY = (dotY - initDotY) * 0.45;

        // Card opacity: fully visible when facing viewer, gently faded if on back side
        const opacity = z2 >= 0 ? 1 : clamp(0.85 + z2 * 0.1, 0.85, 0.95);

        nextCardStates.push({
          id: r.id,
          x: def.x + deltaX,
          y: def.y + deltaY,
          w: def.w,
          h: def.h,
          opacity,
          visible: opacity > 0.02,
          dotX,
          dotY,
        });
      }

      // Desktop layout: collision avoidance & direct DOM positioning
      if (isDesktop) {
        const bounds = {
          minX: 20,
          maxX: 1120,
          minY: 150,
          maxY: 710,
        };
        const margin = 12;
        for (let iter = 0; iter < 3; iter++) {
          for (let i = 0; i < nextCardStates.length; i++) {
            for (let j = i + 1; j < nextCardStates.length; j++) {
              const c1 = nextCardStates[i];
              const c2 = nextCardStates[j];
              if (c1.opacity < 0.1 || c2.opacity < 0.1) continue;

              const overlapX =
                c1.w / 2 + c2.w / 2 + margin - Math.abs(c1.x + c1.w / 2 - (c2.x + c2.w / 2));
              if (overlapX > 0) {
                const overlapY =
                  c1.h / 2 + c2.h / 2 + margin - Math.abs(c1.y + c1.h / 2 - (c2.y + c2.h / 2));
                if (overlapY > 0) {
                  const nudge = overlapY / 2;
                  if (c1.y < c2.y) {
                    c1.y -= nudge;
                    c2.y += nudge;
                  } else {
                    c1.y += nudge;
                    c2.y += nudge;
                  }
                }
              }
            }
          }
          for (const c of nextCardStates) {
            c.x = clamp(c.x, bounds.minX, bounds.maxX - c.w);
            c.y = clamp(c.y, bounds.minY, bounds.maxY - c.h);
          }
        }

        // Direct DOM update of card positions for 60/120fps performance
        for (let i = 0; i < nextCardStates.length; i++) {
          const c = nextCardStates[i];
          const el = cardRefs.current[c.id];
          if (el) {
            el.style.left = `${c.x}px`;
            el.style.top = `${c.y}px`;
            el.style.opacity = `${c.opacity}`;
            el.style.pointerEvents = c.opacity > 0.05 ? 'auto' : 'none';
          }
        }
      }

      rafId = requestAnimationFrame(render);
    };

    // Pointer Event Listeners for smooth drag and touch scroll handling
    const getPoint = (e) => {
      const r = canvas.getBoundingClientRect();
      const isDesktop = window.innerWidth >= 900;
      const cw = isDesktop ? 1140 : r.width || 360;
      const ch = isDesktop ? 740 : Math.round(r.height) || cw;
      return {
        x: ((e.clientX - r.left) / r.width) * cw,
        y: ((e.clientY - r.top) / r.height) * ch,
      };
    };

    const onPointerDown = (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const p = getPoint(e);
      const physics = physicsRef.current;
      physics.dragging = true;
      physics.moved = false;
      physics.dragStartX = p.x;
      physics.dragStartY = p.y;
      physics.lastX = p.x;
      physics.lastY = p.y;
      physics.lastTime = performance.now();
      physics.smoothedVelX = 0;
      physics.smoothedVelY = 0;
      physics.pointerType = e.pointerType;
      physics.lastInteraction = performance.now();
      targetRotationRef.current = null;
      setIsDragging(true);

      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    };

    const onPointerMove = (e) => {
      const physics = physicsRef.current;
      if (!physics.dragging) return;
      const p = getPoint(e);
      const dx = p.x - physics.lastX;
      const dy = p.y - physics.lastY;

      if (Math.hypot(p.x - physics.dragStartX, p.y - physics.dragStartY) > 3) {
        physics.moved = true;
      }

      const now = performance.now();
      const dt = Math.max(1, now - physics.lastTime);
      const instVx = dx / dt;
      const instVy = dy / dt;
      physics.smoothedVelX = physics.smoothedVelX * 0.35 + instVx * 0.65;
      physics.smoothedVelY = physics.smoothedVelY * 0.35 + instVy * 0.65;

      // Direct intuitive 1:1 tracking:
      // Dragging right pulls front surface to the right; dragging down tilts down
      const isDesktop = window.innerWidth >= 900;
      const R = isDesktop ? 155 : Math.min(canvas.clientWidth || 360, canvas.clientHeight || 360) * 0.40;
      const sensitivity = 1.05 / R;

      physics.spin -= dx * sensitivity;
      physics.tilt = clamp(physics.tilt + dy * sensitivity, -0.45, 0.45);

      physics.lastX = p.x;
      physics.lastY = p.y;
      physics.lastTime = now;
      physics.lastInteraction = now;
    };

    const onPointerUp = (e) => {
      const physics = physicsRef.current;
      if (!physics.dragging) return;
      physics.dragging = false;
      setIsDragging(false);

      const now = performance.now();
      const timeSinceMove = now - physics.lastTime;
      const isDesktop = window.innerWidth >= 900;
      const R = isDesktop ? 155 : Math.min(canvas.clientWidth || 360, canvas.clientHeight || 360) * 0.40;
      const sensitivity = 1.05 / R;

      if (timeSinceMove < 80 && physics.moved) {
        // Natural flick inertia
        physics.vel = clamp(-physics.smoothedVelX * 1000 * sensitivity, -7, 7);
        physics.vtilt = clamp(physics.smoothedVelY * 1000 * sensitivity, -3.5, 3.5);
      } else {
        physics.vel = 0;
        physics.vtilt = 0;
      }

      physics.lastInteraction = now;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    };
  }, [regions]);

  return (
    <section
      id="geographic-reach"
      data-nav-theme="light"
      aria-labelledby={`reach-heading-${sectionId}`}
      className="relative w-full bg-[#BFD8FD] overflow-hidden pb-4 sm:pb-8 lg:pb-10"
    >
      <style>{`
        /* Scoped styles ensuring spacious layout on desktop (>=900px) and responsive mobile stack (<900px) */
        @media (min-width: 900px) {
          .reach-wrapper {
            width: 1140px !important;
            max-width: 100% !important;
            height: 740px !important;
            position: relative !important;
            margin: 0 auto !important;
            padding: 0 !important;
          }
          .reach-title-pos {
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            top: 32px !important;
            font-size: clamp(34px, 3.2vw, 42px) !important;
            line-height: 1.15 !important;
            text-align: center !important;
            margin-bottom: 0 !important;
            white-space: nowrap !important;
          }
          .reach-canvas-pos {
            position: absolute !important;
            inset: 0 !important;
            width: 1140px !important;
            height: 740px !important;
            display: block !important;
          }
          .reach-desktop-cards {
            display: block !important;
            position: absolute !important;
            inset: 0 !important;
            pointer-events: none !important;
          }
          .reach-mobile-cards {
            display: none !important;
          }
          .reach-summary {
            position: absolute !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 16px !important;
            display: flex !important;
            align-items: center;
            justify-content: center;
            gap: 16px;
            font-family: var(--font-mono);
            font-size: 10.5px;
            letter-spacing: 0.07em;
            text-transform: uppercase;
            color: #0A3A9C;
          }
          .reach-summary strong {
            font-size: 15px;
            font-weight: 700;
            color: #0063F9;
            margin-right: 4px;
          }
          .reach-summary-sep {
            width: 1px;
            height: 12px;
            background: rgba(10, 58, 156, 0.3);
          }
        }

        @media (max-width: 899px) {
          .reach-wrapper {
            width: 100%;
            padding: 24px 20px 72px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .reach-title-pos {
            font-size: clamp(26px, 6.8vw, 36px);
            line-height: 1.15;
            text-align: center;
            margin-bottom: 36px;
          }
          .reach-canvas-pos {
            width: min(370px, 88vw);
            height: min(370px, 88vw);
            aspect-ratio: 1 / 1;
            display: block;
            margin: 0 auto;
            border-radius: 50%;
          }
          .reach-desktop-cards {
            display: none !important;
          }
          .reach-mobile-cards {
            display: flex !important;
            flex-direction: column;
            gap: 12px;
            width: 100%;
            max-width: 400px;
            margin-top: 36px;
          }
          .reach-summary {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Container */}
      <div ref={containerRef} className="reach-wrapper">
        {/* Heavy Black Display Heading */}
        <h2
          id={`reach-heading-${sectionId}`}
          className="reach-title-pos font-sans font-black text-black-900 tracking-[-0.015em]"
        >
          {heading.prefix}
          <span className="text-[#0063F9] font-black">{heading.highlight}</span>
          {heading.suffix}
        </h2>

        {/* 3D Interactive Globe Canvas */}
        <canvas
          ref={canvasRef}
          aria-label={accessibility.description}
          role="img"
          className="reach-canvas-pos select-none"
          style={{
            touchAction: 'none',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        />

        {/* Desktop Overlay: Dynamic white rounded cards with monospace labels and tracking */}
        <div className="reach-desktop-cards">
          {regions.map((region) => {
            const isHovered = activeRegionId === region.id;
            const def = region.defaultDesktopPos;

            return (
              <button
                key={region.id}
                ref={(el) => {
                  cardRefs.current[region.id] = el;
                }}
                type="button"
                onClick={() => handleSelectRegion(region)}
                onMouseEnter={() => handleSelectRegion(region)}
                onMouseLeave={handleClearActive}
                onFocus={() => handleSelectRegion(region)}
                onBlur={handleClearActive}
                className="absolute bg-white rounded-xl flex items-center select-none cursor-pointer transition-all duration-200"
                style={{
                  left: `${def.x}px`,
                  top: `${def.y}px`,
                  width: `${def.w}px`,
                  height: `${def.h}px`,
                  opacity: 1,
                  pointerEvents: 'auto',
                  boxShadow: isHovered
                    ? '0 10px 25px -4px rgba(0, 99, 249, 0.28), 0 4px 10px -2px rgba(0, 0, 0, 0.08)'
                    : '0 2px 8px -2px rgba(0, 0, 0, 0.08), 0 1px 3px 0 rgba(0, 0, 0, 0.04)',
                  outline: isHovered ? '2px solid #0063F9' : '1px solid rgba(0, 0, 0, 0.06)',
                  transform: isHovered ? 'translateY(-2px) scale(1.02)' : 'none',
                  padding: def.h > 65 ? '16px 22px' : '12px 22px',
                }}
              >
                <span className="font-mono font-bold text-black-900 text-[19px] mr-3.5 leading-none shrink-0">
                  {region.percentage}
                </span>
                <span className="font-mono font-medium text-black-900 text-[15.5px] leading-[1.2] text-left">
                  {region.nameLines.map((line, lIdx) => (
                    <React.Fragment key={lIdx}>
                      {line}
                      {lIdx < region.nameLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile View: Stacked list below the globe with active region highlighted */}
        <div className="reach-mobile-cards">
          {regions.map((region) => {
            const isActive = activeRegionId === region.id;

            return (
              <button
                key={region.id}
                type="button"
                onClick={() => handleSelectRegion(region)}
                className={`w-full bg-white rounded-xl p-4 flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'ring-2 ring-[#0063F9] shadow-md bg-blue-50/20'
                    : 'shadow-sm hover:shadow'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      region.id === 'kenya' ? 'bg-[#0063F9]' : 'bg-[#5B9CFB]'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="font-mono font-medium text-black-900 text-[15px]">
                    {region.name}
                  </span>
                </div>
                <span className="font-mono font-bold text-black-900 text-[18px]">
                  {region.percentage}
                </span>
              </button>
            );
          })}
        </div>

        {/* Screen Reader Accessible List */}
        <ul className="sr-only">
          {regions.map((r) => (
            <li key={r.id}>
              {r.name}: {r.percentage}
            </li>
          ))}
        </ul>

        {/* Bottom takeaway */}
        <div className="reach-summary">
          <span><strong>58%</strong> Kenya</span>
          <span className="reach-summary-sep" aria-hidden="true" />
          <span><strong>42%</strong> international employers &amp; clients</span>
          <span className="reach-summary-sep" aria-hidden="true" />
          <span><strong>5</strong> regions</span>
        </div>
      </div>
    </section>
  );
}
