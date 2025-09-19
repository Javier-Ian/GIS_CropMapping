import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart, FileText, Globe, Map, Sprout, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

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
            icon: <Map className="h-8 w-8" />,
            title: 'Upload Mapping',
            description: 'Upload and analyze your own mapping data for precise crop management',
        },
        {
            icon: <BarChart className="h-8 w-8" />,
            title: 'Data Analytics',
            description: 'Comprehensive analytics to optimize agricultural productivity',
        },
        {
            icon: <FileText className="h-8 w-8" />,
            title: 'GIS File Management',
            description: 'Support for QGIS projects, Shapefiles, GeoJSON, KML and other GIS formats',
        },
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

            <div className="relative flex h-screen flex-col overflow-hidden bg-gradient-to-br from-[#00786f]/10 via-[#00786f]/5 to-[#00786f]/10">
                {/* Animated Background Elements */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="animate-float absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-[#00786f]/20 mix-blend-multiply blur-xl filter"></div>
                    <div className="animate-float-delayed absolute top-3/4 right-1/4 h-96 w-96 rounded-full bg-[#00786f]/15 mix-blend-multiply blur-xl filter"></div>
                    <div className="animate-float-slow absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full bg-[#00786f]/20 mix-blend-multiply blur-xl filter"></div>
                </div>

                {/* Navigation */}
                <nav
                    className={`relative z-10 px-6 py-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00786f] to-[#00786f] shadow-lg">
                                    <Globe className="h-6 w-6 animate-pulse text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-amber-400"></div>
                            </div>
                            <div>
                                <h1 className="bg-gradient-to-r from-[#00786f] to-[#00786f] bg-clip-text text-lg leading-tight font-bold text-transparent lg:text-xl">
                                    GIS CROP LAND USE MAPPING
                                </h1>
                                <p className="text-xs font-bold text-[#00786f]/70 uppercase">
                                    REMOTE <span className="font-extrabold">DATA MANAGEMENT</span> SYSTEM
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="group relative rounded-full bg-gradient-to-r from-[#00786f] to-[#00786f] px-6 py-2.5 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00786f]/25"
                                >
                                    <span className="relative z-10">Dashboard</span>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00786f]/90 to-[#00786f]/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 font-medium text-[#00786f] transition-colors duration-200 hover:text-[#00786f]/80"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="group relative rounded-full bg-gradient-to-r from-[#00786f] to-[#00786f] px-6 py-2.5 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#00786f]/25"
                                    >
                                        <span className="relative z-10">Register</span>
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#00786f]/90 to-[#00786f]/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative z-10 mx-auto flex max-w-7xl flex-1 items-center px-6">
                    <div className="grid w-full items-center gap-12 lg:grid-cols-2">
                        {/* Left Content */}
                        <div
                            className={`space-y-8 transition-all delay-300 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                        >
                            <div className="space-y-4">
                                <div className="inline-flex items-center rounded-full bg-[#00786f]/10 px-4 py-2 text-sm font-medium text-[#00786f]">
                                    <Sprout className="mr-2 h-4 w-4 animate-bounce" />
                                    Advanced Crop Mapping
                                </div>

                                <h1 className="text-5xl leading-tight font-bold lg:text-6xl">
                                    <span className="bg-gradient-to-r from-[#00786f] via-[#00786f] to-[#00786f] bg-clip-text text-transparent">
                                        Land Use
                                    </span>
                                    <br />
                                    <span className="text-gray-800">Mapping &</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                                        Data Management
                                    </span>
                                </h1>

                                <p className="max-w-lg text-xl leading-relaxed text-gray-600">
                                    Upload, analyze, and manage your agricultural GIS data with support for QGIS projects, Shapefiles, and multiple
                                    file formats for comprehensive crop land use mapping.
                                </p>
                            </div>

                            {/* Minimalist Cinematic Animation */}
                            <div className="relative max-w-full py-12">
                                {/* Main Moving Line */}
                                <div className="relative h-24 overflow-hidden">
                                    <div className="absolute inset-0">
                                        {/* Horizontal line that extends */}
                                        <div className="animate-extend-line absolute top-10 left-0 h-0.5 max-w-md bg-gradient-to-r from-[#00786f] via-[#00786f] to-[#00786f]"></div>

                                        {/* Moving geometric shapes */}
                                        <div className="animate-slide-right absolute top-8 left-4 h-4 w-4 rotate-45 bg-[#00786f] opacity-80"></div>
                                        <div className="animate-slide-right-delayed absolute top-6 left-20 h-3 w-3 rounded-full bg-[#00786f] opacity-60"></div>
                                        <div className="animate-slide-right-slow absolute top-12 left-32 h-2 w-5 bg-[#00786f] opacity-70"></div>

                                        {/* Vertical accent lines */}
                                        <div className="animate-grow-vertical absolute top-4 left-12 h-12 w-0.5 bg-[#00786f]/60"></div>
                                        <div className="animate-grow-vertical-delayed absolute top-2 left-28 h-16 w-0.5 bg-[#00786f]/60"></div>
                                        <div className="animate-grow-vertical-slow absolute top-6 left-44 h-8 w-0.5 bg-[#00786f]/60"></div>
                                    </div>
                                </div>

                                {/* Floating minimalist elements */}
                                <div className="pointer-events-none absolute inset-0">
                                    <div className="animate-float-dot absolute top-2 right-8 h-1 w-1 rounded-full bg-[#00786f]"></div>
                                    <div className="animate-float-dot-delayed absolute bottom-4 left-16 h-1 w-1 rounded-full bg-[#00786f]"></div>
                                    <div className="absolute top-8 right-20 h-0.5 w-2 animate-pulse bg-[#00786f]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div
                            className={`relative transition-all delay-500 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                        >
                            <div className="relative">
                                {/* Main Card */}
                                <div className="rounded-3xl border border-white/50 bg-white/80 p-8 shadow-2xl backdrop-blur-sm">
                                    <div className="space-y-6">
                                        {/* Animated Feature Cards */}
                                        <div className="space-y-4">
                                            {features.map((feature, index) => (
                                                <div
                                                    key={index}
                                                    className={`rounded-2xl p-4 transition-all duration-500 ${
                                                        currentFeature === index
                                                            ? 'scale-105 bg-gradient-to-r from-[#00786f] to-[#00786f] text-white shadow-lg'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`rounded-xl p-2 ${currentFeature === index ? 'bg-white/20' : 'bg-white'}`}>
                                                            <div className={currentFeature === index ? 'text-white' : 'text-[#00786f]'}>
                                                                {feature.icon}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                                                            <p className={`text-sm ${currentFeature === index ? 'text-white/90' : 'text-gray-600'}`}>
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
                                <div className="absolute -top-4 -right-4 flex h-24 w-24 rotate-12 animate-bounce items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                                    <Users className="h-8 w-8 text-white" />
                                </div>

                                <div className="absolute -bottom-4 -left-4 flex h-20 w-20 -rotate-12 animate-pulse items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 shadow-lg">
                                    <Globe className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
