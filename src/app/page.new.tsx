'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ClipboardList,
  Cpu,
  Headset,
  HelpCircle,
  Loader2,
  User,
  Mail,
  MonitorCheck,
  Package,
  Send,
  ShieldCheck,
  Tag,
  Timer,
  AlignLeft,
  Wifi,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { value: 'hardware', label: 'Materiel', icon: Package, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', activeBg: 'bg-orange-500' },
  { value: 'software', label: 'Logiciel', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', activeBg: 'bg-blue-500' },
  { value: 'network', label: 'Reseau', icon: Wifi, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', activeBg: 'bg-emerald-500' },
  { value: 'user', label: 'Compte / Acces', icon: User, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200', activeBg: 'bg-purple-500' },
  { value: 'other', label: 'Autre', icon: HelpCircle, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-200', activeBg: 'bg-slate-500' },
];

const PRIORITIES = [
  { value: 'low', label: 'Faible', description: 'Gene mineure, pas urgent', color: 'border-blue-300 bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  { value: 'medium', label: 'Moyen', description: 'Impact modere sur le travail', color: 'border-amber-300 bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  { value: 'high', label: 'Eleve', description: 'Bloque une partie du travail', color: 'border-orange-400 bg-orange-50 text-orange-700', dot: 'bg-orange-500' },
  { value: 'critical', label: 'Critique', description: 'Arret total de l\'activite', color: 'border-red-400 bg-red-50 text-red-700', dot: 'bg-red-500' },
];

const PROBLEM_TYPES = [
  'Impossible de se connecter au compte',
  'Mot de passe oublie / compte verrouille',
  'Erreur application (Outlook, Office, ERP, etc.)',
  'Ordinateur lent / bloque',
  'Probleme reseau / Internet / Wi-Fi',
  'Imprimante non disponible',
  'Demande d\'installation logicielle',
  'Demande d\'acces / droits',
  'Autre probleme',
];

const PROBLEM_TYPE_DEFAULTS: Record<string, { category: string; priority: string }> = {
  'Impossible de se connecter au compte':            { category: 'user',     priority: 'high' },
  'Mot de passe oublie / compte verrouille':         { category: 'user',     priority: 'high' },
  'Erreur application (Outlook, Office, ERP, etc.)': { category: 'software', priority: 'medium' },
  'Ordinateur lent / bloque':                        { category: 'hardware', priority: 'medium' },
  'Probleme reseau / Internet / Wi-Fi':              { category: 'network',  priority: 'high' },
  'Imprimante non disponible':                       { category: 'hardware', priority: 'low' },
  'Demande d\'installation logicielle':              { category: 'software', priority: 'low' },
  'Demande d\'acces / droits':                       { category: 'user',     priority: 'medium' },
  'Autre probleme':                                  { category: 'other',    priority: 'medium' },
};

interface FormData {
  name: string;
  email: string;
  title: string;
  description: string;
  category: string;
  priority: string;
}

export default function HomePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    title: '',
    description: '',
    category: 'software',
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, []);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const selectProblemType = (value: string) => {
    const defaults = PROBLEM_TYPE_DEFAULTS[value];
    setForm((prev) => ({
      ...prev,
      title: value,
      category: defaults?.category ?? prev.category,
      priority: defaults?.priority ?? prev.priority,
    }));
    if (error) setError('');
    setDropdownOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }
      router.push(`/success?id=${data.ticketId}`);
    } catch {
      setError('Impossible de contacter le serveur. Verifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const activeCat = CATEGORIES.find((c) => c.value === form.category);
  const activePri = PRIORITIES.find((p) => p.value === form.priority);

  return (
    <main className="min-h-screen bg-slate-100">
      {/* Top bar — same style as MasterMonitor */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shadow-md">
              <MonitorCheck className="text-white" size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">MasterMonitor</p>
              <h1 className="text-base font-bold text-white">Portail HelpDesk</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300">
            <ShieldCheck size={13} className="text-emerald-400" />
            Canal securise
          </div>
        </div>
      </div>

      {/* Blue accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400" />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Nouvelle demande de support</h2>
          <p className="mt-1 text-sm text-slate-500">
            Selectionnez le type de probleme — la categorie et la priorite sont attribuees automatiquement.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Info card */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Traitement</p>
              </div>
              <ul className="space-y-3 px-4 py-4 text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <ClipboardList size={13} className="text-blue-600" />
                  </div>
                  <span>Ticket cree dans MasterMonitor</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100">
                    <Headset size={13} className="text-purple-600" />
                  </div>
                  <span>Prise en charge par un technicien</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <Timer size={13} className="text-amber-600" />
                  </div>
                  <span>Suivi selon la priorite detectee</span>
                </li>
              </ul>
            </div>

            {/* Status preview */}
            {form.title && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 shadow-sm">
                <div className="flex items-center gap-2 border-b border-blue-100 px-4 py-3">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">Apercu</p>
                </div>
                <div className="space-y-2 px-4 py-4">
                  {activeCat && (
                    <div className="flex items-center gap-2">
                      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${activeCat.bg}`}>
                        <activeCat.icon size={13} className={activeCat.color} />
                      </div>
                      <span className="text-xs font-medium text-slate-700">Categorie : {activeCat.label}</span>
                    </div>
                  )}
                  {activePri && (
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${activePri.dot}`} />
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${activePri.color}`}>
                        {activePri.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tip */}
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
              <p className="mb-1 font-semibold">Conseil</p>
              Decrivez le contexte, le message d'erreur et les etapes deja testees pour une resolution plus rapide.
            </div>
          </aside>

          {/* Main form card */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Card header */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
              <div className="h-8 w-1 rounded-full bg-blue-600" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">Nouveau ticket</h3>
                <p className="text-xs text-slate-400">Les champs marques d'un * sont obligatoires.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
              {/* Demandeur */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    <User size={11} />
                    Demandeur
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Nom complet <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Ex : Jean Dupont"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Adresse email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="jean.dupont@entreprise.fr"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              {/* Incident */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                    <AlertCircle size={11} />
                    Incident
                  </span>
                </div>

                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Type du probleme <span className="text-red-500">*</span>
                  </label>
                  <input type="text" required value={form.title} onChange={() => {}} className="sr-only" tabIndex={-1} aria-hidden="true" />
                  <div ref={dropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setDropdownOpen((o) => !o)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm outline-none transition ${
                        dropdownOpen
                          ? 'border-blue-500 bg-white ring-2 ring-blue-100'
                          : 'border-slate-300 bg-white hover:border-blue-400'
                      }`}
                    >
                      <span className={form.title ? 'text-slate-900' : 'text-slate-400'}>
                        {form.title || 'Selectionnez un type de probleme'}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {dropdownOpen && (
                      <ul className="absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                        {PROBLEM_TYPES.map((problemType) => {
                          const selected = form.title === problemType;
                          return (
                            <li key={problemType}>
                              <button
                                type="button"
                                onClick={() => selectProblemType(problemType)}
                                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                                  selected
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-700 hover:bg-blue-50'
                                }`}
                              >
                                {problemType}
                                {selected && <Check size={14} className="ml-2 shrink-0" />}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  {/* Categorie */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Categorie <span className="text-red-500">*</span>
                    </label>
                    <p className="mb-2 text-xs text-slate-400">Attribuee automatiquement</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
                      {CATEGORIES.map(({ value, label, icon: Icon, color, bg, border, activeBg }) => (
                        <button
                          key={value}
                          type="button"
                          disabled
                          aria-disabled="true"
                          className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition ${
                            form.category === value
                              ? `${border} ${bg} ${color} shadow-sm ring-2 ring-offset-1`
                              : 'border-slate-200 bg-white text-slate-400 opacity-50'
                          }`}
                        >
                          <Icon size={18} className={form.category === value ? color : 'text-slate-300'} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priorite */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Priorite <span className="text-red-500">*</span>
                    </label>
                    <p className="mb-2 text-xs text-slate-400">Attribuee automatiquement</p>
                    <div className="grid grid-cols-2 gap-2">
                      {PRIORITIES.map(({ value, label, description, color, dot }) => (
                        <button
                          key={value}
                          type="button"
                          disabled
                          aria-disabled="true"
                          className={`flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left transition ${
                            form.priority === value
                              ? `${color} border-current shadow-sm ring-2 ring-offset-1`
                              : 'border-slate-200 bg-white text-slate-400 opacity-50'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 text-xs font-semibold">
                            {form.priority === value && <span className={`h-2 w-2 rounded-full ${dot}`} />}
                            {label}
                          </span>
                          <span className="text-xs leading-tight opacity-75">{description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    <AlignLeft size={11} />
                    Description
                  </span>
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Decrivez le probleme : contexte, message d'erreur, actions deja testees, impact utilisateur."
                  required
                  rows={6}
                  maxLength={2000}
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1 text-right text-xs text-slate-400">{form.description.length}/2000</p>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              {/* Footer */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">Votre demande sera visible immediatement dans MasterMonitor.</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Soumettre le ticket
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
