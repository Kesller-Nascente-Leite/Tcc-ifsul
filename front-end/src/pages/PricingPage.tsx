import { useNavigate } from "react-router";
import {
  Check,
  X,
  ArrowRight,
  Sparkles,
  Crown,
  Zap,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  Shield,
  MessageSquare,
  BarChart,
} from "lucide-react";
import { useState } from "react";

export function PricingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );

  const plans = [
    {
      name: "Gratuito",
      icon: BookOpen,
      description: "Perfeito para começar a aprender",
      price: {
        monthly: 0,
        yearly: 0,
      },
      badge: null,
      color: "gray",
      cta: "Começar Gratuitamente",
      features: [
        { text: "Acesso a 10 cursos gratuitos", included: true },
        { text: "Vídeos em qualidade HD", included: true },
        { text: "Material complementar básico", included: true },
        { text: "Certificado de conclusão", included: true },
        { text: "Suporte por email (48h)", included: true },
        { text: "Acesso a todos os cursos", included: false },
        { text: "Flashcards IA", included: false },
        { text: "Modo Foco", included: false },
        { text: "Tutor IA 24/7", included: false },
        { text: "Áudio-Learning", included: false },
      ],
    },
    {
      name: "Pro",
      icon: Zap,
      description: "Ideal para estudantes dedicados",
      price: {
        monthly: 49.9,
        yearly: 39.9,
      },
      badge: "Mais Popular",
      color: "primary",
      cta: "Começar Teste Grátis",
      featured: true,
      features: [
        { text: "Tudo do plano Gratuito", included: true },
        { text: "Acesso ilimitado a TODOS os cursos", included: true },
        { text: "Material complementar premium", included: true },
        { text: "Downloads para estudo offline", included: true },
        { text: "Flashcards IA adaptativos", included: true },
        { text: "Modo Foco (sem distrações)", included: true },
        { text: "Estatísticas avançadas", included: true },
        { text: "Suporte prioritário (12h)", included: true },
        { text: "Áudio-Learning", included: true },
        { text: "Tutor IA 24/7", included: false },
        { text: "Relatórios personalizados", included: false },
      ],
    },
    {
      name: "Premium",
      icon: Crown,
      description: "Para quem leva educação a sério",
      price: {
        monthly: 99.9,
        yearly: 79.9,
      },
      badge: "Melhor Custo-Benefício",
      color: "purple",
      cta: "Começar Teste Grátis",
      features: [
        { text: "Tudo do plano Pro", included: true },
        { text: "Tutor IA contextual 24/7", included: true },
        { text: "Criador de exercícios IA", included: true },
        { text: "Relatórios personalizados semanais", included: true },
        { text: "Mentoria em grupo (2x/mês)", included: true },
        { text: "Acesso antecipado a novos cursos", included: true },
        { text: "Certificados premium", included: true },
        { text: "Suporte VIP (4h)", included: true },
        { text: "Sessões de coaching individual", included: true },
        { text: "Badge de estudante premium", included: true },
      ],
    },
  ];

  const enterpriseFeatures = [
    { icon: Users, text: "Licenças em volume com desconto" },
    { icon: Shield, text: "SSO e integração com sistemas corporativos" },
    { icon: BarChart, text: "Dashboard administrativo completo" },
    { icon: Award, text: "Cursos customizados para sua empresa" },
    { icon: GraduationCap, text: "Trilhas de aprendizado personalizadas" },
    { icon: MessageSquare, text: "Gerente de conta dedicado" },
  ];

  const faqs = [
    {
      question: "Posso cancelar a qualquer momento?",
      answer:
        "Sim! Você pode cancelar sua assinatura a qualquer momento, sem multas ou taxas. Seu acesso continua até o fim do período pago.",
    },
    {
      question: "Como funciona o teste grátis?",
      answer:
        "Nos planos Pro e Premium, você tem 7 dias de teste grátis. Se não gostar, cancele antes do fim do período e não será cobrado.",
    },
    {
      question: "Posso mudar de plano depois?",
      answer:
        "Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações são refletidas no próximo ciclo de cobrança.",
    },
    {
      question: "Os cursos têm validade?",
      answer:
        "Não! Enquanto você mantiver sua assinatura ativa, terá acesso ilimitado a todos os cursos disponíveis na plataforma.",
    },
    {
      question: "Tem garantia de reembolso?",
      answer:
        "Sim! Oferecemos 30 dias de garantia incondicional. Se não ficar satisfeito, devolvemos 100% do seu investimento.",
    },
  ];

  const getColorClasses = (color: string, featured?: boolean) => {
    if (featured) {
      return {
        border: "border-primary",
        bg: "bg-primary/5",
        button: "bg-primary text-white hover:bg-primary/90",
        icon: "bg-primary/10 text-primary",
        badge: "bg-primary text-white",
      };
    }

    const colors: Record<
      string,
      {
        border: string;
        bg: string;
        button: string;
        icon: string;
        badge: string;
      }
    > = {
      gray: {
        border: "border-border",
        bg: "bg-surface",
        button:
          "bg-surface border border-border text-text-primary hover:bg-surface-secondary",
        icon: "bg-gray-500/10 text-gray-600",
        badge: "bg-gray-500/10 text-gray-600",
      },
      primary: {
        border: "border-primary/30",
        bg: "bg-primary/5",
        button: "bg-primary text-white hover:bg-primary/90",
        icon: "bg-primary/10 text-primary",
        badge: "bg-primary text-white",
      },
      purple: {
        border: "border-purple-500/30",
        bg: "bg-purple-500/5",
        button: "bg-purple-600 text-white hover:bg-purple-700",
        icon: "bg-purple-500/10 text-purple-600",
        badge: "bg-purple-600 text-white",
      },
    };

    return colors[color] || colors.gray;
  };

  const getPrice = (plan: (typeof plans)[0]) => {
    const price =
      billingCycle === "monthly" ? plan.price.monthly : plan.price.yearly;
    return price;
  };

  const getSavings = (plan: (typeof plans)[0]) => {
    if (billingCycle === "yearly" && plan.price.monthly > 0) {
      const monthlyCost = plan.price.monthly * 12;
      const yearlyCost = plan.price.yearly * 12;
      const savings = monthlyCost - yearlyCost;
      const percentage = Math.round((savings / monthlyCost) * 100);
      return { amount: savings, percentage };
    }
    return null;
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
              Planos e Preços
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
              Invista no Seu
              <br />
              <span className="text-primary">Futuro Profissional</span>
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
              Escolha o plano ideal para seus objetivos. Todos com acesso a
              cursos de qualidade, certificados e suporte.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 bg-surface border border-border rounded-full p-1.5">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  billingCycle === "monthly"
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-6 py-2 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  billingCycle === "yearly"
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Anual
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              const colors = getColorClasses(plan.color, plan.featured);
              const price = getPrice(plan);
              const savings = getSavings(plan);

              return (
                <div
                  key={index}
                  className={`relative bg-surface border-2 rounded-3xl p-8 hover:shadow-2xl transition-all ${
                    plan.featured ? "scale-105 shadow-xl" : ""
                  } ${colors.border}`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div
                        className={`px-4 py-1.5 rounded-full text-xs font-bold ${colors.badge}`}
                      >
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className="text-center mb-8">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${colors.icon}`}
                    >
                      <Icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-text-secondary text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-center mb-8">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-text-secondary text-xl">R$</span>
                      <span className="text-5xl font-bold text-text-primary">
                        {price.toFixed(0)}
                      </span>
                      <span className="text-text-secondary">
                        {price > 0 ? "/mês" : ""}
                      </span>
                    </div>
                    {savings && (
                      <div className="mt-2 text-sm text-green-600 font-semibold">
                        Economize R$ {savings.amount.toFixed(0)}/ano (
                        {savings.percentage}%)
                      </div>
                    )}
                    {billingCycle === "yearly" && price > 0 && (
                      <div className="text-xs text-text-secondary mt-1">
                        R$ {(price * 12).toFixed(2)} cobrado anualmente
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => navigate("/register")}
                    className={`w-full px-6 py-4 rounded-xl font-semibold transition-all mb-8 ${colors.button} shadow-lg`}
                  >
                    {plan.cta}
                  </button>

                  {/* Features List */}
                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {feature.included ? (
                            <Check
                              size={18}
                              className="text-primary shrink-0"
                            />
                          ) : (
                            <X size={18} className="text-gray-400 shrink-0" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            feature.included
                              ? "text-text-secondary"
                              : "text-text-secondary/50 line-through"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 bg-surface">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Users size={16} />
              Para Empresas
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Plano Enterprise
            </h2>
            <p className="text-lg text-text-secondary">
              Solução completa para treinar sua equipe
            </p>
          </div>

          <div className="bg-linear-to-br from-primary/5 to-bg-main border-2 border-primary/30 rounded-3xl p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {enterpriseFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-text-secondary">{feature.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg"
              >
                Falar com Especialista
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-lg text-text-secondary">
              Tire suas dúvidas sobre nossos planos
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-surface border border-border rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none hover:bg-surface-secondary transition-all">
                  <h3 className="font-semibold text-text-primary">
                    {faq.question}
                  </h3>
                  <ArrowRight
                    size={20}
                    className="text-text-secondary group-open:rotate-90 transition-transform"
                  />
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-text-secondary leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-linear-to-br from-primary to-primary/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ainda Tem Dúvidas?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Fale com nossa equipe e descubra qual plano é ideal para você.
            Estamos aqui para ajudar!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-all shadow-lg"
            >
              Começar Gratuitamente
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all"
            >
              Falar com Suporte
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}