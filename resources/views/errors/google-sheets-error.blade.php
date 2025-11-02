<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Sheets Error</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
            <!-- Header -->
            <div class="bg-gradient-to-r from-red-500 to-red-600 px-8 py-6">
                <div class="flex items-center gap-4">
                    <div class="bg-white/20 p-3 rounded-full">
                        <i class="fas fa-table text-white text-2xl"></i>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold text-white">Google Sheets Access Error</h1>
                        <p class="text-red-100">Unable to connect to Google Sheets</p>
                    </div>
                </div>
            </div>

            <!-- Content -->
            <div class="px-8 py-6">
                <!-- Error Icon -->
                <div class="flex justify-center mb-6">
                    <div class="bg-red-50 p-6 rounded-full">
                        <i class="fas fa-exclamation-triangle text-red-500 text-5xl"></i>
                    </div>
                </div>

                <!-- Error Message -->
                <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6">
                    <div class="flex items-start gap-3">
                        <i class="fas fa-info-circle text-red-500 mt-1"></i>
                        <div>
                            <h3 class="font-semibold text-red-800 mb-1">Error Details</h3>
                            <p class="text-red-700 text-sm">{{ $message }}</p>
                        </div>
                    </div>
                </div>

                @if(isset($barangay))
                <div class="bg-slate-50 p-4 rounded-lg mb-6">
                    <div class="flex items-center gap-2 text-slate-700">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="font-medium">Barangay:</span>
                        <span class="font-bold text-slate-900">{{ $barangay }}</span>
                    </div>
                </div>
                @endif

                <!-- Technical Details (only in debug mode) -->
                @if(isset($technical_details) && $technical_details)
                <details class="mb-6">
                    <summary class="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-900 mb-2">
                        <i class="fas fa-code mr-2"></i>Technical Details
                    </summary>
                    <div class="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs font-mono overflow-x-auto">
                        {{ $technical_details }}
                    </div>
                </details>
                @endif

                <!-- Troubleshooting Steps -->
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                    <h3 class="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <i class="fas fa-tools"></i>
                        Troubleshooting Steps
                    </h3>
                    <ol class="text-blue-700 text-sm space-y-2 ml-6 list-decimal">
                        <li>Verify that the Google Service Account credentials are valid</li>
                        <li>Check if the credentials.json file exists in the public directory</li>
                        <li>Ensure the service account has access to the Google Spreadsheet</li>
                        <li>Regenerate the service account key if credentials have expired</li>
                        <li>Contact your system administrator if the problem persists</li>
                    </ol>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <button 
                        onclick="window.close()" 
                        class="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center justify-center gap-2"
                    >
                        <i class="fas fa-times"></i>
                        Close Window
                    </button>
                    <button 
                        onclick="window.history.back()" 
                        class="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center justify-center gap-2"
                    >
                        <i class="fas fa-arrow-left"></i>
                        Go Back
                    </button>
                    <button 
                        onclick="location.reload()" 
                        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm flex items-center justify-center gap-2"
                    >
                        <i class="fas fa-redo"></i>
                        Try Again
                    </button>
                </div>
            </div>

            <!-- Footer -->
            <div class="bg-slate-50 px-8 py-4 text-center">
                <p class="text-sm text-slate-600">
                    <i class="fas fa-info-circle mr-1"></i>
                    For assistance, please contact your system administrator
                </p>
            </div>
        </div>
    </div>
</body>
</html>
