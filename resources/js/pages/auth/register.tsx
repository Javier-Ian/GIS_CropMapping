import { Head, Link, useForm, router } from '@inertiajs/react';
import { Globe, LoaderCircle, Sprout } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function Register() {
    const [isVisible, setIsVisible] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register - GIS Crop Land Use Mapping" />

            <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#00786f]/10 via-[#00786f]/5 to-[#00786f]/10">
                {/* Animated Background Elements */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 h-72 w-72 animate-pulse rounded-full bg-[#00786f]/10 mix-blend-multiply blur-xl filter"></div>
                    <div className="absolute top-3/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-[#00786f]/15 mix-blend-multiply blur-xl filter delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 h-80 w-80 animate-pulse rounded-full bg-[#00786f]/10 mix-blend-multiply blur-xl filter delay-500"></div>
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex h-screen items-center justify-center p-4">
                    <div
                        className={`w-full max-w-md transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                    >
                        {/* Combined Card */}
                        <div className="rounded-3xl border border-white/50 bg-white/90 p-6 shadow-2xl backdrop-blur-sm">
                            <div className="mb-6 space-y-4 text-center">
                                {/* Logo */}
                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00786f] to-[#00786f] shadow-lg">
                                            <Globe className="h-6 w-6 animate-pulse text-white" />
                                        </div>
                                        <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-amber-400"></div>
                                    </div>
                                </div>

                                {/* System Name */}
                                <div>
                                    <h1 className="bg-gradient-to-r from-[#00786f] to-[#00786f] bg-clip-text text-lg font-bold text-transparent">
                                        GIS CROP LAND USE MAPPING
                                    </h1>
                                    <p className="text-xs font-bold text-[#00786f]/70 uppercase">REMOTE DATA MANAGEMENT SYSTEM</p>
                                </div>

                                {/* Badge */}
                                <div className="inline-flex items-center rounded-full bg-[#00786f]/10 px-3 py-1.5 text-sm font-medium text-[#00786f]">
                                    <Sprout className="mr-2 h-3 w-3 animate-bounce" />
                                    Create Your Account
                                </div>
                            </div>

                            <form className="space-y-4" onSubmit={submit}>
                                <div className="space-y-3">
                                    {/* Name Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                            Full Name
                                        </Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter your full name"
                                            className="h-10 rounded-xl border-2 border-gray-200 transition-all duration-300 focus:border-[#00786f] focus:ring-[#00786f]/20 text-gray-900 placeholder:text-gray-500"
                                        />
                                        <InputError message={errors.name} className="mt-1" />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            tabIndex={2}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={processing}
                                            placeholder="Enter your email address"
                                            className="h-10 rounded-xl border-2 border-gray-200 transition-all duration-300 focus:border-[#00786f] focus:ring-[#00786f]/20 text-gray-900 placeholder:text-gray-500"
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={3}
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            disabled={processing}
                                            placeholder="Create a secure password"
                                            className="h-10 rounded-xl border-2 border-gray-200 transition-all duration-300 focus:border-[#00786f] focus:ring-[#00786f]/20 text-gray-900 placeholder:text-gray-500"
                                        />
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="space-y-1">
                                        <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">
                                            Confirm Password
                                        </Label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            required
                                            tabIndex={4}
                                            autoComplete="new-password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            disabled={processing}
                                            placeholder="Confirm your password"
                                            className="h-10 rounded-xl border-2 border-gray-200 transition-all duration-300 focus:border-[#00786f] focus:ring-[#00786f]/20 text-gray-900 placeholder:text-gray-500"
                                        />
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="h-10 w-full rounded-xl bg-gradient-to-r from-[#00786f] to-[#00786f] font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-[#00786f]/90 hover:to-[#00786f]/90 hover:shadow-xl hover:shadow-[#00786f]/30"
                                    tabIndex={5}
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Account
                                </Button>

                                {/* Login Link */}
                                <div className="pt-2 text-center">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{' '}
                                        <Link
                                            href="/login"
                                            tabIndex={6}
                                            className="font-medium text-[#00786f] transition-colors duration-300 hover:text-[#00786f]/80"
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
