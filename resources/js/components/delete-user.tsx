import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import HeadingSmall from '@/components/heading-small';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, AlertTriangle, Lock, Shield } from 'lucide-react';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm<Required<{ password: string }>>({ password: '' });

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        clearErrors();
        reset();
    };

    return (
        <Card className="border border-red-200/60 bg-white/95 backdrop-blur-sm shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-red-300/80">
            <CardHeader className="bg-gradient-to-r from-slate-50/80 to-red-50/60 border-b border-red-100/80 pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-red-100/80 border border-red-200/50">
                        <Shield className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                        <CardTitle className="text-slate-800 font-semibold text-xl flex items-center gap-2">
                            Account Security
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                        </CardTitle>
                        <CardDescription className="text-slate-600 font-medium">Permanently delete your account and all associated data</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4 rounded-lg border border-red-200/60 bg-red-50/40 p-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-100/80">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-red-800">Critical Warning</p>
                            <p className="text-red-700 font-medium text-sm leading-relaxed">
                                This action is irreversible and will permanently delete your account, all uploaded maps, GIS files, and associated data.
                            </p>
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 px-4 py-2">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border border-slate-200 bg-white shadow-xl rounded-xl">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-lg bg-red-100">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-slate-800 font-semibold text-lg">Confirm Account Deletion</DialogTitle>
                                        <DialogDescription className="text-slate-600 font-medium mt-1">
                                            This action cannot be undone and will permanently remove all your data.
                                        </DialogDescription>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-red-50/60 border border-red-200/60 rounded-lg">
                                    <p className="text-red-700 font-medium text-sm">
                                        Once your account is deleted, all of its resources and data will be permanently removed. 
                                        Please enter your password to confirm you want to permanently delete your account.
                                    </p>
                                </div>

                                <form onSubmit={deleteUser} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-slate-700 font-medium flex items-center gap-2">
                                            <Lock className="h-4 w-4 text-slate-500" />
                                            Confirm Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            ref={passwordInput}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="border border-slate-200 focus:border-red-400 focus:ring-2 focus:ring-red-100 rounded-lg"
                                            placeholder="Enter your password to confirm"
                                        />
                                        <InputError message={errors.password} className="text-red-600" />
                                    </div>

                                    <DialogFooter className="gap-3">
                                        <DialogClose asChild>
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                onClick={closeModal}
                                                className="border border-slate-300 hover:bg-slate-100 rounded-lg px-4"
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 px-4"
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            {processing ? 'Deleting...' : 'Delete Account'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>
        </Card>
    );
}
