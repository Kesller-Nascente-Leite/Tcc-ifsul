import { useNavigate } from "react-router";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  PlayCircle,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Star,
  Brain,
  Headphones,
  Zap,
  Target,
} from "lucide-react";

export function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Cursos Completos",
      description: "Biblioteca com centenas de cursos em vídeo de alta qualidade",
    },
    {
      icon: Brain,
      title: "IA Adaptativa",
      description: "Aprendizado personalizado com flashcards inteligentes",
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Conecte-se com estudantes e professores especializados",
    },
    {
      icon: Award,
      title: "Certificados",
      description: "Certificados reconhecidos ao concluir seus cursos",
    },
    {
      icon: Zap,
      title: "Modo Foco",
      description: "Elimine distrações e maximize sua produtividade",
    },
    {
      icon: Headphones,
      title: "Áudio-Learning",
      description: "Aprenda em qualquer lugar com conteúdo em áudio",
    },
  ];

  const stats = [
    { icon: Users, value: "10.000+", label: "Estudantes Ativos" },
    { icon: BookOpen, value: "500+", label: "Cursos Disponíveis" },
    { icon: GraduationCap, value: "150+", label: "Professores" },
    { icon: Star, value: "4.9/5", label: "Avaliação Média" },
  ];

  const testimonials = [
    {
      name: "Ana Silva",
      role: "Estudante de Programação",
      avatar: "👩‍💻",
      comment:
        "A plataforma mudou minha carreira! Os cursos são práticos e o suporte é excelente.",
      rating: 5,
    },
    {
      name: "Carlos Mendes",
      role: "Professor de Marketing",
      avatar: "👨‍🏫",
      comment:
        "Ferramentas incríveis para ensinar. Meus alunos adoram a experiência!",
      rating: 5,
    },
    {
      name: "Juliana Costa",
      role: "Designer UX/UI",
      avatar: "👩‍🎨",
      comment:
        "Aprendi design do zero aqui. O modo foco me ajudou muito a manter a concentração.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-main">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-bg-main to-bg-main">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Sparkles size={16} />
                Aprenda no seu ritmo
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
                Transforme seu
                <br />
                <span className="text-primary">Futuro com Educação</span>
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary mb-8 max-w-xl">
                Acesse cursos de alta qualidade, aprenda com IA adaptativa e
                alcance seus objetivos profissionais. Tudo em uma plataforma
                moderna e intuitiva.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
                >
                  Começar Gratuitamente
                  <ArrowRight size={20} />
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="inline-flex items-center justify-center gap-2 bg-surface border border-border text-text-primary px-8 py-4 rounded-xl font-semibold hover:bg-surface-secondary transition-all"
                >
                  <PlayCircle size={20} />
                  Ver Demonstração
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-primary" />
                  <span>Sem cartão de crédito</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-primary" />
                  <span>Acesso imediato</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative lg:block hidden">
              <div className="relative">
                <div className="aspect-square bg-linear-to-br from-primary/20 to-primary/5 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GraduationCap size={250} className="text-primary/20" />
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-6 -left-6 bg-surface border border-border rounded-2xl p-4 shadow-xl max-w-xs animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                      <Brain size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-primary">
                        IA Adaptativa
                      </div>
                      <div className="text-xs text-text-secondary">
                        Aprenda melhor
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-surface border border-border rounded-2xl p-4 shadow-xl max-w-xs animate-float-delayed">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                      <Award size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-primary">
                        Certificado
                      </div>
                      <div className="text-xs text-text-secondary">
                        Reconhecido no mercado
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-3">
                    <Icon size={24} />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-text-secondary">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Tudo que Você Precisa para Aprender
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Ferramentas modernas e recursos exclusivos para potencializar seu
              aprendizado
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all group"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-xl mb-4 group-hover:scale-110 transition-transform">
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

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/features")}
              className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
            >
              Ver Todas as Funcionalidades
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Como Funciona?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Comece a aprender em apenas 3 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Crie sua Conta",
                description:
                  "Cadastre-se gratuitamente em menos de 1 minuto. Sem cartão de crédito.",
                icon: Users,
              },
              {
                step: "2",
                title: "Escolha seus Cursos",
                description:
                  "Navegue por centenas de cursos e escolha os que mais combinam com seus objetivos.",
                icon: BookOpen,
              },
              {
                step: "3",
                title: "Comece a Aprender",
                description:
                  "Assista às aulas, pratique com exercícios e conquiste certificados.",
                icon: Target,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto">
                      <Icon size={32} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {item.title}
                  </h3>
                  <p className="text-text-secondary">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              O Que Dizem Nossos Alunos
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Milhares de vidas já foram transformadas. Você é o próximo!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-text-primary">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {testimonial.role}
                    </div>
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
            Pronto para Transformar seu Futuro?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já estão alcançando seus
            objetivos. Comece gratuitamente hoje mesmo!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg"
            >
              Criar Conta Gratuita
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate("/pricing")}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Ver Planos
            </button>
          </div>
        </div>
      </section>

      {/* CSS para animações */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }
      `}</style>
    </div>
  );
}