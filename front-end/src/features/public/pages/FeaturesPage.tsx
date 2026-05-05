import { useNavigate } from "react-router";
import {
  BookOpen,
  Brain,
  Zap,
  Headphones,
  Target,
  Bell,
  Mail,
  UserPlus,
  FileText,
  Clipboard,
  MessageSquare,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  PlayCircle,
  Award,
  BarChart,
  Lock,
  Shield,
} from "lucide-react";

export function FeaturesPage() {
  const navigate = useNavigate();

  // Funcionalidades já disponíveis
  const currentFeatures = [
    {
      icon: BookOpen,
      title: "Cursos em Vídeo HD",
      description:
        "Biblioteca completa com centenas de cursos em vídeo de alta qualidade, organizados por categorias e níveis de dificuldade.",
      tag: "Disponível",
      color: "primary",
    },
    {
      icon: PlayCircle,
      title: "Player Avançado",
      description:
        "Controle de velocidade, legendas, marcadores e retomada automática de onde você parou.",
      tag: "Disponível",
      color: "primary",
    },
    {
      icon: FileText,
      title: "Material Complementar",
      description:
        "PDFs, exercícios práticos, slides e recursos adicionais para cada aula.",
      tag: "Disponível",
      color: "primary",
    },
    {
      icon: Award,
      title: "Certificados",
      description:
        "Certificados digitais reconhecidos ao concluir cursos, validando seu aprendizado.",
      tag: "Disponível",
      color: "primary",
    },
    {
      icon: BarChart,
      title: "Acompanhamento de Progresso",
      description:
        "Métricas detalhadas do seu desenvolvimento, tempo de estudo e conquistas alcançadas.",
      tag: "Disponível",
      color: "primary",
    },
    {
      icon: Shield,
      title: "Autenticação Segura",
      description:
        "Login seguro com OAuth2 e proteção de dados conforme LGPD.",
      tag: "Disponível",
      color: "primary",
    },
  ];

  // Funcionalidades com IA e recursos avançados
  const aiFeatures = [
    {
      icon: Brain,
      title: "Flashcards IA: Aprendizado Adaptativo",
      description:
        "Sistema inteligente que cria flashcards personalizados baseado no seu desempenho, melhorando a retenção de memória de longo prazo através de repetição espaçada.",
      tag: "Em Breve",
      color: "purple",
      benefits: [
        "Repetição espaçada inteligente",
        "Geração automática de cards",
        "Adaptação ao seu ritmo",
      ],
    },
    {
      icon: Zap,
      title: "Modo Foco: UX Psicológica",
      description:
        "Interface minimalista que combate a distração digital usando princípios de psicologia cognitiva, aumentando produtividade e concentração durante os estudos.",
      tag: "Em Breve",
      color: "orange",
      benefits: [
        "Bloqueio de notificações",
        "Timer Pomodoro integrado",
        "Ambiente livre de distrações",
      ],
    },
    {
      icon: MessageSquare,
      title: "Tutor Contextual: IA 24/7",
      description:
        "Assistente inteligente que responde dúvidas sobre o conteúdo do curso em tempo real, sem depender da presença física do professor.",
      tag: "Em Breve",
      color: "blue",
      benefits: [
        "Respostas instantâneas",
        "Contextualizado ao curso",
        "Disponível 24/7",
      ],
    },
    {
      icon: Headphones,
      title: "Áudio-Learning: Acessibilidade Universal",
      description:
        "Versão em áudio das aulas para aprender em qualquer lugar - no trânsito, na academia ou fazendo tarefas. Inclusão e flexibilidade de consumo.",
      tag: "Em Breve",
      color: "green",
      benefits: [
        "Aprenda em movimento",
        "Download offline",
        "Velocidade ajustável",
      ],
    },
    {
      icon: Clipboard,
      title: "IA Criadora de Exercícios",
      description:
        "Inteligência artificial especializada em criar exercícios personalizados baseados no conteúdo estudado e no seu nível de conhecimento.",
      tag: "Em Breve",
      color: "indigo",
      benefits: [
        "Exercícios personalizados",
        "Dificuldade adaptativa",
        "Feedback automático",
      ],
    },
  ];

  // Funcionalidades administrativas e de comunicação
  const adminFeatures = [
    {
      icon: Lock,
      title: "Confirmação de Conta",
      description:
        "Sistema de verificação por email para garantir a segurança e autenticidade das contas criadas.",
      tag: "Em Desenvolvimento",
    },
    {
      icon: Mail,
      title: "Recuperação de Senha",
      description:
        "Processo seguro e simples para redefinir sua senha caso você esqueça.",
      tag: "Em Desenvolvimento",
    },
    {
      icon: Bell,
      title: "Avisos de Exercícios",
      description:
        "Notificações automáticas quando novos exercícios estão disponíveis ou prazos estão próximos.",
      tag: "Em Breve",
    },
    {
      icon: UserPlus,
      title: "Convites para Professor/Aluno",
      description:
        "Sistema de convites para facilitar a criação de turmas e onboarding de novos membros.",
      tag: "Em Breve",
    },
    {
      icon: FileText,
      title: "Relatórios de Desempenho",
      description:
        "Envio automático de relatórios detalhados para professores e alunos sobre progresso e métricas.",
      tag: "Em Breve",
    },
  ];

  const getTagColor = (color: string) => {
    const colors: Record<string, string> = {
      primary: "bg-primary/10 text-primary",
      purple: "bg-purple-500/10 text-purple-600",
      orange: "bg-orange-500/10 text-orange-600",
      blue: "bg-blue-500/10 text-blue-600",
      green: "bg-green-500/10 text-green-600",
      indigo: "bg-indigo-500/10 text-indigo-600",
    };
    return colors[color] || "bg-gray-500/10 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-bg-main to-bg-main">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={16} />
              Funcionalidades
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              Recursos que Transformam
              <br />
              <span className="text-primary">Seu Aprendizado</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Da biblioteca de cursos à IA adaptativa, tudo foi pensado para
              oferecer a melhor experiência educacional. Conheça nossas
              funcionalidades atuais e o que está por vir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
              >
                Começar Gratuitamente
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/pricing")}
                className="inline-flex items-center justify-center gap-2 bg-surface border border-border text-text-primary px-8 py-3 rounded-xl font-semibold hover:bg-surface-secondary transition-all"
              >
                Ver Planos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Current Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              <CheckCircle size={16} />
              Já Disponível
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Funcionalidades Atuais
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Recursos já implementados e prontos para uso
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary/50 transition-all group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI & Advanced Features */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Brain size={16} />
              Próxima Geração
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Recursos Inteligentes em Desenvolvimento
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Tecnologias de ponta com IA e psicologia do aprendizado para
              maximizar seus resultados
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {aiFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-bg-main border-2 border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${getTagColor(feature.color)}`}
                    >
                      <Icon size={28} />
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full ${getTagColor(feature.color)}`}
                    >
                      {feature.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {feature.benefits && (
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle
                            size={16}
                            className="text-primary shrink-0"
                          />
                          <span className="text-sm text-text-secondary">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Admin & Communication Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Target size={16} />
              Gestão & Comunicação
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Recursos Administrativos
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Ferramentas para professores e gestão eficiente da plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 text-blue-600 rounded-xl">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 flex items-center gap-1">
                      <Clock size={12} />
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="py-20 bg-linear-to-br from-primary/5 to-bg-main">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Roadmap de Desenvolvimento
            </h2>
            <p className="text-lg text-text-secondary">
              Nossa visão para o futuro da plataforma
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                quarter: "Q2 2026",
                title: "Autenticação & Segurança",
                items: [
                  "Confirmação de conta por email",
                  "Recuperação de senha",
                ],
                status: "Em Desenvolvimento",
              },
              {
                quarter: "Q3 2026",
                title: "IA & Personalização",
                items: [
                  "Flashcards IA adaptativos",
                  "Tutor contextual 24/7",
                  "Criador de exercícios IA",
                ],
                status: "Planejado",
              },
              {
                quarter: "Q4 2026",
                title: "Produtividade & UX",
                items: [
                  "Modo Foco avançado",
                  "Áudio-Learning",
                  "Sistema de notificações",
                ],
                status: "Planejado",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold shrink-0">
                    {item.quarter}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-text-primary">
                        {item.title}
                      </h3>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                        {item.status}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {item.items.map((subitem, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle
                            size={16}
                            className="text-primary shrink-0"
                          />
                          <span className="text-text-secondary">{subitem}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Experimente Todas as Funcionalidades
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Comece gratuitamente e tenha acesso a todos os recursos disponíveis.
            Seja um dos primeiros a testar as novidades!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg"
            >
              Criar Conta Gratuita
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate("/about")}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Saber Mais
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}