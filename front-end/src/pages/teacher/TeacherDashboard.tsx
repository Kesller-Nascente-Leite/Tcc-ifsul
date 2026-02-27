import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  CheckCircle2,
  FileText,
  Clock,
  AlertCircle,
  BookOpen,
  BarChart3,
  Calendar,
  GraduationCap,
} from "lucide-react";
import { ButtonComponent } from "../../components/ui/ButtonComponent";
import { useTheme } from "../../context/ThemeContext";

function StatCard({
  title,
  value,
  icon,
  bgColor = "bg-primary-50",
}: {
  title: string;
  value: string;
  icon: ReactNode;
  bgColor?: string;
}) {
  return (
    <div className="p-4 rounded-xl border shadow-sm bg-surface border-border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-text-secondary">{title}</p>
          <p className="font-bold text-xl text-text-primary">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor} text-primary`}>{icon}</div>
      </div>
    </div>
  );
}

export function TeacherDashboard() {
  const { accentColor } = useTheme();
  const navigate = useNavigate();
  const [weeklyActivity, setWeeklyActivity] = useState(45);

  const classes = [
    {
      id: "c1",
      name: "Matemática - 1º Ano A",
      students: 35,
      progress: 72,
      nextClass: "Hoje • 14:00",
    },
    {
      id: "c2",
      name: "Matemática - 1º Ano B",
      students: 32,
      progress: 68,
      nextClass: "Hoje • 16:00",
    },
    {
      id: "c3",
      name: "Álgebra Avançada - 3º Ano",
      students: 28,
      progress: 85,
      nextClass: "Amanhã • 09:00",
    },
  ];

  const pendingAssignments = [
    {
      id: "a1",
      class: "Matemática - 1º Ano A",
      assignment: "Exercícios de Equações",
      count: 12,
      dueDate: "Hoje",
    },
    {
      id: "a2",
      class: "Matemática - 1º Ano B",
      assignment: "Projeto de Estatística",
      count: 8,
      dueDate: "Amanhã",
    },
    {
      id: "a3",
      class: "Álgebra Avançada - 3º Ano",
      assignment: "Lista de Exercícios",
      count: 5,
      dueDate: "Semana que vem",
    },
  ];

  useEffect(() => {
    const t = setInterval(
      () => setWeeklyActivity((p) => (p >= 100 ? 100 : p + 1)),
      150,
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Painel do Professor
          </h1>
          <p className="text-sm text-text-secondary">
            Gerenciar turmas, avaliações e materiais
          </p>
        </div>
          <div className="flex items-center gap-3">
          <ButtonComponent size="sm" onClick={() => navigate("/teacher/classes")}>Nova Turma</ButtonComponent>
          <ButtonComponent size="sm">Novo Material</ButtonComponent>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total de alunos"
          value="95"
          icon={<Users size={20} />}
        />
        <StatCard
          title="Avaliações pendentes"
          value="25"
          icon={<AlertCircle size={20} />}
          bgColor="bg-red-50"
        />
        <StatCard
          title="Tarefas lançadas"
          value="3"
          icon={<CheckCircle2 size={20} />}
          bgColor="bg-green-50"
        />
        <StatCard
          title="Turmas ativas"
          value="3"
          icon={<BookOpen size={20} />}
          bgColor="bg-blue-50"
        />
      </section>

      <section className="p-6 rounded-2xl border bg-surface border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-text-primary">Minhas Turmas</h3>
          <ButtonComponent
            size="sm"
            onClick={() => navigate("/teacher/classes")}
          >
            Ver todas
          </ButtonComponent>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="p-4 rounded-lg bg-surface border border-border hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/teacher/class/${cls.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-text-primary text-sm">
                    {cls.name}
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    {cls.students} alunos
                  </div>
                </div>
                <GraduationCap size={18} className="text-primary" />
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text-secondary">Progresso</span>
                  <span className="text-text-primary font-semibold">
                    {cls.progress}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${cls.progress}%`,
                      backgroundColor: accentColor,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Clock size={14} />
                <span>{cls.nextClass}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border bg-surface border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-text-primary">
              Atividade Semanal
            </h3>
            <div className="text-sm text-text-secondary">Meta: 100%</div>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 rounded-full transition-all"
              style={{
                width: `${weeklyActivity}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-sm text-text-secondary">
            <div>{weeklyActivity}% de atividades planejadas</div>
            <div>Última atualização: hoje</div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-text-secondary text-sm mb-3">
              Resumo da semana:
            </p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>12 aulas lecionadas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>18 atividades lançadas</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle size={16} className="text-orange-500" />
                <span>25 avaliações pendentes</span>
              </li>
            </ul>
          </div>
        </div>

        <aside className="p-6 rounded-2xl border bg-surface border-border space-y-4">
          <h4 className="font-bold text-md text-text-primary">
            Próximas Aulas
          </h4>
          <ul className="space-y-3">
            <li className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Calendar size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary text-sm">
                    Matemática 1º A
                  </div>
                  <div className="text-xs text-text-secondary">
                    Hoje • 14:00
                  </div>
                </div>
              </div>
            </li>

            <li className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Calendar size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary text-sm">
                    Matemática 1º B
                  </div>
                  <div className="text-xs text-text-secondary">
                    Hoje • 16:00
                  </div>
                </div>
              </div>
            </li>

            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                  <Calendar size={16} className="text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary text-sm">
                    Álgebra 3º Ano
                  </div>
                  <div className="text-xs text-text-secondary">
                    Amanhã • 09:00
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div className="pt-2">
            <ButtonComponent size="sm">Ver calendário completo</ButtonComponent>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl border bg-surface border-border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-md text-text-primary">
              Avaliações Pendentes
            </h4>
            <ButtonComponent size="sm">Ver todas</ButtonComponent>
          </div>
          <div className="space-y-3">
            {pendingAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/20 border-border hover:border-primary/50 transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-text-primary text-sm">
                    {assignment.assignment}
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    {assignment.class}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary text-lg">
                    {assignment.count}
                  </div>
                  <div className="text-xs text-text-secondary">
                    a corrigir • {assignment.dueDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl border bg-surface border-border">
          <h4 className="font-bold text-md mb-4 text-text-primary">
            Materiais Recentes
          </h4>
          <ul className="space-y-3 text-text-secondary">
            <li className="flex items-start gap-3 pb-3 border-b border-border">
              <FileText size={18} className="text-primary mt-1 shrink-0" />
              <div>
                <div className="font-semibold text-text-primary text-sm">
                  Slides - Equações
                </div>
                <div className="text-xs">Matemática 1º A • 3 dias atrás</div>
              </div>
            </li>
            <li className="flex items-start gap-3 pb-3 border-b border-border">
              <FileText size={18} className="text-primary mt-1 shrink-0" />
              <div>
                <div className="font-semibold text-text-primary text-sm">
                  Exercícios Resolvidos
                </div>
                <div className="text-xs">Álgebra 3º Ano • 5 dias atrás</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <BarChart3 size={18} className="text-primary mt-1 shrink-0" />
              <div>
                <div className="font-semibold text-text-primary text-sm">
                  Gráfico de Desempenho
                </div>
                <div className="text-xs">Turma • 1 semana atrás</div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
