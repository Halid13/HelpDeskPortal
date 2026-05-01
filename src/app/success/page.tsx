'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle2, TicketCheck, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
  const params = useSearchParams();
  const ticketId = params.get('id') || '—';
  const shortId = ticketId.split('-')[0].toUpperCase();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Icône succès */}
        <div className="flex justify-center mb-6">
          <div className="p-5 bg-green-100 rounded-full">
            <CheckCircle2 className="text-green-600" size={52} strokeWidth={1.5} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ticket soumis avec succès !</h1>
        <p className="text-gray-500 mb-8">
          Votre demande a bien été enregistrée. Notre équipe support va prendre en charge votre ticket.
        </p>

        {/* Ticket info card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 text-left space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <TicketCheck className="text-blue-600" size={22} />
            <span className="font-semibold text-gray-700">Récapitulatif</span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Numéro de ticket</span>
            <span className="font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg">
              #{shortId}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Statut</span>
            <span className="flex items-center gap-1.5 font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Ouvert
            </span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-500 pt-2 border-t border-gray-100">
            <Clock size={14} className="mt-0.5 shrink-0" />
            <span>
              Vous recevrez une réponse par email dès qu'un technicien prendra en charge votre demande.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            Soumettre un autre ticket
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Chargement...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
