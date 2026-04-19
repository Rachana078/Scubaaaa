src/
  components/
    TopBar.tsx        # Logo, clock, WS status, auth
    VideoPanel.tsx    # HLS feed + crosshair overlay
    CompassCard.tsx   # Animated heading compass
    DPad.tsx          # Directional control pad
    TelemetryGrid.tsx # Speed, heading, battery, signal cards
    ThrottleBar.tsx   # Throttle percentage bar
    EventLog.tsx      # Live command + event log
    Login.tsx         # Auth screen
  hooks/
    useSocket.ts      # WebSocket connection (mock → real)
    useTelemetry.ts   # Telemetry state management
    useKeyboard.ts    # WASD key bindings
    useGamepad.ts     # Gamepad support
  utils/
    auth.ts           # Session management
  tokens.css          # CSS design tokens from Figma
  index.css           # Global styles + ocean animations
public/
  manifest.json       # PWA manifest