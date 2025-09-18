import { Head, useForm, Link, router } from '@inertiajs/react';
import { LoaderCircle, Globe, Key } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ResetPasswordForm = {
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ForgotPassword({ status }: { status?: string }) {
    const [isVisible, setIsVisible] = useState(false);
    const { data, setData, post, processing, errors } = useForm<Required<ResetPasswordForm>>({
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <>
            <Head title="Reset Password - GIS Crop Land Use Mapping" />
            
            <div className="h-screen bg-gradient-to-br from-[#00786f]/10 via-[#00786f]/5 to-[#00786f]/10 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#00786f]/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-[#00786f]/15 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#00786f]/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
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
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#00786f] to-[#00786f] rounded-2xl flex items-center justify-center shadow-lg">
                                            <Globe className="w-6 h-6 text-white animate-pulse" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
                                    </div>
                                </div>

                                {/* System Name */}
                                <div>
                                    <h1 className="text-lg font-bold bg-gradient-to-r from-[#00786f] to-[#00786f] bg-clip-text text-transparent">
                                        GIS CROP LAND USE MAPPING
                                    </h1>
                                    <p className="text-xs text-[#00786f]/70 font-bold uppercase">
                                        REMOTE DATA MANAGEMENT SYSTEM
                                    </p>
                                </div>

                                {/* Badge */}
                                <div className="inline-flex items-center px-3 py-1.5 bg-[#00786f]/10 rounded-full text-[#00786f] text-sm font-medium">
                                    <Key className="w-3 h-3 mr-2 animate-bounce" />
                                    Reset Your Password
                                </div>
                            </div>

                            {/* Status Message */}
                            {status && (
                                <div className="mb-4 p-3 bg-[#00786f]/10 border border-[#00786f]/20 rounded-xl text-center text-sm font-medium text-[#00786f]">
                                    {status}
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <p className="text-gray-600 text-sm">
                                    Enter your registered email address and create a new password.
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
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter your registered email"
                                            className="h-10 border-2 border-gray-200 rounded-xl focus:border-[#00786f] focus:ring-[#00786f]/20 transition-all duration-300 text-gray-900 placeholder:text-gray-500"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* New Password Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="password" className="text-gray-700 font-medium text-sm">New Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            name="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="Create a new secure password"
                                            className="h-10 border-2 border-gray-200 rounded-xl focus:border-[#00786f] focus:ring-[#00786f]/20 transition-all duration-300 text-gray-900 placeholder:text-gray-500"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="password_confirmation" className="text-gray-700 font-medium text-sm">Confirm New Password</Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                            placeholder="Confirm your new password"
                                            className="h-10 border-2 border-gray-200 rounded-xl focus:border-[#00786f] focus:ring-[#00786f]/20 transition-all duration-300 text-gray-900 placeholder:text-gray-500"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button 
                                    type="submit" 
                                    className="w-full h-10 bg-gradient-to-r from-[#00786f] to-[#00786f] hover:from-[#00786f]/90 hover:to-[#00786f]/90 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-[#00786f]/30 hover:scale-105" 
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                    Reset Password
                                </Button>

                                {/* Back to Login Link */}
                                <div className="text-center pt-2">
                                    <p className="text-gray-600 text-sm">
                                        Remember your password?{' '}
                                        <button
                                            onClick={() => {
                                                console.log('Navigating to login page from form');
                                                router.visit('/login');
                                            }}
                                            tabIndex={5}
                                            className="font-medium text-[#00786f] hover:text-[#00786f]/80 transition-colors duration-300 cursor-pointer underline"
                                        >
                                            Sign in here
                                        </button>
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
