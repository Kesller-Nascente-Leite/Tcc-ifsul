import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  BarChart2,
  Circle,
  ClipboardList,
  Clock,
  FileText,
  Calendar,
} from "lucide-react";
import { ButtonComponent } from "../../components/ButtonComponent";
import { useTheme } from "../../context/ThemeContext";

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl border shadow-sm bg-surface border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-secondary">{title}</p>
          <p className="font-bold text-xl text-text-primary">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-primary-50 text-primary">{icon}</div>
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const { accentColor } = useTheme();
  const navigate = useNavigate();
  const [weeklyProgress, setWeeklyProgress] = useState(68);

  const subjects = [
    { id: "m1", name: "Matemática", progress: 78 },
    { id: "m2", name: "Física", progress: 34 },
    { id: "m3", name: "História", progress: 92 },
  ];

  useEffect(() => {
    const t = setInterval(
      () => setWeeklyProgress((p) => (p >= 82 ? 82 : p + 1)),
      120,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Painel de Estudos
          </h1>
          <p className="text-sm text-text-secondary">
            Visão geral do seu progresso e tarefas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ButtonComponent size="sm">Nova Tarefa</ButtonComponent>
          <ButtonComponent size="sm">Importar Plano</ButtonComponent>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Horas esta semana"
          value="12h 30m"
          icon={<Clock size={20} />}
        />
        <StatCard
          title="Tarefas pendentes"
          value="8"
          icon={<ClipboardList size={20} />}
        />
        <StatCard
          title="Materiais ativos"
          value="5"
          icon={<FileText size={20} />}
        />
      </section>

      <section className="p-6 rounded-2xl border bg-surface border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-text-primary">
            Minhas Matérias
          </h3>
          <ButtonComponent
            size="sm"
            onClick={() => navigate("/student/subjects")}
          >
            Ver todas
          </ButtonComponent>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="p-3 rounded-lg bg-surface border border-border flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">{s.name}</div>
                <div className="text-xs text-text-secondary">
                  Progresso: {s.progress}%
                </div>
              </div>
              <div>
                <ButtonComponent
                  size="sm"
                  onClick={() => navigate(`/student/subjects?subject=${s.id}`)}
                >
                  Entrar
                </ButtonComponent>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border bg-surface border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-text-primary">
              Progresso Semanal
            </h3>
            <div className="text-sm text-text-secondary">Meta: 15h</div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full transition-all"
              style={{
                width: `${weeklyProgress}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
            <div>{weeklyProgress}% concluído</div>
            <div>Última sincronização: hoje</div>
          </div>
        </div>

        <aside className="p-6 rounded-2xl border bg-surface border-border space-y-4">
          <h4 className="font-bold text-md text-text-primary">
            Próximas Atividades
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Circle size={16} className="text-primary" />
                <div>
                  <div className="font-semibold text-text-primary">
                    Estudar Álgebra
                  </div>
                  <div className="text-xs text-text-secondary">
                    Hoje • 18:00
                  </div>
                </div>
              </div>
              <div className="text-sm text-text-secondary">45m</div>
            </li>

            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart2 size={16} className="text-primary" />
                <div>
                  <div className="font-semibold text-text-primary">
                    Revisão de História
                  </div>
                  <div className="text-xs text-text-secondary">
                    Amanhã • 09:00
                  </div>
                </div>
              </div>
              <div className="text-sm text-text-secondary">30m</div>
            </li>
          </ul>

          <div className="pt-2">
            <ButtonComponent size="sm">Ver calendário</ButtonComponent>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border bg-surface border-border">
          <h4 className="font-bold text-md mb-4">Últimos Materiais</h4>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3">
              <Calendar size={18} className="text-primary mt-1" />
              <div>
                <div className="font-semibold text-text-primary">
                  Apostila de Cálculo
                </div>
                <div className="text-xs">2 capítulos • 120 páginas</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <FileText size={18} className="text-primary mt-1" />
              <div>
                <div className="font-semibold text-text-primary">
                  Slides - Física
                </div>
                <div className="text-xs">10 slides • 25MB</div>
              </div>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-2xl border bg-surface border-border">
          <h4 className="font-bold text-md mb-4">Tarefas Recentes</h4>
          <ol className="list-decimal pl-4 text-text-secondary">
            <li className="mb-2">Exercícios de Química (concluído)</li>
            <li className="mb-2">Resumo de Biologia (pendente)</li>
            <li className="mb-2">Projeto de Matemática (em andamento)</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
