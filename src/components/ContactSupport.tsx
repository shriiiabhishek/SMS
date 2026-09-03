import React, { useState } from 'react';
import { 
  Mail, Send, CheckCircle2, User, MessageSquare, 
  HelpCircle, Code2, Sparkles, Inbox, Clock, ShieldCheck 
} from 'lucide-react';
import { DBService } from '../services/storage';
import { SessionUser, SupportMessage } from '../types';

interface ContactSupportProps {
  session: SessionUser | null;
}

export const ContactSupport: React.FC<ContactSupportProps> = ({ session }) => {
  const [name, setName] = useState(session?.full_name || '');
  const [email, setEmail] = useState(session?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [messagesList, setMessagesList] = useState<SupportMessage[]>(DBService.getSupportMessages());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all fields before sending.');
      return;
    }

    const res = DBService.addSupportMessage({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    if (res.success) {
      setIsSuccess(true);
      setSubject('');
      setMessage('');
      setMessagesList(DBService.getSupportMessages());
      setTimeout(() => {
        setIsSuccess(false);
      }, 6000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 my-6 px-4">
      {/* Visual ASCII Box Card specified in Requirement 30 */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Support Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            CONTACT & SUPPORT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            B.Tech CSE Project System Engineering & Developer Escalations
          </p>
        </div>

        {/* ASCII Frame Display */}
        <div className="max-w-md mx-auto bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm text-indigo-300 space-y-2 shadow-inner">
          <pre className="text-center text-indigo-400 leading-none overflow-x-auto text-[11px] sm:text-xs">
{`╔══════════════════════════════════════╗
║          CONTACT & SUPPORT           ║
╠══════════════════════════════════════╣
║  👨‍💻 Developer                       ║
║  Name: Abhishek Shrivastava          ║
║  📧 Email:                           ║
║  shrivastavaabhishek66772o@gmail.com ║
╚══════════════════════════════════════╝`}
          </pre>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Project: <strong>Student Management System</strong></span>
            <span>Batch: <strong>B.Tech CSE</strong></span>
          </div>
        </div>
      </div>

      {/* Support Submission Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" />
            <span>Submit a Technical Support Ticket</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Have questions regarding attendance calculations, database records, or system configuration? Submit a message below.
          </p>
        </div>

        {isSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-2xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Support request submitted successfully ✅</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="shrivastavaabhishek66772o@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Discrepancy in DBMS Attendance record / Password reset"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Message Description *</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Describe your issue or query in detail..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              id="send-support-btn"
              type="submit"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-indigo-200 transition-all cursor-pointer text-xs"
            >
              <Send className="w-4 h-4" />
              <span>[ SEND MESSAGE ]</span>
            </button>
          </div>
        </form>
      </div>

      {/* Admin View of Support Requests (Requirement 30: "Admin can view support requests") */}
      {session?.role === 'admin' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-indigo-600" />
              <span>Admin Support Inbox ({messagesList.length} Messages)</span>
            </h3>
            <span className="text-xs text-slate-400">Recorded in Database</span>
          </div>

          <div className="divide-y divide-slate-100 space-y-3">
            {messagesList.length === 0 ? (
              <p className="text-xs text-slate-400 py-4">No support tickets currently received.</p>
            ) : (
              messagesList.map(msg => (
                <div key={msg.id} className="pt-3 first:pt-0 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{msg.name} ({msg.email})</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {msg.created_at}
                    </span>
                  </div>
                  <div className="font-semibold text-indigo-700">{msg.subject}</div>
                  <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {msg.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
