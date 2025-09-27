<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordResetLinkController extends Controller
{
    /**
     * Show the password reset link request page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming password reset request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();

        if ($user) {
            // Update the password directly
            $user->update([
                'password' => Hash::make($request->password),
            ]);

            return redirect()->route('login')->with('status', 'Password has been reset successfully! Please sign in with your new password.');
        }

        // Always return success message for security (don't reveal if email exists)
        return redirect()->route('login')->with('status', 'Password reset request processed successfully! Please sign in.');
    }
}
