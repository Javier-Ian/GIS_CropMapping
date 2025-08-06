import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BarChart3, Globe, Leaf, MapPin, Satellite, TreePine, Users, Wheat } from 'lucide-react';
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
            icon: <Satellite className="h-8 w-8" />,
            title: 'Satellite Mapping',
            description: 'Advanced satellite imagery analysis for precise crop monitoring',
        },
        {
            icon: <BarChart3 className="h-8 w-8" />,
            title: 'Data Analytics',
            description: 'Comprehensive analytics to optimize agricultural productivity',
        },
        {
            icon: <TreePine className="h-8 w-8" />,
            title: 'Environmental Impact',
            description: 'Monitor environmental changes and sustainability metrics',
        },
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

            <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="animate-float absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-green-200/30 mix-blend-multiply blur-xl filter"></div>
                    <div className="animate-float-delayed absolute top-3/4 right-1/4 h-96 w-96 rounded-full bg-emerald-200/30 mix-blend-multiply blur-xl filter"></div>
                    <div className="animate-float-slow absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full bg-teal-200/30 mix-blend-multiply blur-xl filter"></div>
                </div>

                {/* Navigation */}
                <nav
                    className={`relative z-10 px-6 py-6 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                                    <Globe className="h-6 w-6 animate-pulse text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-amber-400"></div>
                            </div>
                            <div>
                                <h1 className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-xl font-bold text-transparent">
                                    GIS Crop Mapping
                                </h1>
                                <p className="text-xs text-green-600/70">Agricultural Intelligence</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="group relative rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-2.5 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                                >
                                    <span className="relative z-10">Dashboard</span>
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-4 py-2 font-medium text-green-700 transition-colors duration-200 hover:text-green-800"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="group relative rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-2.5 font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
                                    >
                                        <span className="relative z-10">Get Started</span>
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24">
                    <div className="grid items-center gap-16 lg:grid-cols-2">
                        {/* Left Content */}
                        <div
                            className={`space-y-8 transition-all delay-300 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                        >
                            <div className="space-y-4">
                                <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                                    <Leaf className="mr-2 h-4 w-4 animate-bounce" />
                                    Next-Generation Agriculture
                                </div>

                                <h1 className="text-5xl leading-tight font-bold lg:text-6xl">
                                    <span className="bg-gradient-to-r from-green-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                        Smart Farming
                                    </span>
                                    <br />
                                    <span className="text-gray-800">Through</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                                        GIS Technology
                                    </span>
                                </h1>

                                <p className="max-w-lg text-xl leading-relaxed text-gray-600">
                                    Revolutionize your agricultural practices with cutting-edge GIS mapping, real-time crop monitoring, and
                                    data-driven insights for sustainable farming.
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href={auth.user ? route('dashboard') : route('register')}
                                    className="group relative flex items-center justify-center rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30"
                                >
                                    <span className="relative z-10 mr-2">{auth.user ? 'Go to Dashboard' : 'Start Mapping'}</span>
                                    <ArrowRight className="relative z-10 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-700 to-emerald-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                                </Link>

                                <button className="group flex items-center justify-center rounded-2xl border-2 border-green-200 px-8 py-4 text-lg font-semibold text-green-700 transition-all duration-300 hover:border-green-300 hover:bg-green-50">
                                    <MapPin className="mr-2 h-5 w-5 group-hover:animate-pulse" />
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
                                                            ? 'scale-105 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className={`rounded-xl p-2 ${currentFeature === index ? 'bg-white/20' : 'bg-white'}`}>
                                                            <div className={currentFeature === index ? 'text-white' : 'text-green-600'}>
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

                                        {/* Live Data Simulation */}
                                        <div className="border-t border-gray-200 pt-6">
                                            <div className="mb-4 flex items-center justify-between">
                                                <h4 className="font-semibold text-gray-800">Live Crop Data</h4>
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                                                    <span className="text-xs text-gray-600">Real-time</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="rounded-xl bg-green-50 p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <Wheat className="h-4 w-4 text-green-600" />
                                                        <span className="text-sm text-green-800">Wheat</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-green-700">847 acres</div>
                                                </div>

                                                <div className="rounded-xl bg-amber-50 p-3">
                                                    <div className="flex items-center space-x-2">
                                                        <TreePine className="h-4 w-4 text-amber-600" />
                                                        <span className="text-sm text-amber-800">Corn</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-amber-700">623 acres</div>
                                                </div>
                                            </div>
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

                {/* Features Section */}
                <div
                    className={`relative z-10 mx-auto max-w-7xl px-6 pb-24 transition-all delay-700 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-4xl font-bold text-gray-800">
                            Why Choose Our{' '}
                            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">GIS Platform?</span>
                        </h2>
                        <p className="mx-auto max-w-2xl text-xl text-gray-600">
                            Experience the future of agriculture with our comprehensive GIS solutions
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {[
                            {
                                icon: <Satellite className="h-12 w-12" />,
                                title: 'Precision Mapping',
                                description: 'High-resolution satellite imagery and drone mapping for accurate field analysis',
                                color: 'from-blue-500 to-cyan-500',
                            },
                            {
                                icon: <BarChart3 className="h-12 w-12" />,
                                title: 'Advanced Analytics',
                                description: 'AI-powered insights and predictive analytics for optimal crop management',
                                color: 'from-green-500 to-emerald-500',
                            },
                            {
                                icon: <Leaf className="h-12 w-12" />,
                                title: 'Sustainable Solutions',
                                description: 'Environmentally conscious farming practices with real-time monitoring',
                                color: 'from-amber-500 to-orange-500',
                            },
                        ].map((item, index) => (
                            <div
                                key={index}
                                className="group rounded-2xl border border-white/50 bg-white/80 p-8 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                <div
                                    className={`h-16 w-16 bg-gradient-to-br ${item.color} mb-6 flex items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-110`}
                                >
                                    {item.icon}
                                </div>
                                <h3 className="mb-4 text-xl font-bold text-gray-800">{item.title}</h3>
                                <p className="leading-relaxed text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div
                    className={`relative z-10 mx-auto max-w-4xl px-6 pb-24 transition-all delay-900 duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                    <div className="rounded-3xl bg-gradient-to-r from-green-600 to-emerald-600 p-12 text-center shadow-2xl">
                        <h2 className="mb-4 text-3xl font-bold text-white">Ready to Transform Your Farm?</h2>
                        <p className="mx-auto mb-8 max-w-2xl text-xl text-green-100">
                            Join thousands of farmers who are already using our GIS technology to optimize their crops and increase yields.
                        </p>
                        <Link
                            href={auth.user ? route('dashboard') : route('register')}
                            className="group inline-flex items-center rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-green-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            <span className="mr-2">{auth.user ? 'Access Dashboard' : 'Start Free Trial'}</span>
                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
