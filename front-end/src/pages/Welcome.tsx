import { Link } from "react-router";
import { BenefitCard } from "../components/BenefitCard";

import {
  BookOpenIcon,
  ChartBarIcon,
  CheckCircleIcon,
  CalendarIcon,
} from "lucide-react"; // Lib de icones

export function Welcome() {
  return (
    <main className="min-h-screen w-full bg-(--color-bg-main) flex items-center justify-center p-6 animate-in fade-in duration-700">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-(--color-primary)/10 text-(--color-primary) text-xs font-bold tracking-wider uppercase">
              Plataforma de Gestão de Estudos
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-(--color-text-primary) leading-tight">
              Transforme seu esforço em{" "}
              <span className="text-(--color-primary)">resultados reais.</span>
            </h1>
            <p className="text-lg text-(--color-text-secondary) max-w-lg">
              Organize seu cronograma, acompanhe sua evolução por matéria e
              alcance suas metas acadêmicas com uma interface simples e
              intuitiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <BenefitCard
              icon={<BookOpenIcon size={20} />}
              title="Gestão de Matérias"
              description="Centralize todos os seus conteúdos em um único lugar."
            />
            <BenefitCard
              icon={<ChartBarIcon size={20} />}
              title="Análise de Progresso"
              description="Gráficos detalhados sobre o seu desempenho diário."
            />
            <BenefitCard
              icon={<CheckCircleIcon size={20} />}
              title="Metas Inteligentes"
              description="Defina objetivos semanais e nunca perca um prazo."
            />
            <BenefitCard
              icon={<CalendarIcon size={20} />}
              title="Cronograma Flexível"
              description="Ajuste sua rotina conforme sua disponibilidade real."
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Link to="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-(--color-primary) hover:bg-(--color-primary-hover) text-white font-bold rounded-xl transition-all shadow-lg shadow-(--color-primary)/20 active:scale-95">
                Começar agora gratuitamente
              </button>
            </Link>

            <Link to="/login" className="w-full sm:w-auto text-center">
              <button className="w-full sm:w-auto px-8 py-4 text-(--color-text-secondary) font-medium hover:text-(--color-text-primary) transition-colors">
                Já tenho uma conta
              </button>
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex justify-center items-center relative">
          <div className="absolute w-96 h-96 bg-(--color-primary)/5 rounded-full blur-3xl" />

          <div className="relative z-10 w-full max-w-md p-4 bg-(--color-surface) rounded-2xl shadow-2xl border border-(--color-border) animate-in slide-in-from-right duration-1000">
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-(--color-border) pb-4">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="ml-auto w-24 h-2 bg-(--color-border) rounded-full" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-3/4 bg-(--color-bg-main) rounded" />
                <div className="h-20 w-full bg-(--color-primary)/10 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-(--color-primary)">
                    Gráfico de Evolução Semanal
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-(--color-bg-main) rounded" />
                  <div className="h-12 bg-(--color-bg-main) rounded" />
                  <div className="h-12 bg-(--color-bg-main) rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
