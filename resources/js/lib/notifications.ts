import Swal from 'sweetalert2';

export interface NotificationOptions {
    title?: string;
    text?: string;
    icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
    showConfirmButton?: boolean;
    showCancelButton?: boolean;
    confirmButtonText?: string;
    cancelButtonText?: string;
    timer?: number;
    timerProgressBar?: boolean;
    position?: 'top' | 'top-start' | 'top-end' | 'center' | 'center-start' | 'center-end' | 'bottom' | 'bottom-start' | 'bottom-end';
    toast?: boolean;
    background?: string;
    backdrop?: string | boolean;
    showClass?: {
        popup?: string;
        backdrop?: string;
        icon?: string;
    };
    hideClass?: {
        popup?: string;
        backdrop?: string;
        icon?: string;
    };
    customClass?: {
        container?: string;
        popup?: string;
        title?: string;
        content?: string;
        confirmButton?: string;
        cancelButton?: string;
        timerProgressBar?: string;
    };
}

class NotificationService {
    private defaultOptions: NotificationOptions = {
        position: 'center',
        showConfirmButton: true,
        customClass: {
            popup: 'fade-in-animation',
            title: '',
            content: '',
            confirmButton: '',
            cancelButton: ''
        }
    };

    private mergeOptions(options: NotificationOptions): NotificationOptions {
        return {
            ...this.defaultOptions,
            ...options,
            customClass: {
                ...this.defaultOptions.customClass,
                ...options.customClass
            }
        };
    }

    success(title: string, text?: string, options?: NotificationOptions) {
        return Swal.fire(this.mergeOptions({
            title,
            text,
            icon: 'success',
            timer: 5000,
            timerProgressBar: true,
            customClass: {
                popup: 'success-notification ultra-bounce-animation',
                confirmButton: 'royal-blue-button',
                timerProgressBar: 'rainbow-progress'
            },
            showClass: {
                popup: 'ultra-bounce-animation'
            },
            hideClass: {
                popup: 'magnetic-slide-animation'
            },
            ...options
        }));
    }

    error(title: string, text?: string, options?: NotificationOptions) {
        return Swal.fire(this.mergeOptions({
            title,
            text,
            icon: 'error',
            timer: 6000,
            timerProgressBar: true,
            customClass: {
                popup: 'error-notification ultra-bounce-animation',
                confirmButton: 'royal-blue-button',
                timerProgressBar: 'rainbow-progress'
            },
            showClass: {
                popup: 'ultra-bounce-animation'
            },
            hideClass: {
                popup: 'magnetic-slide-animation'
            },
            ...options
        }));
    }

    warning(title: string, text?: string, options?: NotificationOptions) {
        return Swal.fire(this.mergeOptions({
            title,
            text,
            icon: 'warning',
            timer: 5500,
            timerProgressBar: true,
            customClass: {
                popup: 'warning-notification ultra-bounce-animation',
                confirmButton: 'warning-button',
                timerProgressBar: 'rainbow-progress'
            },
            showClass: {
                popup: 'ultra-bounce-animation'
            },
            hideClass: {
                popup: 'magnetic-slide-animation'
            },
            ...options
        }));
    }

    info(title: string, text?: string, options?: NotificationOptions) {
        return Swal.fire(this.mergeOptions({
            title,
            text,
            icon: 'info',
            timer: 5000,
            timerProgressBar: true,
            customClass: {
                popup: 'info-notification ultra-bounce-animation',
                confirmButton: 'royal-blue-button',
                timerProgressBar: 'rainbow-progress'
            },
            showClass: {
                popup: 'ultra-bounce-animation'
            },
            hideClass: {
                popup: 'magnetic-slide-animation'
            },
            ...options
        }));
    }

    toast(title: string, options?: NotificationOptions) {
        return Swal.fire(this.mergeOptions({
            title,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            customClass: {
                popup: 'toast-notification magnetic-slide-animation',
                timerProgressBar: 'rainbow-progress'
            },
            showClass: {
                popup: 'magnetic-slide-animation'
            },
            ...options
        }));
    }

    confirm(title: string, text?: string, options?: NotificationOptions) {
        return Swal.fire(this.mergeOptions({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Confirm',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'warning-notification ultra-bounce-animation',
                confirmButton: 'warning-button'
            },
            showClass: {
                popup: 'ultra-bounce-animation'
            },
            hideClass: {
                popup: 'magnetic-slide-animation'
            },
            ...options
        }));
    }

    permissionDenied(ownerName: string, action: string = 'edit') {
        return this.error(
            'Access Denied',
            `You cannot ${action} maps uploaded by ${ownerName}. Only the map owner can perform this action.`
        );
    }

    // Special themed notifications
    mapUploadSuccess(mapTitle: string) {
        return this.success(
            'Map Uploaded Successfully',
            `Your map "${mapTitle}" has been uploaded and is ready to explore.`
        );
    }

    mapDeleteConfirm(mapTitle: string) {
        return this.confirm(
            'Delete Map?',
            `Are you sure you want to delete "${mapTitle}"? This action cannot be undone.`,
            {
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                customClass: {
                    popup: 'error-notification ultra-bounce-animation',
                    confirmButton: 'danger-button'
                },
                showClass: {
                    popup: 'ultra-bounce-animation'
                },
                hideClass: {
                    popup: 'magnetic-slide-animation'
                }
            }
        );
    }

    welcomeToast(userName: string) {
        return this.toast(
            `Welcome back, ${userName}!`,
            {
                icon: 'success',
                position: 'top-end',
                timer: 5000
            }
        );
    }
}

export const notify = new NotificationService();
