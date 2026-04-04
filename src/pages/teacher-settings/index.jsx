import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';

const STORAGE_KEY = 'codecampus_teacher_settings';

const defaultSettings = {
  defaultRubricMode: 'detailed',
  autoLatePenalty: true,
  latePenaltyPercent: 10,
  aiPolicy: 'limited',
  maxAiSuggestions: 20,
  pastePolicy: 'warn',
  tabSwitchLimit: 3,
  notifyNewSubmission: true,
  notifyHighRisk: true,
  notifyDailyDigest: false,
};

const TeacherSettings = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  const update = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const saveSettings = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <Helmet>
        <title>Teacher Settings - CodeCampus</title>
      </Helmet>

      <div className="min-h-screen bg-[#f7f8fa]">
        <Header />

        <main className="pt-16">
          <div className="max-w-[900px] mx-auto px-5 py-7 space-y-5">
            <div>
              <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">Teacher Settings</h1>
              <p className="text-[13px] text-slate-500 mt-0.5">Configure grading defaults, integrity policies, and notifications.</p>
            </div>

            {saved && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-[13px] text-emerald-700">
                Settings saved successfully.
              </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200/80 p-5 space-y-4">
              <h2 className="text-[15px] font-semibold text-slate-800">Grading Defaults</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1">Rubric Mode</label>
                  <select value={settings.defaultRubricMode} onChange={(e) => update('defaultRubricMode', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="detailed">Detailed</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1">Late Penalty (%)</label>
                  <input type="number" min={0} max={100} value={settings.latePenaltyPercent} onChange={(e) => update('latePenaltyPercent', parseInt(e.target.value || '0', 10))} className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-[13px] text-slate-700">
                <input type="checkbox" checked={settings.autoLatePenalty} onChange={(e) => update('autoLatePenalty', e.target.checked)} />
                Apply late penalty automatically
              </label>
            </div>

            <div className="bg-white rounded-lg border border-slate-200/80 p-5 space-y-4">
              <h2 className="text-[15px] font-semibold text-slate-800">Integrity Policy Defaults</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1">AI Policy</label>
                  <select value={settings.aiPolicy} onChange={(e) => update('aiPolicy', e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="enabled">Enabled</option>
                    <option value="limited">Limited</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1">Max AI Suggestions</label>
                  <input type="number" min={0} max={100} value={settings.maxAiSuggestions} onChange={(e) => update('maxAiSuggestions', parseInt(e.target.value || '0', 10))} className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-slate-600 mb-1">Tab Switch Limit</label>
                  <input type="number" min={1} max={10} value={settings.tabSwitchLimit} onChange={(e) => update('tabSwitchLimit', parseInt(e.target.value || '1', 10))} className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-slate-600 mb-1">Paste Policy</label>
                <select value={settings.pastePolicy} onChange={(e) => update('pastePolicy', e.target.value)} className="w-full md:w-[280px] border border-slate-300 rounded-md px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="allow">Allow</option>
                  <option value="warn">Warn</option>
                  <option value="block">Block</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200/80 p-5 space-y-4">
              <h2 className="text-[15px] font-semibold text-slate-800">Notifications</h2>
              <label className="flex items-center gap-2 text-[13px] text-slate-700"><input type="checkbox" checked={settings.notifyNewSubmission} onChange={(e) => update('notifyNewSubmission', e.target.checked)} /> Notify when a new submission arrives</label>
              <label className="flex items-center gap-2 text-[13px] text-slate-700"><input type="checkbox" checked={settings.notifyHighRisk} onChange={(e) => update('notifyHighRisk', e.target.checked)} /> Notify for high integrity risk submissions</label>
              <label className="flex items-center gap-2 text-[13px] text-slate-700"><input type="checkbox" checked={settings.notifyDailyDigest} onChange={(e) => update('notifyDailyDigest', e.target.checked)} /> Send daily digest summary</label>
            </div>

            <div className="flex justify-end">
              <button onClick={saveSettings} className="px-4 py-2 bg-blue-600 text-white text-[13px] font-medium rounded-md hover:bg-blue-700 transition-colors">
                Save Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default TeacherSettings;
