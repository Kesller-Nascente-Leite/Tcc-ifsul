import { useNavigate } from "react-router";
import {
  GraduationCap,
  Target,
  Heart,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export function AboutPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Conteúdo de Qualidade",
      description:
        "Cursos desenvolvidos por especialistas com material atualizado e didático.",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description:
        "Conecte-se com outros estudantes e professores em um ambiente colaborativo.",
    },
    {
      icon: Award,
      title: "Certificados Reconhecidos",
      description:
        "Obtenha certificados ao concluir cursos e valide suas conquistas.",
    },
    {
      icon: TrendingUp,
      title: "Acompanhamento de Progresso",
      description:
        "Monitore seu desenvolvimento com métricas e relatórios detalhados.",
    },
  ];

  const stats = [
    { value: "10.000+", label: "Estudantes Ativos" },
    { value: "500+", label: "Cursos Disponíveis" },
    { value: "150+", label: "Professores Especialistas" },
    { value: "95%", label: "Taxa de Satisfação" },
  ];

  const values = [
    {
      icon: Target,
      title: "Missão",
      description:
        "Democratizar o acesso à educação de qualidade, tornando o conhecimento acessível a todos através de uma plataforma inovadora e intuitiva.",
    },
    {
      icon: Sparkles,
      title: "Visão",
      description:
        "Ser a plataforma de ensino online mais reconhecida e valorizada, transformando vidas através da educação e tecnologia.",
    },
    {
      icon: Heart,
      title: "Valores",
      description:
        "Excelência educacional, inovação constante, inclusão, transparência e compromisso genuíno com o sucesso de cada estudante.",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/10 via-bg-main to-bg-main">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={16} />
              Sobre Nós
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              Transformando o Futuro
              <br />
              <span className="text-primary">Através da Educação</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Somos uma plataforma de ensino online dedicada a conectar
              estudantes e professores, oferecendo uma experiência de
              aprendizado moderna, acessível e eficaz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/register")}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
              >
                Comece Gratuitamente
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center justify-center gap-2 bg-surface border border-border text-text-primary px-8 py-3 rounded-xl font-semibold hover:bg-surface-secondary transition-all"
              >
                <GraduationCap size={18} />
                Explorar Cursos
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-text-secondary">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Nossos Pilares
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Os princípios que guiam nossa jornada e definem quem somos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-surface border border-border rounded-2xl p-8 hover:shadow-xl hover:border-primary/30 transition-all group"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-xl mb-6 group-hover:scale-110 transition-transform">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-4">
                    {value.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Por Que Escolher Nossa Plataforma?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Recursos desenvolvidos para proporcionar a melhor experiência de
              aprendizado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-bg-main border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                    <Icon size={24} />
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

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold mb-6">
                <GraduationCap size={16} />
                Nossa História
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-6">
                Educação Acessível e de Qualidade para Todos
              </h2>
              <div className="space-y-4 text-text-secondary">
                <p className="leading-relaxed">
                  Nossa plataforma nasceu da visão de tornar a educação de
                  qualidade acessível a todos, independentemente de sua
                  localização ou situação econômica. Acreditamos que o
                  conhecimento é a chave para transformar vidas e construir um
                  futuro melhor.
                </p>
                <p className="leading-relaxed">
                  Com tecnologia de ponta e uma equipe dedicada de educadores
                  apaixonados, criamos um ambiente de aprendizado que combina o
                  melhor da educação tradicional com a flexibilidade e
                  inovação do ensino online.
                </p>
                <p className="leading-relaxed">
                  Hoje, milhares de estudantes em todo o país confiam em nossa
                  plataforma para alcançar seus objetivos educacionais e
                  profissionais. E estamos apenas começando.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {[
                  "Cursos em vídeo com alta qualidade",
                  "Suporte dedicado de professores",
                  "Material complementar gratuito",
                  "Certificados de conclusão",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                      <CheckCircle size={16} />
                    </div>
                    <span className="text-text-secondary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-linear-to-br from-primary/20 to-primary/5 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <GraduationCap size={200} className="text-primary/20" />
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-surface border border-border rounded-2xl p-6 shadow-xl max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                    <Award size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">
                      5 anos
                    </div>
                    <div className="text-sm text-text-secondary">
                      Transformando vidas
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-br from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pronto para Começar sua Jornada?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que estão transformando suas
            vidas através da educação online. Comece gratuitamente hoje mesmo!
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
              onClick={() => navigate("/login")}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Já Tenho Conta
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}