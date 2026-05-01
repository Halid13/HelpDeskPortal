'use client';

import { useState } from 'react';
import { useRef, useEffect } from 'react';
import {
  MonitorCheck,
  User,
  Mail,
  Tag,
  AlignLeft,
  ChevronDown,
  Check,
  Loader2,
  Send,
  AlertTriangle,
  Cpu,
  Wifi,
  Package,
  HelpCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { value: 'hardware', label: 'Matériel', icon: Package, color: 'text-orange-500' },
  { value: 'software', label: 'Logiciel', icon: Cpu, color: 'text-blue-500' },
  { value: 'network', label: 'Réseau', icon: Wifi, color: 'text-green-500' },
  { value: 'user', label: 'Compte / Accès', icon: User, color: 'text-purple-500' },
  { value: 'other', label: 'Autre', icon: HelpCircle, color: 'text-gray-500' },
];

const PRIORITIES = [
  { value: 'low', label: 'Faible', description: 'Gêne mineure, pas urgent', color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { value: 'medium', label: 'Moyen', description: 'Impact modéré sur le travail', color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
  { value: 'high', label: 'Élevé', description: 'Bloque une partie du travail', color: 'border-orange-400 bg-orange-50 text-orange-700' },
  { value: 'critical', label: 'Critique', description: 'Arrêt total de l\'activité', color: 'border-red-400 bg-red-50 text-red-700' },
];

const PROBLEM_TYPES = [
  'Impossible de se connecter au compte',
  'Mot de passe oublié / compte verrouillé',
  'Erreur application (Outlook, Office, ERP, etc.)',
  'Ordinateur lent / bloqué',
  'Problème réseau / Internet / Wi-Fi',
  'Imprimante non disponible',
  'Demande d\'installation logicielle',
  'Demande d\'accès / droits',
  'Autre problème',
];

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

  // Fermer le dropdown si clic à l'extérieur
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const selectProblemType = (value: string) => {
    handleChange('title', value);
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
      setError('Impossible de contacter le serveur. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-10 px-4">
      {/* Header */}
      <div className="w-full max-w-2xl mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
            <MonitorCheck className="text-white" size={28} />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold text-gray-900">Support Informatique</h1>
            <p className="text-sm text-gray-500">Portail de demande d'assistance</p>
          </div>
        </div>
        <p className="text-gray-600 max-w-md mx-auto">
          Décrivez votre problème et notre équipe vous répondra dans les meilleurs délais.
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Identité */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-gray-400" />
                  Nom complet <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="ex : Jean Dupont"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-gray-400" />
                  Adresse email <span className="text-red-500">*</span>
                </span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="jean.dupont@entreprise.fr"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Type du probleme */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Tag size={14} className="text-gray-400" />
                Type du problème <span className="text-red-500">*</span>
              </span>
            </label>
            {/* Champ hidden pour la validation native du formulaire */}
            <input type="text" required value={form.title} onChange={() => {}} className="sr-only" tabIndex={-1} aria-hidden="true" />
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  dropdownOpen
                    ? 'border-blue-500 ring-2 ring-blue-500 bg-white'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <span className={form.title ? 'text-gray-900' : 'text-gray-400'}>
                  {form.title || 'Sélectionnez un type de problème'}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {dropdownOpen && (
                <ul className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden py-1">
                  {PROBLEM_TYPES.map((problemType) => {
                    const selected = form.title === problemType;
                    return (
                      <li key={problemType}>
                        <button
                          type="button"
                          onClick={() => selectProblemType(problemType)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${
                            selected
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {problemType}
                          {selected && <Check size={14} className="text-blue-600 shrink-0 ml-2" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Catégorie <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORIES.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange('category', value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                    form.category === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} className={form.category === value ? 'text-blue-600' : color} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Priorité */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priorité <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITIES.map(({ value, label, description, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleChange('priority', value)}
                  className={`flex flex-col items-start gap-0.5 p-3 rounded-xl border-2 text-left transition-all ${
                    form.priority === value
                      ? `${color} border-current shadow-sm`
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-xs opacity-75 leading-tight">{description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <AlignLeft size={14} className="text-gray-400" />
                Description détaillée <span className="text-red-500">*</span>
              </span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Décrivez le problème en détail : depuis quand, sur quel appareil, message d'erreur éventuel, étapes pour reproduire..."
              required
              rows={5}
              maxLength={2000}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/2000</p>
          </div>

          {/* Erreur */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send size={18} />
                Soumettre le ticket
              </>
            )}
          </button>
        </form>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Votre demande sera traitée par l'équipe support dans les meilleurs délais.
      </p>
    </main>
  );
}
