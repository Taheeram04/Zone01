import { useState } from 'react';
import { Contours, DotMatrixLogo, OnboardingSteps } from '../components/dark-shell.jsx';
import { APPLICATION_URL } from '../constants.js';

/**
 * Register
 * Standalone dark-mode registration page for the 01Edu platform. Mirrors the
 * login page (/apply) layout: onboarding copy on the left, the sign-up form on
 * the right, over the abstract contour background.
 */
const Register = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#121212] font-mono text-white">
      <Contours />

      <div className="relative z-10 flex min-h-screen flex-col px-6 py-8 sm:px-8 lg:px-12">
        {/* Top-left numeric logo — dot-matrix LED style */}
        <DotMatrixLogo className="h-7 w-[2.75rem] text-white sm:h-8 sm:w-[3.15rem]" />

        {/* Centered main header */}
        <h1 className="mt-10 text-center text-3xl font-bold tracking-tight sm:mt-14 sm:text-4xl lg:text-5xl">
          Welcome to 01 !
        </h1>

        {/* Two-column body — stretched full width */}
        <div className="mt-14 grid w-full flex-1 grid-cols-1 content-start gap-14 md:mt-20 md:grid-cols-2 md:gap-10 lg:gap-16">
          {/* Left column — onboarding info */}
          <div className="text-base leading-relaxed text-neutral-400 sm:text-lg">
            <p>01Edu Platform is our collaborative coding education platform.</p>

            <p className="mt-6">New here? Here&apos;s what you need to do:</p>

            <OnboardingSteps />

            <p className="mt-8">
              That&apos;s it! If you&apos;ve already created an account, sign in to
              complete your application or check for updates.
            </p>

            <p className="mt-10">
              Want to know more about us?{' '}
              <a
                href="#"
                className="text-white underline underline-offset-4 transition-colors hover:text-violet-400"
              >
                contact us
              </a>
            </p>
          </div>

          {/* Right column — registration form */}
          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <h2 className="mb-10 text-xl font-semibold text-violet-400 sm:text-2xl">
              Create an account and get started on the online games
            </h2>

            <div className="mb-8">
              <label
                htmlFor="email"
                className="mb-2 block text-xs uppercase tracking-[0.2em] text-neutral-500"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-0 border-b border-neutral-600 bg-transparent pb-3 text-base text-white placeholder:text-neutral-500 focus:border-violet-400 focus:outline-none focus:ring-0"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet-500 py-4 font-mono text-base font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-violet-400"
            >
              Register
            </button>

            <p className="mt-4 text-right text-sm text-white">
              Already have an account?{' '}
              <a
                href={APPLICATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 underline underline-offset-4 transition-colors hover:text-violet-300"
              >
                LOGIN HERE!
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
