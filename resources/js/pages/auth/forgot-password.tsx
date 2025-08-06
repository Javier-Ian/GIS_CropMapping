import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle, Globe, Mail, ArrowLeft } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword({ status }: { status?: string }) {
    const [isVisible, setIsVisible] = useState(false);
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password - GIS Crop Land Use Mapping" />
            
            <div className="h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-200/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-teal-200/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
                </div>

                {/* Back to Login Link */}
                <div className="absolute top-4 left-4 z-10">
                    <Link 
                        href={route('login')} 
                        className="group flex items-center space-x-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-green-700 font-medium transition-all duration-300 hover:bg-white hover:shadow-lg text-sm"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform duration-300" />
                        <span>Back to Login</span>
                    </Link>
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
                                    <Mail className="w-3 h-3 mr-2 animate-bounce" />
                                    Reset Your Password
                                </div>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center text-sm font-medium text-green-700">
                                    {status}
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <p className="text-gray-600 text-sm">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                            </div>

                            <form className="space-y-4" onSubmit={submit}>
                                <div className="space-y-3">
                                    {/* Email Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter your email address"
                                            className="h-10 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-green-500/20 transition-all duration-300"
                                        />
                                        <InputError message={errors.email} />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    className="w-full h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30 hover:scale-105" 
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Send Reset Link
                                </Button>

                                {/* Back to Login Link */}
                                <div className="text-center pt-2">
                                    <p className="text-gray-600 text-sm">
                                        Remember your password?{' '}
                                        <Link 
                                            href={route('login')}
                                            className="font-medium text-green-600 hover:text-green-700 transition-colors duration-300"
                                        >
                                            Sign in here
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
