import { useNavigate } from "react-router";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-bg-main] p-4">
      <div className="w-full max-w-md rounded-xl bg-[--color-surface] p-8 text-center shadow-lg border border-[--color-border]">
        <h1 className="text-6xl font-bold text-[--color-error]">403</h1>

        <h2 className="mt-4 text-2xl font-bold text-[--color-text-primary]">
          Acesso Negado
        </h2>

        <p className="mt-2 mb-8 text-[--color-text-secondary]">
          Desculpe, você não tem permissão para acessar esta página. Se você
          acha que isso é um erro, contate o administrador.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg border border-[--color-border] text-[--color-text-primary] hover:bg-[--color-bg-main] transition-colors font-medium cursor-pointer duration-300"
          >
            Voltar
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-lg border border-[--color-border] bg-[--color-primary] hover:bg-[--color-primary-hover] text-white transition-colors font-medium cursor-pointer shadow-md duration-300"
          >
            Ir para o Início
          </button>
        </div>
      </div>
    </div>
  );
}
