import { Head, useForm, Link, router } from '@inertiajs/react';
import { LoaderCircle, Globe, LogIn, ArrowLeft } from 'lucide-react';
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
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login - GIS Crop Land Use Mapping" />
            
            <div className="h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
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
                                    className="w-full h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105" 
                                    tabIndex={4} 
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Sign In
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
