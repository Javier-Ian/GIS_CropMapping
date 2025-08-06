import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { User, Mail, Save, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

type ProfileForm = {
    name: string;
    email: string;
};

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className={`space-y-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Animated Header Card */}
                    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30">
                        <CardHeader className="bg-gradient-to-r from-emerald-100/50 to-teal-100/50 border-b border-emerald-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-100">
                                    <User className="h-6 w-6 text-emerald-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-emerald-800 font-bold text-2xl flex items-center gap-2">
                                        Profile Information
                                        <Sparkles className="h-5 w-5 text-emerald-600 animate-pulse" />
                                    </CardTitle>
                                    <CardDescription className="text-emerald-600 font-medium">Update your name and email address</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-emerald-800 font-semibold flex items-center gap-2">
                                        <User className="h-4 w-4 text-emerald-600" />
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        className={`border-2 transition-all duration-300 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-emerald-200 hover:border-emerald-300'}`}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-emerald-800 font-semibold flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-emerald-600" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className={`border-2 transition-all duration-300 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl ${errors.email ? 'border-red-400 focus:border-red-400' : 'border-emerald-200 hover:border-emerald-300'}`}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                                <div>
                                                    <p className="text-amber-800 font-medium">
                                                        Your email address is unverified.{' '}
                                                        <Link
                                                            href={route('verification.send')}
                                                            method="post"
                                                            as="button"
                                                            className="text-amber-700 underline decoration-amber-300 underline-offset-4 transition-colors duration-300 hover:decoration-amber-600 font-semibold"
                                                        >
                                                            Click here to resend the verification email.
                                                        </Link>
                                                    </p>
                                                    {status === 'verification-link-sent' && (
                                                        <div className="mt-2 text-sm font-medium text-green-600 flex items-center gap-2">
                                                            <CheckCircle className="h-4 w-4" />
                                                            A new verification link has been sent to your email address.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="flex items-center gap-4 pt-4">
                                    <Button 
                                        disabled={processing}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out duration-300"
                                        enterFrom="opacity-0 scale-90"
                                        leave="transition ease-in-out duration-300"
                                        leaveTo="opacity-0 scale-90"
                                    >
                                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 font-medium">
                                            <CheckCircle className="h-4 w-4" />
                                            Changes saved successfully!
                                        </div>
                                    </Transition>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
