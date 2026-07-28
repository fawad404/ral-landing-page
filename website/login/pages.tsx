'use client';
import React, { useState } from 'react';
import CustomSelect from '@/components/global/CustomSelect';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Logo } from '@/assets';
import { useLogin, useRegister } from '@/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = loginSchema.extend({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.enum(['facility', 'vendor']),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export default function LoginComponent() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const loginMutation = useLogin();
  const registerMutation = useRegister(() => {
    setMode('login');
    registerForm.reset();
  });

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema), defaultValues: { role: 'facility' } });

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-md mx-auto p-4">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image src={Logo} alt="RAL Connect" width={120} height={67} className="object-contain" />
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8">
          {/* Tab toggle */}
          <div className="flex bg-[#F1F5F9] rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white text-[#09488B] shadow-sm' : 'text-[#64748B]'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'register' ? 'bg-white text-[#09488B] shadow-sm' : 'text-[#64748B]'}`}
            >
              Create Account
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit((d) => loginMutation.mutate(d))} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[#0F172A]">Welcome back</h2>
              <p className="text-sm text-[#64748B] -mt-2">Sign in to your RAL Connect account.</p>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#475569]">Email address</label>
                <input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#09488B] transition-colors"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-xs text-red-500">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#475569]">Password</label>
                <input
                  {...loginForm.register('password')}
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#09488B] transition-colors"
                />
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-red-500">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#09488B] text-white py-3 rounded-xl font-semibold text-sm mt-2 hover:bg-[#073a70] transition-colors disabled:opacity-60"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit((d) => registerMutation.mutate(d))} className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-[#0F172A]">Create account</h2>
              <p className="text-sm text-[#64748B] -mt-2">Accounts require admin approval before access.</p>

              <div className="grid grid-cols-2 gap-3">

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#475569]">First name</label>
                  <input {...registerForm.register('firstName')} placeholder="John"
                    className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#09488B] transition-colors" />
                  {registerForm.formState.errors.firstName && <p className="text-xs text-red-500">{registerForm.formState.errors.firstName.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[#475569]">Last name</label>
                  <input {...registerForm.register('lastName')} placeholder="Doe"
                    className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#09488B] transition-colors" />
                  {registerForm.formState.errors.lastName && <p className="text-xs text-red-500">{registerForm.formState.errors.lastName.message}</p>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#475569]">Email address</label>
                <input {...registerForm.register('email')} type="email" placeholder="you@example.com"
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#09488B] transition-colors" />
                {registerForm.formState.errors.email && <p className="text-xs text-red-500">{registerForm.formState.errors.email.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#475569]">Account type</label>
                <CustomSelect
                  value={registerForm.watch('role') ?? 'facility'}
                  onChange={(v) => registerForm.setValue('role', v as 'facility' | 'vendor')}
                  options={[
                    { value: 'facility', label: 'Facility Member' },
                    { value: 'vendor', label: 'Vendor / Partner' },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#475569]">Password</label>
                <input {...registerForm.register('password')} type="password" placeholder="••••••••"
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#09488B] transition-colors" />
                {registerForm.formState.errors.password && <p className="text-xs text-red-500">{registerForm.formState.errors.password.message}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#475569]">Confirm password</label>
                <input {...registerForm.register('confirmPassword')} type="password" placeholder="••••••••"
                  className="border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#09488B] transition-colors" />
                {registerForm.formState.errors.confirmPassword && <p className="text-xs text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>}
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full bg-[#09488B] text-white py-3 rounded-xl font-semibold text-sm mt-2 hover:bg-[#073a70] transition-colors disabled:opacity-60">
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          © {new Date().getFullYear()} RAL Connect. All rights reserved.
        </p>
      </div>
    </div>
  );
}
