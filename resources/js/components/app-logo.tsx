import AppLogoIcon from './app-logo-icon';
import { Globe } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm shadow-lg">
                <Globe className="size-5 text-white animate-pulse" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold text-white">GIS Crop Land Mapping</span>
            </div>
        </>
    );
}
