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
                <div className={`space-y-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Clean Profile Information Card */}
                    <Card className="border border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-teal-200/80">
                        <CardHeader className="bg-gradient-to-r from-slate-50/80 to-teal-50/60 border-b border-slate-100/80 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-teal-100/80 border border-teal-200/50">
                                    <User className="h-5 w-5 text-teal-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-slate-800 font-semibold text-xl">
                                        Profile Information
                                    </CardTitle>
                                    <CardDescription className="text-slate-600 font-medium">Update your name and email address</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-slate-700 font-medium flex items-center gap-2">
                                        <User className="h-4 w-4 text-slate-500" />
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        className={`border transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-lg ${errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300'}`}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-700 font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-slate-500" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className={`border transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-lg ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300'}`}
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-100">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <Card className="border-amber-200/60 bg-gradient-to-r from-amber-50/80 to-yellow-50/60">
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
                                                            className="text-amber-700 underline decoration-amber-300 underline-offset-4 transition-colors duration-200 hover:decoration-amber-600 font-semibold"
                                                        >
                                                            Click here to resend the verification email.
                                                        </Link>
                                                    </p>
                                                    {status === 'verification-link-sent' && (
                                                        <div className="mt-2 text-sm font-medium text-teal-600 flex items-center gap-2">
                                                            <CheckCircle className="h-4 w-4" />
                                                            A new verification link has been sent to your email address.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}

                                <div className="flex items-center gap-4 pt-2">
                                    <Button 
                                        disabled={processing}
                                        className="bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 px-6 py-2"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Saving...' : 'Save Changes'}
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
