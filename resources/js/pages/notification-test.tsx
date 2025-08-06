import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { notify } from '@/lib/notifications';
import { Head } from '@inertiajs/react';
import { Crown, Heart, Rocket, Sparkles, Star, Zap } from 'lucide-react';

export default function NotificationTest() {
    const handleTestSuccess = () => {
        notify.success('🎉 Ultra Success!', 'Your ultra-unique notification system is working perfectly with revolutionary design!');
    };

    const handleTestError = () => {
        notify.error('🚨 Premium Error', 'This is an ultra-premium error notification with cutting-edge visual effects!');
    };

    const handleTestWarning = () => {
        notify.warning('⚡ Advanced Warning', 'Warning notifications now feature rainbow borders and floating orb effects!');
    };

    const handleTestInfo = () => {
        notify.info('💎 Premium Info', 'Information notifications with 3D effects and gradient magic!');
    };

    const handleTestToast = () => {
        notify.toast('🌟 Ultra Toast Notification!');
    };

    const handleTestConfirm = () => {
        notify.confirm('👑 Premium Confirmation', 'Do you want to experience the most unique SweetAlert design ever created?');
    };

    const handleTestMapUpload = () => {
        notify.mapUploadSuccess('Ultra Mountain Explorer');
    };

    const handleTestMapDelete = () => {
        notify.mapDeleteConfirm('Premium Ocean Map');
    };

    const handleTestWelcome = () => {
        notify.welcomeToast('Premium User');
    };

    return (
        <>
            <Head title="Ultra-Unique Notification Test" />

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 p-8">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-12 text-center">
                        <div className="mb-4 flex items-center justify-center gap-3">
                            <Crown className="h-8 w-8 text-purple-600" />
                            <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-4xl font-bold text-transparent">
                                Ultra-Unique SweetAlert Test
                            </h1>
                            <Sparkles className="h-8 w-8 text-blue-600" />
                        </div>
                        <p className="mx-auto max-w-3xl text-xl text-gray-600">
                            Experience the most revolutionary notification system with rainbow borders, floating orbs, 3D effects, gradient text, and
                            premium animations!
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                                <Star className="mr-1 h-4 w-4" />
                                Revolutionary Design
                            </Badge>
                            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                <Zap className="mr-1 h-4 w-4" />
                                Ultra-Premium Effects
                            </Badge>
                            <Badge className="bg-gradient-to-r from-cyan-500 to-green-500 text-white">
                                <Rocket className="mr-1 h-4 w-4" />
                                Next-Gen Animations
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Basic Notifications */}
                        <Card className="border-gradient-to-r transform border-2 from-green-400 to-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-600">
                                    <Heart className="h-5 w-5" />
                                    Success Notification
                                </CardTitle>
                                <CardDescription>Ultra-premium success with emerald magic effects</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <button
                                    onClick={handleTestSuccess}
                                    className="w-full transform rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    🎉 Test Success
                                </button>
                            </CardContent>
                        </Card>

                        <Card className="border-gradient-to-r transform border-2 from-red-400 to-pink-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-red-600">
                                    <Zap className="h-5 w-5" />
                                    Error Notification
                                </CardTitle>
                                <CardDescription>Premium error with crimson glow and 3D effects</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <button
                                    onClick={handleTestError}
                                    className="w-full transform rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    🚨 Test Error
                                </button>
                            </CardContent>
                        </Card>

                        <Card className="border-gradient-to-r transform border-2 from-yellow-400 to-orange-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-yellow-600">
                                    <Sparkles className="h-5 w-5" />
                                    Warning Notification
                                </CardTitle>
                                <CardDescription>Advanced warning with golden aura and floating orbs</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <button
                                    onClick={handleTestWarning}
                                    className="w-full transform rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    ⚡ Test Warning
                                </button>
                            </CardContent>
                        </Card>

                        <Card className="border-gradient-to-r transform border-2 from-blue-400 to-purple-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-600">
                                    <Star className="h-5 w-5" />
                                    Info Notification
                                </CardTitle>
                                <CardDescription>Information with azure brilliance and gradient magic</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <button
                                    onClick={handleTestInfo}
                                    className="w-full transform rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    💎 Test Info
                                </button>
                            </CardContent>
                        </Card>

                        <Card className="border-gradient-to-r transform border-2 from-purple-400 to-pink-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-purple-600">
                                    <Rocket className="h-5 w-5" />
                                    Toast Notification
                                </CardTitle>
                                <CardDescription>Slide-in toast with magnetic animations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <button
                                    onClick={handleTestToast}
                                    className="w-full transform rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    🌟 Test Toast
                                </button>
                            </CardContent>
                        </Card>

                        <Card className="border-gradient-to-r transform border-2 from-cyan-400 to-blue-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-cyan-600">
                                    <Crown className="h-5 w-5" />
                                    Confirm Dialog
                                </CardTitle>
                                <CardDescription>Premium confirmation with ultra-bounce effects</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <button
                                    onClick={handleTestConfirm}
                                    className="w-full transform rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    👑 Test Confirm
                                </button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Specialized Notifications */}
                    <div className="mt-12">
                        <h2 className="mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-center text-2xl font-bold text-transparent">
                            Specialized Map Notifications
                        </h2>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Card className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-green-600">Map Upload Success</CardTitle>
                                    <CardDescription>Ultra-premium map upload notification</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <button
                                        onClick={handleTestMapUpload}
                                        className="w-full transform rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                    >
                                        🗺️ Test Map Upload
                                    </button>
                                </CardContent>
                            </Card>

                            <Card className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-red-600">Map Delete Confirm</CardTitle>
                                    <CardDescription>Revolutionary delete confirmation</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <button
                                        onClick={handleTestMapDelete}
                                        className="w-full transform rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                    >
                                        🗑️ Test Map Delete
                                    </button>
                                </CardContent>
                            </Card>

                            <Card className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                <CardHeader>
                                    <CardTitle className="text-blue-600">Welcome Toast</CardTitle>
                                    <CardDescription>Premium welcome notification</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <button
                                        onClick={handleTestWelcome}
                                        className="w-full transform rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                                    >
                                        👋 Test Welcome
                                    </button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <div className="rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 p-8">
                            <h3 className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-2xl font-bold text-transparent">
                                ✨ Ultra-Unique Features ✨
                            </h3>
                            <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-4">
                                <div className="rounded-lg bg-white p-4 shadow-md">
                                    <strong className="text-purple-600">🌈 Rainbow Borders</strong>
                                    <p>Animated gradient borders that shift through all colors</p>
                                </div>
                                <div className="rounded-lg bg-white p-4 shadow-md">
                                    <strong className="text-blue-600">🔮 Floating Orbs</strong>
                                    <p>Background particle effects with smooth animations</p>
                                </div>
                                <div className="rounded-lg bg-white p-4 shadow-md">
                                    <strong className="text-green-600">🎭 3D Effects</strong>
                                    <p>Icons with depth, glow, and transform animations</p>
                                </div>
                                <div className="rounded-lg bg-white p-4 shadow-md">
                                    <strong className="text-orange-600">✨ Premium Animations</strong>
                                    <p>Ultra-bounce, magnetic slide, and shimmer effects</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
