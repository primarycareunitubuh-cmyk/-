import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, X, Eye, EyeOff } from 'lucide-react';
import { STAFF_PASSWORD, setStaffAuthenticated } from '../utils/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === STAFF_PASSWORD) {
      setStaffAuthenticated(true);
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden">
        
        {/* Header with decorative background */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-teal-200 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            title="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-3 ring-1 ring-white/20">
            <ShieldCheck className="w-7 h-7 text-teal-300" />
          </div>
          
          <h2 className="text-xl font-bold font-['Prompt']">
            เข้าสู่ระบบเจ้าหน้าที่ (VOC Staff)
          </h2>
          <p className="text-xs text-teal-100/90 mt-1">
            แดชบอร์ดจัดการแบบสอบถาม ตรวจสอบคะแนนร้อยละ และเรียกดูรายงานสถิติย้อนหลัง
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              รหัสผ่านเจ้าหน้าที่ (Staff Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder="กรอกรหัสผ่านเจ้าหน้าที่..."
                autoFocus
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-medium transition focus:outline-none focus:ring-2 ${
                  error
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30 text-rose-900'
                    : 'border-slate-300 focus:ring-teal-500 focus:border-teal-500 bg-white'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            {error && (
              <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                รหัสผ่านไม่ถูกต้อง โปรดตรวจสอบรหัสผ่านอีกครั้ง
              </p>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>เฉพาะบุคลากรและเจ้าหน้าที่ที่ได้รับมอบหมายเท่านั้น</span>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/25 transition flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>เข้าสู่แดชบอร์ด</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
