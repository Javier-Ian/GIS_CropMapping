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
        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-red-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-red-200/30">
            <CardHeader className="bg-gradient-to-r from-red-100/50 to-rose-100/50 border-b border-red-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-100">
                        <Shield className="h-6 w-6 text-red-700" />
                    </div>
                    <div>
                        <CardTitle className="text-red-800 font-bold text-xl flex items-center gap-2">
                            Account Security
                            <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
                        </CardTitle>
                        <CardDescription className="text-red-600 font-medium">Permanently delete your account and all associated data</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4 rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50/50 to-rose-50/50 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-xl bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-700" />
                        </div>
                        <div className="space-y-2">
                            <p className="font-bold text-red-800 text-lg">⚠️ Critical Warning</p>
                            <p className="text-red-700 font-medium leading-relaxed">
                                This action is irreversible and will permanently delete your account, all uploaded maps, GIS files, and associated data. 
                                Please proceed with extreme caution.
                            </p>
                        </div>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-3">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="border-0 bg-white/95 backdrop-blur-lg shadow-2xl rounded-2xl">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 rounded-xl bg-red-100">
                                        <AlertTriangle className="h-8 w-8 text-red-700" />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-red-800 font-bold text-xl">⚠️ Confirm Account Deletion</DialogTitle>
                                        <DialogDescription className="text-red-600 font-medium mt-2">
                                            This action cannot be undone and will permanently remove all your data.
                                        </DialogDescription>
                                    </div>
                                </div>
                                
                                <div className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl">
                                    <p className="text-red-700 font-medium">
                                        Once your account is deleted, all of its resources and data will be permanently removed. 
                                        Please enter your password to confirm you want to permanently delete your account.
                                    </p>
                                </div>

                                <form onSubmit={deleteUser} className="space-y-4">
                                    <div className="space-y-3">
                                        <Label htmlFor="password" className="text-red-800 font-semibold flex items-center gap-2">
                                            <Lock className="h-4 w-4 text-red-600" />
                                            Confirm Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            ref={passwordInput}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="border-2 border-red-200 focus:border-red-400 focus:ring-red-200 rounded-xl"
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
                                                className="border-2 border-gray-300 hover:bg-gray-100 rounded-xl px-6"
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button 
                                            type="submit" 
                                            disabled={processing}
                                            className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6"
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
