import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Contours, DotMatrixLogo, OnboardingSteps } from '../components/dark-shell.jsx';

const Apply = () => {
  const [showPassword, setShowPassword] = useState(false);

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

          {/* Right column — login form */}
          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <h2 className="mb-10 text-xl font-semibold text-violet-400 sm:text-2xl">
              Log in to resume your works
            </h2>

            <div className="mb-8">
              <input
                type="text"
                name="identifier"
                autoComplete="username"
                placeholder="Email or username"
                className="w-full border-0 border-b border-neutral-600 bg-transparent pb-3 text-base text-white placeholder:text-neutral-500 focus:border-violet-400 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="mb-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  className="w-full border-0 border-b border-neutral-600 bg-transparent pb-3 pr-8 text-base text-white placeholder:text-neutral-500 focus:border-violet-400 focus:outline-none focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-0 top-0 text-white/80 transition-colors hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                  ) : (
                    <Eye className="h-4 w-4" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-10 text-right text-sm text-neutral-500">
              Forgot password?{' '}
              <a
                href="#"
                className="underline underline-offset-4 transition-colors hover:text-neutral-300"
              >
                Click here!
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-violet-500 py-4 font-mono text-base tracking-[0.15em] text-white transition-colors hover:bg-violet-400"
            >
              LOGIN
            </button>

            <p className="mt-4 text-right text-sm text-white">
              New here? Join the fun!{' '}
              <Link
                to="/register"
                className="text-violet-400 underline underline-offset-4 transition-colors hover:text-violet-300"
              >
                REGISTER NOW!
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Apply;
