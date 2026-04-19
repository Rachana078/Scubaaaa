# 🌊 Scubaaaa

> Browser-based mission control dashboard for a physical autonomous surface vessel — built at FullyHacks 2026.

---

## What is it?

Scubaaaa is a real-time web dashboard that lets you pilot a physical surface vessel from any browser. Live camera feed, telemetry readouts, and directional controls — all over WebSocket, installable as a PWA on any phone or tablet.

Built in ~24 hours at FullyHacks 2026 @ CSUF with an ocean theme because of course.

---

## Features

- 🎥 **Live camera feed** via HLS stream (hls.js)
- 📡 **Real-time telemetry** — speed, heading, battery, signal strength
- 🕹️ **Directional controls** — WASD keyboard + D-pad (touch-friendly)
- 🧭 **Animated compass** with live heading
- 🌊 **Ocean theme** — bioluminescent UI, floating bubbles, seaweed, fish
- 📱 **PWA** — installs on mobile, works landscape on any device
- 🔌 **WebSocket** connection to FastAPI backend on the vessel
- 🔐 **Auth** — login screen, session management

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS + CSS variables |
| WebSocket | socket.io-client |
| Camera | hls.js |
| PWA | vite-plugin-pwa |
| Backend | FastAPI + socket.io (separate repo) |
| Hardware | Physical surface vessel + Raspberry Pi |

---

## Getting Started

### Prerequisites
- Node.js 18+
- The vessel backend running on the same network

### Install

```bash
git clone https://github.com/Rachana078/Scubaaaa.git
cd Scubaaaa
npm install
```

### Run (with camera stream)

```bash
VITE_STREAM_URL=http://<vessel-ip>:8000/stream npm run dev
```

### Run (mock mode, no hardware)

```bash
npm run dev
```

The dashboard will run on http://localhost:5173 with simulated telemetry.

### Build for production

```bash
npm run build
```

---

## WebSocket Contract

**Outgoing** (browser → vessel):
```json
{ "cmd": "F" }
```

| cmd | action |
|---|---|
| F | Forward |
| B | Reverse |
| L | Port (left) |
| R | Starboard (right) |
| S | Stop |

**Incoming** (vessel → browser):
```json
{ "direction": "forward", "speed": 75 }
```

---

## Design System

Design tokens extracted from Figma and applied as CSS variables:

| Token | Value |
|---|---|
| --color-accent-green | #00FF90 |
| --color-accent-cyan | #00CFFF |
| --color-bg-primary | #080D12 |
| --color-bg-surface | #0D1520 |
| --color-text-primary | #C8F0E0 |
| --color-warning | #FFB800 |
| --color-danger | #FF4444 |

---

## Team

| Name | Role |
|---|---|
| Rachana Panduranga Naidu | Frontend, UI/UX, Design System |
| Anjelo Go | Hardware, Backend, FastAPI, Camera Pipeline |
| Tina Le | Frontend, WebSocket, Stream Integration |
