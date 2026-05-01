'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  AlignLeft,
  Check,
  ChevronDown,
  ClipboardList,
  Cpu,
  Headset,
  HelpCircle,
  Loader2,
  Mail,
  MonitorCheck,
  Package,
  Send,
  ShieldCheck,
  Tag,
  Timer,
  User,
  Wifi,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { value: 'hardware', label: 'Materiel', icon: Package, color: 'text-orange-500' },
  { value: 'software', label: 'Logiciel', icon: Cpu, color: 'text-blue-500' },
  { value: 'network', label: 'Reseau', icon: Wifi, color: 'text-green-500' },
  { value: 'user', label: 'Compte / Acces', icon: User, color: 'text-purple-500' },
  { value: 'other', label: 'Autre', icon: HelpCircle, color: 'text-gray-500' },
] as const;

const PRIORITIES = [
  { value: 'low', label: 'Faible', description: 'Gene mineure, pas urgent', color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { value: 'medium', label: 'Moyen', description: 'Impact modere sur le travail', color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
  { value: 'high', label: 'Eleve', description: 'Bloque une partie du travail', color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'critical', label: 'Critique', description: 'Arret total de l activite', color: 'border-red-400 bg-red-50 text-red-700' },
] as const;

const PROBLEM_TYPES = [
  'Impossible de se connecter au compte',
  'Mot de passe oublie / compte verrouille',
  'Erreur application (Outlook, Office, ERP, etc.)',
  'Ordinateur lent / bloque',
  'Probleme reseau / Internet / Wi-Fi',
  'Imprimante non disponible',
  'Demande d installation logicielle',
  'Demande d acces / droits',
  'Autre probleme',
] as const;

const PROBLEM_TYPE_DEFAULTS: Record<string, { category: string; priority: string }> = {
  'Impossible de se connecter au compte': { category: 'user', priority: 'high' },
  'Mot de passe oublie / compte verrouille': { category: 'user', priority: 'high' },
  'Erreur application (Outlook, Office, ERP, etc.)': { category: 'software', priority: 'medium' },
  'Ordinateur lent / bloque': { category: 'hardware', priority: 'medium' },
  'Probleme reseau / Internet / Wi-Fi': { category: 'network', priority: 'high' },
  'Imprimante non disponible': { category: 'hardware', priority: 'low' },
  'Demande d installation logicielle': { category: 'software', priority: 'low' },
  'Demande d acces / droits': { category: 'user', priority: 'medium' },
  'Autre probleme': { category: 'other', priority: 'medium' },
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
    const onMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
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

      router.push('/success?id=' + data.ticketId);
    } catch {
      setError('Impossible de contacter le serveur. Verifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-slate-900 p-2.5 shadow-sm">
                <MonitorCheck className="text-white" size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Portail HelpDesk</p>
                <h1 className="text-xl font-semibold text-slate-900">Creation de ticket de support</h1>
              </div>
            </div>
            <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 sm:flex">
              <ShieldCheck size={14} className="text-emerald-600" />
              Canal securise
            </div>
          </div>
          <div className="px-6 py-4 text-sm text-slate-600">
            Declarez votre incident en quelques etapes. Le type de probleme pilote automatiquement la categorie et la priorite.
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">Traitement</h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <ClipboardList size={16} className="mt-0.5 text-slate-500" />
                <span>Ticket cree et enregistre dans MasterMonitor</span>
              </li>
              <li className="flex items-start gap-2">
                <Headset size={16} className="mt-0.5 text-slate-500" />
                <span>Prise en charge par un technicien support</span>
              </li>
              <li className="flex items-start gap-2">
                <Timer size={16} className="mt-0.5 text-slate-500" />
                <span>Suivi selon la priorite detectee</span>
              </li>
            </ul>
          </aside>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="text-base font-semibold text-slate-900">Nouveau ticket</h2>
              <p className="mt-1 text-sm text-slate-500">Les champs marques d un asterisque sont obligatoires.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 px-6 py-6">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Demandeur</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <User size={14} className="text-slate-400" />
                        Nom complet <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Ex : Jean Dupont"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-slate-400" />
                        Adresse email <span className="text-red-500">*</span>
                      </span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="jean.dupont@entreprise.fr"
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Incident</p>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} className="text-slate-400" />
                    Type du probleme <span className="text-red-500">*</span>
                  </span>
                </label>

                <input type="text" required value={form.title} onChange={() => {}} className="sr-only" tabIndex={-1} aria-hidden="true" />
                <div ref={dropdownRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((open) => !open)}
                    className={`flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 text-sm outline-none transition ${
                      dropdownOpen ? 'border-slate-900 bg-white ring-2 ring-slate-200' : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}
                  >
                    <span className={form.title ? 'text-slate-900' : 'text-slate-400'}>
                      {form.title || 'Selectionnez un type de probleme'}
                    </span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <ul className="absolute z-20 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                      {PROBLEM_TYPES.map((problemType) => {
                        const selected = form.title === problemType;
                        return (
                          <li key={problemType}>
                            <button
                              type="button"
                              onClick={() => selectProblemType(problemType)}
                              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                                selected ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
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
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Categorie <span className="text-red-500">*</span></label>
                  <p className="mb-2 text-xs text-slate-400">Attribuee automatiquement</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
                    {CATEGORIES.map(({ value, label, icon: Icon, color }) => (
                      <button
                        key={value}
                        type="button"
                        disabled
                        aria-disabled="true"
                        className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium ${
                          form.category === value ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-white text-slate-500 opacity-60'
                        }`}
                      >
                        <Icon size={18} className={form.category === value ? 'text-white' : color} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Priorite <span className="text-red-500">*</span></label>
                  <p className="mb-2 text-xs text-slate-400">Attribuee automatiquement</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PRIORITIES.map(({ value, label, description, color }) => (
                      <button
                        key={value}
                        type="button"
                        disabled
                        aria-disabled="true"
                        className={`flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left ${
                          form.priority === value ? `${color} border-current shadow-sm` : 'border-slate-200 bg-white text-slate-500 opacity-60'
                        }`}
                      >
                        <span className="text-xs font-semibold">{label}</span>
                        <span className="text-xs leading-tight opacity-80">{description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <AlignLeft size={14} className="text-slate-400" />
                    Description detaillee <span className="text-red-500">*</span>
                  </span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Decrivez le probleme : contexte, message d erreur, actions deja testees, impact utilisateur."
                  required
                  rows={6}
                  maxLength={2000}
                  className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
                />
                <p className="mt-1 text-right text-xs text-slate-400">{form.description.length}/2000</p>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">Votre demande sera visible immediatement dans MasterMonitor.</p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
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
        </section>
      </div>
    </main>
  );
}
