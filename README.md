# CarbonScore Architecture

Interactive architecture diagram for the CarbonScore platform, showcasing all services, data flows, and API endpoints.

## 🎯 Features

- **Interactive Service Nodes** - Hover over services to see connections and descriptions
- **Zoom & Pan Controls** - Desktop: Mouse wheel to zoom, click & drag to pan
- **Mobile Support** - Pinch to zoom, drag to pan, tap for details
- **Beautiful Design** - Dark gradient background with vibrant colored service boxes
- **Complete Documentation** - Includes data flow descriptions and API endpoints

## 🏗️ Architecture Overview

The diagram displays 9 core services:
- **Next.js Frontend** (Port 3000) - User interface and dashboards
- **Calculation Service** (Port 8001) - ADEME carbon calculations
- **ML Service** (Port 8010) - Anomaly detection and benchmarking
- **PDF Service** (Port 8020) - Report generation
- **LLM/RAG Service** (Port 8030) - AI insights and chat
- **PostgreSQL + pgvector** (Port 5432) - Primary database with vector search
- **Redis Cache** (Port 6379) - Caching and sessions
- **File Storage** - PDF reports and ML models
- **External APIs** - Minimax LLM and ADEME data

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:5173` to view the diagram.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 🌐 Deploy to Railway

This app is configured for Railway deployment:

1. Push to GitHub
2. Connect your Railway account to the repository
3. Railway will automatically detect and deploy the app
4. The app will be available at your Railway-provided URL

## 📱 Mobile Features

- **Pinch to Zoom** - Use two fingers to zoom in/out
- **Drag to Pan** - Single finger drag to move around
- **Tap Services** - Tap on service boxes to see details
- **Auto-Optimized** - Starts at 50% zoom on mobile for better overview

## 🎨 Customization

The architecture diagram can be customized by editing `src/CarbonScoreArchitecture.jsx`:
- Add/remove services in the `services` object
- Modify connections in the `apiFlows` array
- Adjust colors, positions, and styling
- Update descriptions and port numbers

## 📄 License

MIT
