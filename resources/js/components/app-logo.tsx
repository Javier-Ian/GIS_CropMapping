import AppLogoIcon from './app-logo-icon';
import { Globe } from 'lucide-react';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
                <Globe className="size-5 text-white animate-pulse" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">GIS Crop Land Mapping</span>
            </div>
        </>
    );
}
