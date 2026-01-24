/**
 * Authentication API Routes
 * 
 * Handles OAuth callbacks, magic links, and session management
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  handleOAuthCallback,
  verifyMagicLink,
  createMagicLink,
  setSessionCookie,
  clearSessionCookie,
  getSessionFromCookie,
  getUserByEmail,
  signOut,
  type AuthProvider,
} from '@/lib/auth';
import { sendMagicLink, sendWelcomeEmail } from '@/lib/email';

export const runtime = 'nodejs';

// =============================================================================
// MAGIC LINK REQUEST
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const { action, email, provider, redirectTo } = await request.json();

    if (action === 'magic-link') {
      if (!email || typeof email !== 'string') {
        return NextResponse.json(
          { error: 'Email is required' },
          { status: 400 }
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }

      // Create magic link token
      const token = await createMagicLink(email);

      // Send email
      const result = await sendMagicLink(email, token);
      
      if (!result.success) {
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }

      // Check if this is a new user
      const existingUser = await getUserByEmail(email);

      return NextResponse.json({
        success: true,
        message: 'Magic link sent',
        isNewUser: !existingUser,
      });
    }

    if (action === 'oauth') {
      if (!provider) {
        return NextResponse.json(
          { error: 'Provider is required' },
          { status: 400 }
        );
      }

      const validProviders: AuthProvider[] = ['google', 'github', 'discord', 'twitter'];
      if (!validProviders.includes(provider)) {
        return NextResponse.json(
          { error: 'Invalid provider' },
          { status: 400 }
        );
      }

      // Generate OAuth URL
      const { getOAuthUrl } = await import('@/lib/auth');
      const authUrl = getOAuthUrl(provider, redirectTo || '/');

      return NextResponse.json({ authUrl });
    }

    if (action === 'signout') {
      await signOut();
      
      const response = NextResponse.json({ success: true });
      return response;
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET SESSION
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromCookie();

    if (!session) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        role: session.user.role,
        provider: session.user.provider,
        emailVerified: session.user.emailVerified,
        settings: session.user.settings,
      },
      session: {
        id: session.id,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ authenticated: false });
  }
}
