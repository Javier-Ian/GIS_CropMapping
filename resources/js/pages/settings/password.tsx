import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, useEffect } from 'react';

import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Shield, Key, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className={`space-y-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Clean Password Security Card */}
                    <Card className="border border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-teal-200/80">
                        <CardHeader className="bg-gradient-to-r from-slate-50/80 to-teal-50/60 border-b border-slate-100/80 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-teal-100/80 border border-teal-200/50">
                                    <Shield className="h-5 w-5 text-teal-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-slate-800 font-semibold text-xl flex items-center gap-2">
                                        Password Security
                                        <Lock className="h-4 w-4 text-teal-600" />
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 font-medium">Update your password to keep your account secure</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {/* Clean Security Tips */}
                            <div className="mb-6 p-4 bg-teal-50/60 border border-teal-200/60 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-teal-100/80">
                                        <Key className="h-4 w-4 text-teal-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 mb-2">Password Security Tips</h4>
                                        <ul className="text-sm text-slate-600 space-y-1">
                                            <li>• Use at least 8 characters with mixed case letters</li>
                                            <li>• Include numbers and special characters</li>
                                            <li>• Avoid common words or personal information</li>
                                            <li>• Use a unique password for this account</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={updatePassword} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password" className="text-slate-700 font-medium flex items-center gap-2">
                                        <Lock className="h-4 w-4 text-slate-500" />
                                        Current Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            type={showPasswords.current ? "text" : "password"}
                                            className={`border transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-lg pr-12 ${errors.current_password ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300'}`}
                                            autoComplete="current-password"
                                            placeholder="Enter your current password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
                                            onClick={() => togglePasswordVisibility('current')}
                                        >
                                            {showPasswords.current ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
                                        </Button>
                                    </div>
                                    {errors.current_password && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.current_password}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-700 font-medium flex items-center gap-2">
                                        <Key className="h-4 w-4 text-slate-500" />
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            type={showPasswords.new ? "text" : "password"}
                                            className={`border transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-lg pr-12 ${errors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300'}`}
                                            autoComplete="new-password"
                                            placeholder="Enter your new password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
                                            onClick={() => togglePasswordVisibility('new')}
                                        >
                                            {showPasswords.new ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation" className="text-slate-700 font-medium flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-slate-500" />
                                        Confirm New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            type={showPasswords.confirm ? "text" : "password"}
                                            className={`border transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-lg pr-12 ${errors.password_confirmation ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300'}`}
                                            autoComplete="new-password"
                                            placeholder="Confirm your new password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                        >
                                            {showPasswords.confirm ? <EyeOff className="h-4 w-4 text-slate-500" /> : <Eye className="h-4 w-4 text-slate-500" />}
                                        </Button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.password_confirmation}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-2">
                                    <Button 
                                        disabled={processing}
                                        className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 px-6 py-2"
                                    >
                                        <Shield className="mr-2 h-4 w-4" />
                                        {processing ? 'Updating...' : 'Update Password'}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        leave="transition ease-in-out duration-300"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <div className="flex items-center gap-2 text-teal-700 bg-teal-50 px-3 py-2 rounded-lg border border-teal-200 font-medium text-sm">
                                            <CheckCircle className="h-4 w-4" />
                                            Password updated successfully!
                                        </div>
                                    </Transition>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
