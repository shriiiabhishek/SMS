import React, { useState } from 'react';
import { 
  GraduationCap, Lock, User as UserIcon, AlertCircle, 
  ArrowRight, ShieldCheck, CheckCircle2, Key, Eye, EyeOff, Sparkles 
} from 'lucide-react';
import { DBService } from '../services/storage';
import { SessionUser, UserRole } from '../types';

interface LoginPageProps {
  navigate: (path: string) => void;
  onLoginSuccess: (session: SessionUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<UserRole>('student');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password) {
      setErrorMessage('Please enter both username/email and password.');
      return;
    }

    setLoading(true);

    // Simulate backend verification
    setTimeout(() => {
      const auth = DBService.authenticate(identifier.trim(), password, role);
      setLoading(false);

      if (!auth.success || !auth.user) {
        setErrorMessage(auth.message);
        return;
      }

      const session: SessionUser = {
        user_id: auth.user.user_id,
        username: auth.user.username,
        full_name: auth.user.full_name,
        role: auth.user.role,
        logged_in: true,
        email: auth.user.email,
        student_id: auth.student_id,
        teacher_id: auth.teacher_id,
      };

      onLoginSuccess(session);

      // Route immediately according to role
      if (session.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (session.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }, 200);
  };

  // Quick fill helper for testing
  const quickFill = (user: string, pass: string, r: UserRole) => {
    setIdentifier(user);
    setPassword(pass);
    setRole(r);
    setErrorMessage('');
  };

  // Instant login and redirect to dashboard
  const instantLogin = (user: string, pass: string, r: UserRole) => {
    quickFill(user, pass, r);
    setLoading(true);
    setTimeout(() => {
      const auth = DBService.authenticate(user, pass, r);
      setLoading(false);

      if (!auth.success || !auth.user) {
        setErrorMessage(auth.message);
        return;
      }

      const session: SessionUser = {
        user_id: auth.user.user_id,
        username: auth.user.username,
        full_name: auth.user.full_name,
        role: auth.user.role,
        logged_in: true,
        email: auth.user.email,
        student_id: auth.student_id,
        teacher_id: auth.teacher_id,
      };

      onLoginSuccess(session);

      if (session.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (session.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    }, 150);
  };

  return (
    <div className="max-w-md mx-auto my-8 sm:my-10 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-200/50">
        {/* Header with refined typography */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 text-white flex items-center justify-center mx-auto mb-3.5 shadow-lg shadow-indigo-200/80">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold tracking-wider uppercase mb-2 font-display">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>Academic Portal Sign-In</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Portal Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 font-form-text">
            Enter your credentials to access your academic dashboard
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span className="font-form-text">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role selector interactive tabs */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-display">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70">
              <button
                type="button"
                id="role-tab-student"
                onClick={() => setRole('student')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-display ${
                  role === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Student</span>
              </button>
              <button
                type="button"
                id="role-tab-teacher"
                onClick={() => setRole('teacher')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-display ${
                  role === 'teacher'
                    ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>Teacher</span>
              </button>
              <button
                type="button"
                id="role-tab-admin"
                onClick={() => setRole('admin')}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-display ${
                  role === 'admin'
                    ? 'bg-white text-indigo-700 shadow-xs border border-indigo-100'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Username / Email */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-display">
              Username or Email
            </label>
            <div className="relative group">
              <UserIcon className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-identifier"
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="e.g. rahul101 or prof_sharma"
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300/90 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 placeholder:text-slate-400 font-form-text transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 shadow-2xs"
              />
            </div>
          </div>

          {/* Password with Eye toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 font-display">
                Password
              </label>
              <span className="text-[11px] text-slate-400 font-form-text">Case sensitive</span>
            </div>
            <div className="relative group">
              <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your account password"
                required
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-slate-300/90 bg-slate-50/50 hover:bg-white focus:bg-white text-slate-900 placeholder:text-slate-400 font-form-text transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-5 bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-extrabold text-sm tracking-wide rounded-xl shadow-md shadow-indigo-200/80 hover:shadow-indigo-300 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer font-display"
          >
            {loading ? (
              <span className="text-xs font-semibold flex items-center gap-2 font-form-text">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Authenticating credentials...
              </span>
            ) : (
              <>
                <span className="tracking-wider">SIGN IN TO PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo credentials info only - no redirect */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between font-display">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>Demo Credentials</span>
            </span>
            <span className="text-[10px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">Info only</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl border border-rose-200/80 bg-rose-50/70 text-rose-800 font-bold flex flex-col items-center gap-1 text-center font-display">
              <ShieldCheck className="w-4 h-4 text-rose-600" />
              <span className="font-extrabold text-[12px]">Admin</span>
              <span className="text-[9px] font-semibold text-rose-600 font-form-text">admin / admin123</span>
            </div>

            <div className="p-2.5 rounded-xl border border-amber-200/80 bg-amber-50/70 text-amber-800 font-bold flex flex-col items-center gap-1 text-center font-display">
              <UserIcon className="w-4 h-4 text-amber-600" />
              <span className="font-extrabold text-[12px]">Teacher</span>
              <span className="text-[9px] font-semibold text-amber-600 font-form-text">prof_sharma / teacher123</span>
            </div>

            <div className="p-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/70 text-emerald-800 font-bold flex flex-col items-center gap-1 text-center font-display">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-[12px]">Student</span>
              <span className="text-[9px] font-semibold text-emerald-600 font-form-text">rahul101 / student123</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 font-form-text">
          Don't have an enrolled account?{' '}
          <button
            id="login-register-link-btn"
            onClick={() => navigate('/register')}
            className="font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 font-display cursor-pointer transition-colors ml-1"
          >
            Create / Register Student
          </button>
        </div>
      </div>
    </div>
  );
};
