import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { MapPin, Leaf, BarChart3, Globe, Users, ArrowRight, Satellite, TreePine, Wheat } from 'lucide-react';

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
            icon: <Satellite className="w-8 h-8" />,
            title: "Satellite Mapping",
            description: "Advanced satellite imagery analysis for precise crop monitoring"
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Data Analytics",
            description: "Comprehensive analytics to optimize agricultural productivity"
        },
        {
            icon: <TreePine className="w-8 h-8" />,
            title: "Environmental Impact",
            description: "Monitor environmental changes and sustainability metrics"
        }
    ];

    return (
        <>
            <Head title="GIS Crop Mapping - Welcome">
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
                    
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    
                    .animate-float-delayed {
                        animation: float-delayed 8s ease-in-out infinite;
                    }
                    
                    .animate-float-slow {
                        animation: float-slow 10s ease-in-out infinite;
                    }
                `}</style>
            </Head>

            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
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
                                <h1 className="text-xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                                    GIS Crop Mapping
                                </h1>
                                <p className="text-xs text-green-600/70">Agricultural Intelligence</p>
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
                                        <span className="relative z-10">Get Started</span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="space-y-4">
                                <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
                                    <Leaf className="w-4 h-4 mr-2 animate-bounce" />
                                    Next-Generation Agriculture
                                </div>
                                
                                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                    <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                        Smart Farming
                                    </span>
                                    <br />
                                    <span className="text-gray-800">
                                        Through
                                    </span>
                                    <br />
                                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                                        GIS Technology
                                    </span>
                                </h1>
                                
                                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                    Revolutionize your agricultural practices with cutting-edge GIS mapping, 
                                    real-time crop monitoring, and data-driven insights for sustainable farming.
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 flex items-center justify-center"
                                >
                                    <span className="relative z-10 mr-2">
                                        {auth.user ? 'Go to Dashboard' : 'Start Mapping'}
                                    </span>
                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-emerald-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                                
                                <button className="group px-8 py-4 border-2 border-green-200 text-green-700 rounded-2xl font-semibold text-lg transition-all duration-300 hover:border-green-300 hover:bg-green-50 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                                    View Demo
                                </button>
                            </div>
                            
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 pt-8">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">500+</div>
                                    <div className="text-sm text-gray-600">Farms Mapped</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-emerald-600">95%</div>
                                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-teal-600">24/7</div>
                                    <div className="text-sm text-gray-600">Monitoring</div>
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
                                        
                                        {/* Live Data Simulation */}
                                        <div className="border-t border-gray-200 pt-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="font-semibold text-gray-800">Live Crop Data</h4>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span className="text-xs text-gray-600">Real-time</span>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-green-50 rounded-xl p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <Wheat className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm text-green-800">Wheat</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-green-700">847 acres</div>
                                                </div>
                                                
                                                <div className="bg-amber-50 rounded-xl p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <TreePine className="w-4 h-4 text-amber-600" />
                                                        <span className="text-sm text-amber-800">Corn</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-amber-700">623 acres</div>
                                                </div>
                                            </div>
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

                {/* Features Section */}
                <div className={`relative z-10 max-w-7xl mx-auto px-6 pb-24 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">
                            Why Choose Our <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">GIS Platform?</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Experience the future of agriculture with our comprehensive GIS solutions
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Satellite className="w-12 h-12" />,
                                title: "Precision Mapping",
                                description: "High-resolution satellite imagery and drone mapping for accurate field analysis",
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                icon: <BarChart3 className="w-12 h-12" />,
                                title: "Advanced Analytics",
                                description: "AI-powered insights and predictive analytics for optimal crop management",
                                color: "from-green-500 to-emerald-500"
                            },
                            {
                                icon: <Leaf className="w-12 h-12" />,
                                title: "Sustainable Solutions",
                                description: "Environmentally conscious farming practices with real-time monitoring",
                                color: "from-amber-500 to-orange-500"
                            }
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className={`relative z-10 max-w-4xl mx-auto px-6 pb-24 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-center shadow-2xl">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to Transform Your Farm?
                        </h2>
                        <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                            Join thousands of farmers who are already using our GIS technology to optimize their crops and increase yields.
                        </p>
                        <Link
                            href={auth.user ? route('dashboard') : route('register')}
                            className="group inline-flex items-center px-8 py-4 bg-white text-green-600 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
                        >
                            <span className="mr-2">{auth.user ? 'Access Dashboard' : 'Start Free Trial'}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
