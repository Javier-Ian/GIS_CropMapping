import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { notify } from '@/lib/notifications';

interface Flash {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

interface PageProps {
    flash?: Flash;
    [key: string]: any;
}

export function useFlashNotifications() {
    const { props } = usePage<PageProps>();
    
    useEffect(() => {
        if (props.flash) {
            if (props.flash.success) {
                // Check if it's a map upload success message
                if (props.flash.success.includes('uploaded successfully')) {
                    notify.mapUploadSuccess('Your Map');
                } else {
                    notify.success('🎉 Success!', props.flash.success);
                }
            }
            
            if (props.flash.error) {
                notify.error('❌ Error!', props.flash.error);
            }
            
            if (props.flash.warning) {
                notify.warning('⚠️ Warning!', props.flash.warning);
            }
            
            if (props.flash.info) {
                notify.info('ℹ️ Information', props.flash.info);
            }
        }
    }, [props.flash]);
}
