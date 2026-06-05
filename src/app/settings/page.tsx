import { PageHeader } from "@/components/layout/page-header";
import { Save, Globe, Smartphone, Shield, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure admin portal settings, integration keys, and client synchronization properties."
      />

      <div className="grid gap-6 md:grid-cols-4 animate-fade-in">
        {/* Left Side: Navigation Links for Settings sections */}
        <div className="space-y-1 md:col-span-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-800 text-left transition-colors">
            <Globe className="h-4 w-4 text-emerald-700" />
            <span>General Config</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 text-left transition-colors" disabled>
            <Smartphone className="h-4 w-4 text-slate-400" />
            <span>Mobile Sync API</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 text-left transition-colors" disabled>
            <Shield className="h-4 w-4 text-slate-400" />
            <span>Permissions</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 text-left transition-colors" disabled>
            <Key className="h-4 w-4 text-slate-400" />
            <span>API Keys</span>
          </button>
        </div>

        {/* Right Side: Settings Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm md:col-span-3">
          <h3 className="font-bold text-slate-800 mb-6">General System Configuration</h3>

          <div className="space-y-6">
            {/* Input 1 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Ecosystem App Name</label>
              <input
                type="text"
                defaultValue="Islamic Amal Tracker"
                className="w-full max-w-lg rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-1 focus:ring-emerald-700/20"
                disabled
              />
            </div>

            {/* Input 2 */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Sync Server URL</label>
              <input
                type="url"
                defaultValue="https://api.amaltracker.com/v1"
                className="w-full max-w-lg rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-2 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-1 focus:ring-emerald-700/20"
                disabled
              />
            </div>

            {/* Toggle */}
            <div className="flex items-center justify-between max-w-lg py-4 border-t border-b border-slate-100">
              <div>
                <span className="block text-sm font-semibold text-slate-700">Maintenance Mode</span>
                <span className="text-xs text-slate-400">Put the mobile app sync endpoint offline for updates.</span>
              </div>
              <div className="relative inline-flex items-center cursor-not-allowed">
                <div className="w-11 h-6 bg-slate-200 rounded-full transition-colors"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
            <button
              className="bg-[#022c22] text-white opacity-80 cursor-not-allowed font-semibold py-2 px-6 rounded-xl text-sm transition-all shadow-sm flex items-center gap-1.5"
              disabled
            >
              <Save className="h-4 w-4" /> Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
