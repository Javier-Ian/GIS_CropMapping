import { Head, useForm, Link, router } from '@inertiajs/react';
import { LoaderCircle, Globe, LogIn, ArrowLeft, MapPin, Satellite, Navigation } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        if (processing) {
            // Simulate loading progress with realistic steps
            const progressSteps = [
                { progress: 20, delay: 200, text: "Validating credentials..." },
                { progress: 45, delay: 600, text: "Connecting to server..." },
                { progress: 70, delay: 1000, text: "Loading GIS data..." },
                { progress: 90, delay: 1400, text: "Preparing dashboard..." },
                { progress: 100, delay: 1800, text: "Almost ready!" }
            ];

            progressSteps.forEach(({ progress, delay }) => {
                setTimeout(() => {
                    setLoadingProgress(progress);
                }, delay);
            });
        } else {
            setLoadingProgress(0);
        }
    }, [processing]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login - GIS Crop Land Use Mapping" />
            
            {/* Loading Overlay */}
            {processing && (
                <div className="fixed inset-0 z-50 bg-gradient-to-br from-emerald-900/95 via-green-900/95 to-teal-900/95 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center space-y-8 p-8">
                        {/* Animated GIS Loading Icons */}
                        <div className="relative">
                            <div className="flex justify-center space-x-4 mb-6">
                                <div className="relative">
                                    <MapPin className="w-8 h-8 text-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '200ms' }}></div>
                                </div>
                                <div className="relative">
                                    <Satellite className="w-8 h-8 text-green-400 animate-bounce" style={{ animationDelay: '200ms' }} />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '400ms' }}></div>
                                </div>
                                <div className="relative">
                                    <Navigation className="w-8 h-8 text-teal-400 animate-bounce" style={{ animationDelay: '400ms' }} />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '600ms' }}></div>
                                </div>
                                <div className="relative">
                                    <Globe className="w-8 h-8 text-cyan-400 animate-bounce" style={{ animationDelay: '600ms' }} />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '800ms' }}></div>
                                </div>
                            </div>
                            
                            {/* Orbital animation around icons */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 border-2 border-emerald-400/30 rounded-full animate-spin" style={{ animationDuration: '3s' }}>
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
                                </div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-40 h-40 border border-green-400/20 rounded-full animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1"></div>
                                </div>
                            </div>
                        </div>

                        {/* Loading Text */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-white">
                                {loadingProgress < 30 ? "Validating credentials..." :
                                 loadingProgress < 50 ? "Connecting to server..." :
                                 loadingProgress < 75 ? "Loading GIS data..." :
                                 loadingProgress < 95 ? "Preparing dashboard..." :
                                 "Almost ready!"}
                            </h2>
                            <p className="text-emerald-200">Accessing your GIS mapping workspace</p>
                        </div>

                        {/* Custom Progress Bar */}
                        <div className="w-80 mx-auto space-y-3">
                            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                                <div 
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${loadingProgress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                                    <div className="absolute right-0 top-0 w-4 h-full bg-white/40 rounded-full blur-sm"></div>
                                </div>
                            </div>
                            <div className="flex justify-between text-sm text-emerald-200">
                                <span>Loading...</span>
                                <span>{loadingProgress}%</span>
                            </div>
                        </div>

                        {/* Animated Data Points */}
                        <div className="flex justify-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '800ms' }}></div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className={`h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden ${processing ? 'pointer-events-none' : ''}`}>
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-200/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-200/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
                </div>

                {/* Back to Home Link */}
                <div className="absolute top-4 left-4 z-10">
                    <button 
                        onClick={() => {
                            console.log('Navigating to home page');
                            router.visit('/');
                        }}
                        className="group flex items-center space-x-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-green-700 font-medium transition-all duration-300 hover:bg-white hover:shadow-lg text-sm cursor-pointer"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span>Back to Home</span>
                    </button>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex items-center justify-center h-screen p-4">
                    <div className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        
                        {/* Combined Card */}
                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6">
                            <div className="text-center space-y-4 mb-6">
                                {/* Logo */}
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                                            <Globe className="w-6 h-6 text-white animate-pulse" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
                                    </div>
                                </div>

                                {/* System Name */}
                                <div>
                                    <h1 className="text-lg font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                                        GIS CROP LAND USE MAPPING
                                    </h1>
                                    <p className="text-xs text-green-600/70 font-bold uppercase">
                                        REMOTE DATA MANAGEMENT SYSTEM
                                    </p>
                                </div>

                                {/* Badge */}
                                <div className="inline-flex items-center px-3 py-1.5 bg-green-100 rounded-full text-green-700 text-sm font-medium">
                                    <LogIn className="w-3 h-3 mr-2 animate-bounce" />
                                    Sign In to Continue
                                </div>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center text-sm font-medium text-green-700">
                                    {status}
                                </div>
                            )}

                            <form className="space-y-4" onSubmit={submit}>
                                <div className="space-y-3">
                                    {/* Email Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter your email address"
                                            className="h-10 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500/20 transition-all duration-300 text-gray-900 placeholder:text-gray-500"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Password</Label>
                                            {canResetPassword && (
                                                <Link 
                                                    href="/forgot-password" 
                                                    className="text-xs text-green-600 hover:text-green-700 transition-colors duration-300 font-medium"
                                                    tabIndex={5}
                                                >
                                                    Forgot password?
                                                </Link>
                                            )}
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter your password"
                                            className="h-10 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500/20 transition-all duration-300 text-gray-900 placeholder:text-gray-500"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Remember Me */}
                                    <div className="flex items-center space-x-3 py-2">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            checked={data.remember}
                                            onClick={() => setData('remember', !data.remember)}
                                            tabIndex={3}
                                            className="border-2 border-gray-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                        />
                                        <Label htmlFor="remember" className="text-sm text-gray-700 font-medium">Remember me</Label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    className={`w-full h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105 ${processing ? 'animate-pulse' : ''}`}
                                    tabIndex={4} 
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="flex space-x-1">
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                            <span>Signing In...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <LogIn className="h-4 w-4 mr-2" />
                                            Sign In
                                        </>
                                    )}
                                </Button>

                                {/* Register Link */}
                                <div className="text-center pt-2">
                                    <p className="text-gray-600 text-sm">
                                        Don't have an account?{' '}
                                        <Link 
                                            href="/register" 
                                            tabIndex={6}
                                            className="font-medium text-green-600 hover:text-green-700 transition-colors duration-300"
                                        >
                                            Sign up here
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
