import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { MapPin, Globe, Users, TreePine, Wheat, Map, BarChart, Sprout, ChevronRight, FileText } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [isVisible, setIsVisible] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: <Map className="w-8 h-8" />,
            title: "Upload Mapping",
            description: "Upload and analyze your own mapping data for precise crop management"
        },
        {
            icon: <BarChart className="w-8 h-8" />,
            title: "Data Analytics",
            description: "Comprehensive analytics to optimize agricultural productivity"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "GIS File Management",
            description: "Support for QGIS projects, Shapefiles, GeoJSON, KML and other GIS formats"
        }
    ];

    return (
        <>
            <Head title="GIS CROP LAND USE MAPPING - Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700&display=swap" rel="stylesheet" />
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    
                    @keyframes float-delayed {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-30px); }
                    }
                    
                    @keyframes float-slow {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                    }
                    
                    @keyframes extend-line {
                        0% { width: 0%; opacity: 0; }
                        20% { opacity: 1; }
                        100% { width: 100%; opacity: 0.8; }
                    }
                    
                    @keyframes slide-right {
                        0% { transform: translateX(-20px); opacity: 0; }
                        50% { opacity: 1; }
                        100% { transform: translateX(150px); opacity: 0; }
                    }
                    
                    @keyframes slide-right-delayed {
                        0% { transform: translateX(-15px); opacity: 0; }
                        60% { opacity: 1; }
                        100% { transform: translateX(120px); opacity: 0; }
                    }
                    
                    @keyframes slide-right-slow {
                        0% { transform: translateX(-10px); opacity: 0; }
                        40% { opacity: 1; }
                        100% { transform: translateX(100px); opacity: 0; }
                    }
                    
                    @keyframes grow-vertical {
                        0% { height: 0; opacity: 0; }
                        30% { opacity: 1; }
                        100% { height: 3rem; opacity: 0.6; }
                    }
                    
                    @keyframes grow-vertical-delayed {
                        0% { height: 0; opacity: 0; }
                        40% { opacity: 1; }
                        100% { height: 4rem; opacity: 0.4; }
                    }
                    
                    @keyframes grow-vertical-slow {
                        0% { height: 0; opacity: 0; }
                        50% { opacity: 1; }
                        100% { height: 2rem; opacity: 0.5; }
                    }
                    
                    @keyframes float-dot {
                        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
                        50% { transform: translateY(-30px) scale(1.5); opacity: 1; }
                    }
                    
                    @keyframes float-dot-delayed {
                        0%, 100% { transform: translateY(0px) scale(1); opacity: 0.2; }
                        50% { transform: translateY(-25px) scale(1.3); opacity: 0.8; }
                    }
                    
                    @keyframes fade-up {
                        0% { opacity: 0; transform: translateY(10px); }
                        100% { opacity: 0.6; transform: translateY(0px); }
                    }
                    
                    @keyframes fade-up-delayed {
                        0% { opacity: 0; transform: translateY(8px); }
                        100% { opacity: 0.4; transform: translateY(0px); }
                    }
                    
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    
                    .animate-float-delayed {
                        animation: float-delayed 8s ease-in-out infinite;
                    }
                    
                    .animate-float-slow {
                        animation: float-slow 10s ease-in-out infinite;
                    }
                    
                    .animate-extend-line {
                        animation: extend-line 4s ease-out infinite;
                    }
                    
                    .animate-slide-right {
                        animation: slide-right 6s ease-in-out infinite;
                    }
                    
                    .animate-slide-right-delayed {
                        animation: slide-right-delayed 7s ease-in-out infinite 1s;
                    }
                    
                    .animate-slide-right-slow {
                        animation: slide-right-slow 8s ease-in-out infinite 2s;
                    }
                    
                    .animate-grow-vertical {
                        animation: grow-vertical 3s ease-out infinite;
                    }
                    
                    .animate-grow-vertical-delayed {
                        animation: grow-vertical-delayed 4s ease-out infinite 1.5s;
                    }
                    
                    .animate-grow-vertical-slow {
                        animation: grow-vertical-slow 5s ease-out infinite 3s;
                    }
                    
                    .animate-float-dot {
                        animation: float-dot 4s ease-in-out infinite;
                    }
                    
                    .animate-float-dot-delayed {
                        animation: float-dot-delayed 5s ease-in-out infinite 2s;
                    }
                    
                    .animate-fade-up {
                        animation: fade-up 2s ease-out forwards;
                    }
                    
                    .animate-fade-up-delayed {
                        animation: fade-up-delayed 3s ease-out forwards 1s;
                    }
                `}</style>
            </Head>

            <div className="h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden flex flex-col">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-200/30 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
                    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full mix-blend-multiply filter blur-xl animate-float-delayed"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-xl animate-float-slow"></div>
                </div>

                {/* Navigation */}
                <nav className={`relative z-10 px-6 py-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Globe className="w-6 h-6 text-white animate-pulse" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
                            </div>
                            <div>
                                <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent leading-tight">
                                    GIS CROP LAND USE MAPPING
                                </h1>
                                <p className="text-xs text-green-600/70 font-bold uppercase">
                                    REMOTE <span className="font-extrabold">DATA MANAGEMENT</span> SYSTEM
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="group relative px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105"
                                >
                                    <span className="relative z-10">Dashboard</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 text-green-700 hover:text-green-800 font-medium transition-colors duration-200"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="group relative px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105"
                                    >
                                        <span className="relative z-10">Register</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 flex-1 flex items-center">
                    <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
                        {/* Left Content */}
                        <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="space-y-4">
                                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
                                    <Sprout className="w-4 h-4 mr-2 animate-bounce" />
                                    Advanced Crop Mapping
                                </div>
                                
                                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                    <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                        Land Use
                                    </span>
                                    <br />
                                    <span className="text-gray-800">
                                        Mapping &
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                                        Data Management
                                    </span>
                                </h1>
                                
                                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                    Upload, analyze, and manage your agricultural GIS data with support for QGIS projects, 
                                    Shapefiles, and multiple file formats for comprehensive crop land use mapping.
                                </p>
                            </div>
                            
                            {/* Minimalist Cinematic Animation */}
                            <div className="relative py-12 max-w-full">
                                {/* Main Moving Line */}
                                <div className="relative h-24 overflow-hidden">
                                    <div className="absolute inset-0">
                                        {/* Horizontal line that extends */}
                                        <div className="absolute top-10 left-0 h-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 animate-extend-line max-w-md"></div>
                                        
                                        {/* Moving geometric shapes */}
                                        <div className="absolute top-8 left-4 w-4 h-4 bg-green-500 rotate-45 animate-slide-right opacity-80"></div>
                                        <div className="absolute top-6 left-20 w-3 h-3 bg-emerald-500 rounded-full animate-slide-right-delayed opacity-60"></div>
                                        <div className="absolute top-12 left-32 w-5 h-2 bg-teal-500 animate-slide-right-slow opacity-70"></div>
                                        
                                        {/* Vertical accent lines */}
                                        <div className="absolute top-4 left-12 w-0.5 h-12 bg-green-300 animate-grow-vertical"></div>
                                        <div className="absolute top-2 left-28 w-0.5 h-16 bg-emerald-300 animate-grow-vertical-delayed"></div>
                                        <div className="absolute top-6 left-44 w-0.5 h-8 bg-teal-300 animate-grow-vertical-slow"></div>
                                    </div>
                                </div>
                                
                                {/* Floating minimalist elements */}
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-2 right-8 w-1 h-1 bg-green-400 rounded-full animate-float-dot"></div>
                                    <div className="absolute bottom-4 left-16 w-1 h-1 bg-emerald-400 rounded-full animate-float-dot-delayed"></div>
                                    <div className="absolute top-8 right-20 w-2 h-0.5 bg-teal-400 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right Visual */}
                        <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="relative">
                                {/* Main Card */}
                                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
                                    <div className="space-y-6">
                                        {/* Animated Feature Cards */}
                                        <div className="space-y-4">
                                            {features.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className={`p-4 rounded-2xl transition-all duration-500 ${
                                                        currentFeature === index
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-105 shadow-lg'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`p-2 rounded-xl ${
                                                            currentFeature === index ? 'bg-white/20' : 'bg-white'
                                                        }`}>
                                                            <div className={currentFeature === index ? 'text-white' : 'text-green-600'}>
                                                                {feature.icon}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-lg">{feature.title}</h3>
                                                            <p className={`text-sm ${
                                                                currentFeature === index ? 'text-white/90' : 'text-gray-600'
                                                            }`}>
                                                                {feature.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl rotate-12 animate-bounce shadow-lg flex items-center justify-center">
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                                
                                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-500 rounded-xl -rotate-12 animate-pulse shadow-lg flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
