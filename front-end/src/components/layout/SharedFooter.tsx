import { GithubIcon, LinkedinIcon, Mail } from "lucide-react";
import Logo from "../../assets/Logo.png";

export default function SharedFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-surface border-t border-border py-12 px-6"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 text-primary font-bold text-lg mb-4">
            <img src={Logo} className="max-w-14 h-auto" />
            <span className="text-text-primary">Estuda Fácil</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">
            A plataforma definitiva para estudantes que buscam excelência
            acadêmica e organização pessoal.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-text-primary text-sm">Produto</h4>
          {["Novidades", "Metodologia"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-text-primary text-sm">Legal</h4>
          {["Privacidade", "Termos de Uso"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-text-primary text-sm">Conecte-se</h4>
          <div className="flex gap-4">
            {/* Add os links depois */}
            {[GithubIcon, LinkedinIcon, Mail].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2 bg-bg-main rounded-full text-text-secondary hover:text-white hover:bg-primary transition-all duration-300"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-text-secondary">
          © {currentYear} Estuda Fácil - TCC em Técnico em Informatica para a
          Internet.
        </p>
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          Feito com ❤️ por Estudantes para Estudantes.
        </div>
      </div>
    </footer>
  );
}
