import React, { useState, useRef, useEffect } from 'react';
import { Database, Cpu, FileText, Brain, BarChart3, Globe, Server, HardDrive, Zap } from 'lucide-react';

const CarbonScoreArchitecture = () => {
    const [hoveredService, setHoveredService] = useState(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            // Start zoomed out on mobile
            if (window.innerWidth < 768) {
                setScale(0.5);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const services = {
        frontend: {
            name: 'Next.js Frontend',
            port: ':3000',
            icon: Globe,
            color: 'bg-blue-500',
            connections: ['calc', 'ml', 'pdf', 'llm'],
            description: 'User interface, forms, dashboards, and visualizations'
        },
        calc: {
            name: 'Calculation Service',
            port: ':8001',
            icon: BarChart3,
            color: 'bg-green-500',
            connections: ['db', 'redis'],
            description: 'ADEME carbon calculations, scope analysis, and benchmarking'
        },
        ml: {
            name: 'ML Service',
            port: ':8010',
            icon: Cpu,
            color: 'bg-purple-500',
            connections: ['db', 'storage'],
            description: 'Anomaly detection, imputation, and action ranking'
        },
        pdf: {
            name: 'PDF Service',
            port: ':8020',
            icon: FileText,
            color: 'bg-orange-500',
            connections: ['llm', 'storage'],
            description: 'Report generation with charts and narratives'
        },
        llm: {
            name: 'LLM/RAG Service',
            port: ':8030',
            icon: Brain,
            color: 'bg-pink-500',
            connections: ['db', 'external'],
            description: 'AI insights, chat assistant, and content generation'
        },
        db: {
            name: 'PostgreSQL + pgvector',
            port: ':5432',
            icon: Database,
            color: 'bg-indigo-500',
            connections: [],
            description: 'Primary database with vector search for RAG'
        },
        redis: {
            name: 'Redis Cache',
            port: ':6379',
            icon: Zap,
            color: 'bg-red-500',
            connections: [],
            description: 'Caching, sessions, and job queues'
        },
        storage: {
            name: 'File Storage',
            port: '',
            icon: HardDrive,
            color: 'bg-gray-500',
            connections: [],
            description: 'PDF reports, charts, and ML models'
        },
        external: {
            name: 'External APIs',
            port: '',
            icon: Server,
            color: 'bg-teal-500',
            connections: [],
            description: 'Minimax LLM (OpenRouter), ADEME data'
        }
    };

    const apiFlows = [
        { from: 'frontend', to: 'calc', label: 'POST /api/calculate', type: 'primary' },
        { from: 'frontend', to: 'ml', label: 'POST /api/ml/benchmark', type: 'secondary' },
        { from: 'frontend', to: 'pdf', label: 'POST /api/pdf/generate', type: 'primary' },
        { from: 'frontend', to: 'llm', label: 'POST /api/llm/chat', type: 'secondary' },
        { from: 'calc', to: 'db', label: 'Store calculations', type: 'data' },
        { from: 'calc', to: 'redis', label: 'Cache results', type: 'data' },
        { from: 'ml', to: 'db', label: 'Query benchmarks', type: 'data' },
        { from: 'ml', to: 'storage', label: 'Load/save models', type: 'data' },
        { from: 'pdf', to: 'llm', label: 'Generate narrative', type: 'service' },
        { from: 'pdf', to: 'storage', label: 'Save PDF reports', type: 'data' },
        { from: 'llm', to: 'db', label: 'Vector search (RAG)', type: 'data' },
        { from: 'llm', to: 'external', label: 'LLM API calls', type: 'external' }
    ];

    // Zoom handlers
    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY * -0.001;
        const newScale = Math.min(Math.max(0.3, scale + delta), 3);
        setScale(newScale);
    };

    // Touch zoom handlers
    const [lastTouchDistance, setLastTouchDistance] = useState(null);

    const getTouchDistance = (touches) => {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (e) => {
        if (e.touches.length === 2) {
            setLastTouchDistance(getTouchDistance(e.touches));
        } else if (e.touches.length === 1) {
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y
            });
        }
    };

    const handleTouchMove = (e) => {
        if (e.touches.length === 2 && lastTouchDistance) {
            e.preventDefault();
            const newDistance = getTouchDistance(e.touches);
            const delta = (newDistance - lastTouchDistance) * 0.01;
            const newScale = Math.min(Math.max(0.3, scale + delta), 3);
            setScale(newScale);
            setLastTouchDistance(newDistance);
        } else if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            setPosition({
                x: e.touches[0].clientX - dragStart.x,
                y: e.touches[0].clientY - dragStart.y
            });
        }
    };

    const handleTouchEnd = () => {
        setLastTouchDistance(null);
        setIsDragging(false);
    };

    // Mouse drag handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Reset zoom and position
    const handleReset = () => {
        setScale(isMobile ? 0.5 : 1);
        setPosition({ x: 0, y: 0 });
    };

    const ServiceNode = ({ id, service, position: nodePosition }) => {
        const Icon = service.icon;
        const isHovered = hoveredService === id;
        const isConnected = hoveredService && (
            service.connections.includes(hoveredService) ||
            services[hoveredService]?.connections.includes(id)
        );

        return (
            <div
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isHovered ? 'scale-110 z-20' : isConnected ? 'scale-105 z-10' : 'z-0'
                    }`}
                style={{ left: nodePosition.x, top: nodePosition.y }}
                onMouseEnter={() => setHoveredService(id)}
                onMouseLeave={() => setHoveredService(null)}
                onTouchStart={() => setHoveredService(id)}
            >
                <div className={`${service.color} rounded-lg p-3 md:p-4 shadow-lg border-2 border-white ${isHovered ? 'shadow-2xl' : ''
                    } min-w-[140px] md:min-w-[160px]`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        <div className="text-white font-bold text-xs md:text-sm">{service.name}</div>
                    </div>
                    <div className="text-white text-xs opacity-90">{service.port}</div>
                    {isHovered && (
                        <div className="mt-2 text-white text-xs bg-black bg-opacity-30 p-2 rounded">
                            {service.description}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const ConnectionLine = ({ flow }) => {
        const fromPos = positions[flow.from];
        const toPos = positions[flow.to];

        if (!fromPos || !toPos) return null;

        const isHighlighted = hoveredService === flow.from || hoveredService === flow.to;

        const colors = {
            primary: '#3b82f6',
            secondary: '#8b5cf6',
            data: '#10b981',
            service: '#f59e0b',
            external: '#06b6d4'
        };

        return (
            <g className={`transition-opacity duration-300 ${isHighlighted ? 'opacity-100' : 'opacity-30'}`}>
                <defs>
                    <marker
                        id={`arrow-${flow.type}`}
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path d="M0,0 L0,6 L9,3 z" fill={colors[flow.type]} />
                    </marker>
                </defs>
                <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={colors[flow.type]}
                    strokeWidth={isHighlighted ? "3" : "2"}
                    strokeDasharray={flow.type === 'data' ? '5,5' : '0'}
                    markerEnd={`url(#arrow-${flow.type})`}
                />
                {isHighlighted && (
                    <text
                        x={(fromPos.x + toPos.x) / 2}
                        y={(fromPos.y + toPos.y) / 2}
                        fill={colors[flow.type]}
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="bg-white"
                    >
                        {flow.label}
                    </text>
                )}
            </g>
        );
    };

    const positions = {
        frontend: { x: '50%', y: '10%' },
        calc: { x: '20%', y: '35%' },
        ml: { x: '50%', y: '35%' },
        pdf: { x: '80%', y: '35%' },
        llm: { x: '35%', y: '60%' },
        db: { x: '20%', y: '85%' },
        redis: { x: '40%', y: '85%' },
        storage: { x: '60%', y: '85%' },
        external: { x: '80%', y: '60%' }
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8 overflow-auto">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-4 md:mb-8">
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">CarbonScore Platform Architecture</h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        {isMobile ? 'Pinch to zoom, drag to pan, tap services for details' : 'Hover over services to see connections and details'}
                    </p>
                </div>

                {/* Zoom Controls */}
                <div className="flex justify-center gap-2 mb-4">
                    <button
                        onClick={() => setScale(Math.min(scale + 0.2, 3))}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm md:text-base"
                    >
                        Zoom In +
                    </button>
                    <button
                        onClick={() => setScale(Math.max(scale - 0.2, 0.3))}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm md:text-base"
                    >
                        Zoom Out -
                    </button>
                    <button
                        onClick={handleReset}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold text-sm md:text-base"
                    >
                        Reset
                    </button>
                </div>

                <div className="text-center mb-4">
                    <span className="text-gray-400 text-sm">Zoom: {Math.round(scale * 100)}%</span>
                </div>

                <div
                    ref={containerRef}
                    className="relative bg-gray-800 rounded-xl shadow-2xl overflow-hidden touch-none"
                    style={{ height: isMobile ? '500px' : '700px' }}
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div
                        style={{
                            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                            transformOrigin: 'center center',
                            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                            width: '100%',
                            height: '100%',
                            cursor: isDragging ? 'grabbing' : 'grab'
                        }}
                    >
                        <div className="relative w-full h-full p-8">
                            {/* SVG for connection lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                                {apiFlows.map((flow, idx) => (
                                    <ConnectionLine key={idx} flow={flow} />
                                ))}
                            </svg>

                            {/* Service nodes */}
                            {Object.entries(services).map(([id, service]) => (
                                <ServiceNode
                                    key={id}
                                    id={id}
                                    service={service}
                                    position={positions[id]}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 md:mt-8 grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4">
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 md:w-8 h-1 bg-blue-500"></div>
                            <span className="text-white text-xs md:text-sm font-semibold">Primary API</span>
                        </div>
                        <p className="text-gray-400 text-xs">Main user flows</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 md:w-8 h-1 bg-purple-500"></div>
                            <span className="text-white text-xs md:text-sm font-semibold">Secondary API</span>
                        </div>
                        <p className="text-gray-400 text-xs">Enhancement flows</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 md:w-8 h-1 bg-green-500 border-dashed border-2 border-green-500"></div>
                            <span className="text-white text-xs md:text-sm font-semibold">Data Flow</span>
                        </div>
                        <p className="text-gray-400 text-xs">Database operations</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 md:w-8 h-1 bg-orange-500"></div>
                            <span className="text-white text-xs md:text-sm font-semibold">Service-to-Service</span>
                        </div>
                        <p className="text-gray-400 text-xs">Internal service calls</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 md:w-8 h-1 bg-teal-500"></div>
                            <span className="text-white text-xs md:text-sm font-semibold">External API</span>
                        </div>
                        <p className="text-gray-400 text-xs">Third-party services</p>
                    </div>
                </div>

                {/* Data Flow Description */}
                <div className="mt-4 md:mt-8 bg-gray-800 rounded-xl p-4 md:p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Complete Data Flow</h2>
                    <div className="grid md:grid-cols-2 gap-4 md:gap-6 text-gray-300 text-xs md:text-sm">
                        <div>
                            <h3 className="text-base md:text-lg font-semibold text-white mb-2">1. User Submission</h3>
                            <p>User fills questionnaire → Frontend validates → POST to Calculation Service</p>

                            <h3 className="text-base md:text-lg font-semibold text-white mb-2 mt-4">2. Carbon Calculation</h3>
                            <p>Calculation Service processes ADEME factors → Stores in PostgreSQL → Caches in Redis</p>

                            <h3 className="text-base md:text-lg font-semibold text-white mb-2 mt-4">3. ML Enhancement</h3>
                            <p>Frontend calls ML Service → Anomaly detection → Benchmarking → Action ranking</p>
                        </div>
                        <div>
                            <h3 className="text-base md:text-lg font-semibold text-white mb-2">4. Dashboard Display</h3>
                            <p>Frontend fetches data from cache/DB → Renders charts and metrics</p>

                            <h3 className="text-base md:text-lg font-semibold text-white mb-2 mt-4">5. PDF Generation</h3>
                            <p>PDF Service calls LLM Service for narrative → Generates charts → Assembles PDF → Saves to storage</p>

                            <h3 className="text-base md:text-lg font-semibold text-white mb-2 mt-4">6. AI Insights</h3>
                            <p>LLM Service performs vector search on pgvector → Retrieves context → Calls Minimax API → Returns grounded response</p>
                        </div>
                    </div>
                </div>

                {/* Key Endpoints */}
                <div className="mt-4 md:mt-8 bg-gray-800 rounded-xl p-4 md:p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Key API Endpoints</h2>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gray-700 rounded-lg p-3 md:p-4">
                            <h3 className="text-green-400 font-bold mb-2 text-sm md:text-base">Calculation Service :8001</h3>
                            <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                                <li>• POST /api/calculate</li>
                                <li>• GET /api/calculation/:id</li>
                                <li>• POST /api/validate</li>
                                <li>• POST /api/analyze-scenario</li>
                            </ul>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-3 md:p-4">
                            <h3 className="text-purple-400 font-bold mb-2 text-sm md:text-base">ML Service :8010</h3>
                            <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                                <li>• POST /api/ml/detect-anomalies</li>
                                <li>• POST /api/ml/impute</li>
                                <li>• POST /api/ml/benchmark</li>
                                <li>• POST /api/ml/rank-actions</li>
                            </ul>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-3 md:p-4">
                            <h3 className="text-orange-400 font-bold mb-2 text-sm md:text-base">PDF Service :8020</h3>
                            <ul className="text-gray-300 text-xs md:text-sm space-y-1">
                                <li>• POST /api/pdf/generate</li>
                                <li>• GET /api/pdf/reports</li>
                                <li>• GET /api/pdf/file/:filename</li>
                                <li>• POST /api/pdf/chart</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarbonScoreArchitecture;
