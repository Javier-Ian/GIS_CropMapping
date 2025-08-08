import React from 'react';

interface GoogleSheetsIconProps {
    className?: string;
}

export const GoogleSheetsIcon: React.FC<GoogleSheetsIconProps> = ({ className = "h-5 w-5" }) => {
    return (
        <svg 
            className={className}
            viewBox="0 0 24 24" 
            fill="currentColor"
        >
            <path d="M19,3H5C3.9,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19Z" />
            <path d="M12,6H7V9H12V6M17,10H7V13H17V10M17,14H7V17H17V14Z" />
        </svg>
    );
};

export default GoogleSheetsIcon;
