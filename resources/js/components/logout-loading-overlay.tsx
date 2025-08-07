import { useLogoutLoading } from '@/hooks/use-logout-loading';
import { LogOut, MapPin, Satellite, Shield, Database, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LogoutLoadingOverlay() {
    const { isLoggingOut } = useLogoutLoading();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    const logoutSteps = [
        { icon: Shield, text: "Securing your session...", color: "text-amber-400" },
        { icon: Database, text: "Saving your progress...", color: "text-blue-400" },
        { icon: Lock, text: "Encrypting data...", color: "text-purple-400" },
        { icon: MapPin, text: "Clearing map cache...", color: "text-green-400" },
        { icon: Satellite, text: "Disconnecting GIS services...", color: "text-cyan-400" },
        { icon: LogOut, text: "Signing you out...", color: "text-red-400" }
    ];

    useEffect(() => {
        if (isLoggingOut) {
            setLoadingProgress(0);
            setCurrentStep(0);
            
            // Simulate logout progress with realistic steps
            const progressSteps = [
                { progress: 15, step: 0, delay: 200 },
                { progress: 30, step: 1, delay: 600 },
                { progress: 45, step: 2, delay: 1000 },
                { progress: 65, step: 3, delay: 1400 },
                { progress: 85, step: 4, delay: 1800 },
                { progress: 100, step: 5, delay: 2200 }
            ];

            progressSteps.forEach(({ progress, step, delay }) => {
                setTimeout(() => {
                    setLoadingProgress(progress);
                    setCurrentStep(step);
                }, delay);
            });
        } else {
            setLoadingProgress(0);
            setCurrentStep(0);
        }
    }, [isLoggingOut]);

    if (!isLoggingOut) return null;

    const CurrentIcon = logoutSteps[currentStep]?.icon || LogOut;
    const currentColor = logoutSteps[currentStep]?.color || "text-red-400";
    const currentText = logoutSteps[currentStep]?.text || "Signing you out...";

    return (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-red-900/95 via-orange-900/95 to-amber-900/95 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center space-y-8 p-8">
                {/* Main Logout Icon Animation */}
                <div className="relative">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl animate-pulse">
                                <LogOut className="w-10 h-10 text-white animate-bounce" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 rounded-full animate-ping"></div>
                        </div>
                    </div>
                    
                    {/* Rotating Security Icons */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 relative">
                            {logoutSteps.map((step, index) => {
                                const angle = (index * 60) - 90; // 6 icons, 60 degrees apart
                                const radius = 70;
                                const x = Math.cos(angle * Math.PI / 180) * radius;
                                const y = Math.sin(angle * Math.PI / 180) * radius;
                                const Icon = step.icon;
                                
                                return (
                                    <div
                                        key={index}
                                        className={`absolute w-8 h-8 flex items-center justify-center rounded-full transition-all duration-500 ${
                                            index === currentStep 
                                                ? 'bg-white/20 scale-125 animate-pulse' 
                                                : 'bg-white/10 scale-100'
                                        }`}
                                        style={{
                                            left: `calc(50% + ${x}px - 1rem)`,
                                            top: `calc(50% + ${y}px - 1rem)`,
                                            transform: `rotate(${index * 60 + (loadingProgress * 3.6)}deg)`
                                        }}
                                    >
                                        <Icon className={`w-4 h-4 ${index === currentStep ? step.color : 'text-white/60'}`} />
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Orbital ring */}
                        <div className="absolute w-40 h-40 border-2 border-white/20 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
                    </div>
                </div>

                {/* Current Step Display */}
                <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                        <CurrentIcon className={`w-6 h-6 ${currentColor} animate-pulse`} />
                        <h2 className="text-2xl font-bold text-white">
                            {currentText}
                        </h2>
                    </div>
                    <p className="text-red-200">Securely ending your GIS session</p>
                </div>

                {/* Progress Bar */}
                <div className="w-80 mx-auto space-y-3">
                    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-400 via-orange-400 to-amber-400 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                            <div className="absolute right-0 top-0 w-4 h-full bg-white/40 rounded-full blur-sm"></div>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm text-red-200">
                        <span>Logging out...</span>
                        <span>{loadingProgress}%</span>
                    </div>
                </div>

                {/* Security Steps Indicator */}
                <div className="flex justify-center space-x-3">
                    {logoutSteps.map((step, index) => (
                        <div
                            key={index}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                index <= currentStep 
                                    ? 'bg-amber-400 animate-pulse' 
                                    : 'bg-white/20'
                            }`}
                        />
                    ))}
                </div>

                {/* Final Message */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                    <p className="text-white/90 text-sm font-medium">
                        Thank you for using GIS Crop Land Mapping System
                    </p>
                    <p className="text-white/70 text-xs mt-1">
                        Your session has been secured and all data saved
                    </p>
                </div>
            </div>
        </div>
    );
}
