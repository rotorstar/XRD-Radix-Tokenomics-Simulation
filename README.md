# Radix Tokenomics Simulation 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Project Overview

An interactive Next.js application for simulating and visualizing Radix DLT network tokenomics, focusing on dynamic emission adjustments and Anthic DeFi protocol integration.

> **⚠️ Disclaimer:** This is a simplified simulation for educational purposes only. Not financial advice. Real-world market conditions are far more complex.

## ✨ Key Features

### 🎛️ Interactive Parameters
- XRD Price & TVL Settings
- Emission Settings (Base, Market %, Dynamic/Static)
- Anthic Volume & Fee Settings
- Advanced Simulation Parameters

### 📊 Data Visualization
- Interactive Price & TVL Trend Charts
- Monthly Emission Distribution
- Detailed Data Tables
- Formula Explanations

### 🔄 Simulation Modes
- Dynamic Emission (TVL & Activity-based)
- Static Emission (Fixed Rate)
- Anthic Buyback Simulation

## 🛠️ Technology Stack

- **Next.js** - React Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **recharts** - Charts
- **shadcn/ui** - UI Components

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
git clone [repository URL]
cd [repository directory]
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` 🌐

## 📖 Documentation

### 📑 Tabs
- **All Views** - Complete Overview
- **Parameters** - Input Settings
- **Results** - Simulation Outcomes
- **Data Table** - Detailed Data
- **Formulas** - Calculation Details

### 🧮 Core Formulas

#### Dynamic Emission
```typescript
dailyEmission = baseEmission * (
  0.7 * (1 / TVL_Progress^0.7) +  // TVL Factor
  0.3 * (1 / Activity_Progress^0.5)  // Activity Factor
) / 365
```

#### Price Development
```typescript
netSupply = dailyEmission - dailyBuyback - dailyLocked
marketDepth = currentTVL * marketDepthFactor
priceChange = calculatePriceChange(netSupply, marketDepth)
```

#### TVL Development
```typescript
targetTVL = initialTVL * (currentPrice / initialPrice)
tvlChange = (targetTVL - currentTVL) * (1 - tvlInertia)
```

## 🤝 Contributing

Contributions welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

## 📄 License

MIT License - See [LICENSE.md](LICENSE.md)

---

Built with 💚 for the Radix Community 