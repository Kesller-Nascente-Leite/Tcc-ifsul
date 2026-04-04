import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Save,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Hash,
  Layers,
  FileText,
} from "lucide-react";
import { ButtonComponent } from "@/shared/components/ui/ButtonComponent";
import { InputComponent } from "@/shared/components/ui/InputComponent";
import { useTheme } from "@/app/providers/ThemeContext";
import { ModuleTeacherApi } from "@/features/teacher/api/moduleTeacher.api";
import { CourseTeacherApi } from "@/features/teacher/api/courseTeacher.api";
import type { ModuleDTO } from "@/shared/types/ModuleDTO";
import type { CourseDTO } from "@/shared/types/CourseDTO";
import { Button, Header, Label, TextArea } from "react-aria-components";

export function EditModule() {
  const { moduleId, courseId } = useParams<{
    moduleId: string;
    courseId: string;
  }>();
  const { accentColor } = useTheme();
  const navigate = useNavigate();

  // Estados do formulário
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [orderIndex, setOrderIndex] = useState<number>(1);

  // Estados de dados
  const [module, setModule] = useState<ModuleDTO | null>(null);
  const [course, setCourse] = useState<CourseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "warning";
    message: string;
  } | null>(null);

  useEffect(() => {
    loadModuleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, courseId]);

  const loadModuleData = async () => {
    console.log("Carregando dados do módulo e curso...");

    if (!moduleId) {
      console.error("moduleId ausente nos parâmetros da URL");
      setIsLoading(false);
      return;
    }

    if (!courseId) {
      console.error("courseId ausente nos parâmetros da URL");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const [moduleResponse, courseResponse] = await Promise.all([
        ModuleTeacherApi.getById(Number(moduleId)),
        CourseTeacherApi.getById(Number(courseId)),
      ]);

      console.log("Dados do módulo carregados:", moduleResponse.data);
      console.log("Dados do curso carregados:", courseResponse.data);

      const moduleData = moduleResponse.data;
      setModule(moduleData);
      setCourse(courseResponse.data);

      // Preencher formulário
      setTitle(moduleData.title);
      setDescription(moduleData.description);
      setOrderIndex(moduleData.orderIndex);
    } catch (error) {
      console.error("Erro ao carregar módulo:", error);
      showNotification("error", "Erro ao carregar informações do módulo");
    } finally {
      setIsLoading(false);
    }
  };

  const showNotification = (
    type: "success" | "error" | "warning",
    message: string,
  ) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSave = async () => {
    const validation = () => {
      if (!title.trim()) {
        showNotification("error", "O título é obrigatório");
        return;
      }

      if (title.trim().length < 3) {
        showNotification("error", "O título deve ter pelo menos 3 caracteres");
        return;
      }

      if (!description.trim()) {
        showNotification("error", "A descrição é obrigatória");
        return;
      }

      if (description.trim().length < 10) {
        showNotification(
          "error",
          "A descrição deve ter pelo menos 10 caracteres",
        );
      }
      if (orderIndex < 1) {
        showNotification("error", "A ordem deve ser maior que 0");
        return;
      }

      if (!moduleId || !courseId) return;
      return;
    };

    validation();

    const payload: ModuleDTO = {
      id: Number(moduleId),
      title: title.trim(),
      description: description.trim(),
      orderIndex: orderIndex,
      courseId: Number(courseId),
    };

    try {
      setIsSaving(true);
      await ModuleTeacherApi.update(Number(moduleId), payload);
      showNotification("success", "Módulo atualizado com sucesso!");

      setTimeout(() => {
        navigate(`/teacher/modules`);
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erro ao salvar módulo:", error);
      showNotification(
        "error",
        error.response?.data?.message || "Erro ao salvar módulo",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/teacher//modules`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-3 text-text-secondary">
          <div
            className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"
            style={{ borderColor: accentColor }}
          />
          <span>Carregando módulo...</span>
        </div>
      </div>
    );
  }

  if (!module || !course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div
          className="p-4 rounded-full"
          style={{ backgroundColor: `${accentColor}15` }}
        >
          <AlertCircle size={48} style={{ color: accentColor }} />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-text-primary mb-2">
            Módulo não encontrado
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            O módulo que você está tentando editar não existe ou foi removido.
          </p>
        </div>
        <ButtonComponent onClick={() => navigate("/teacher/modules")}>
          Voltar para Cursos
        </ButtonComponent>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <Header>
        <Button
          onClick={handleCancel}
          className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Voltar para Módulos</span>
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              Editar Módulo
            </h1>
            <p className="text-sm text-text-secondary">
              Atualize as informações do módulo
            </p>
          </div>

          {/* Badge do módulo */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
            <Hash size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">
              Módulo {orderIndex}
            </span>
          </div>
        </div>
      </Header>

      {/* Info do Curso */}
      <section className="p-4 rounded-xl border bg-surface border-border">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${accentColor}15` }}
          >
            <Layers size={20} style={{ color: accentColor }} />
          </div>
          <div>
            <p className="text-xs text-text-secondary uppercase font-medium mb-0.5">
              Curso
            </p>
            <h3 className="font-semibold text-text-primary">{course.title}</h3>
          </div>
        </div>
      </section>

      {/* Notificação */}
      {notification && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            notification.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
              : notification.type === "warning"
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle
              size={20}
              className="text-green-600 dark:text-green-400"
            />
          ) : notification.type === "warning" ? (
            <AlertCircle
              size={20}
              className="text-amber-600 dark:text-amber-400"
            />
          ) : (
            <XCircle size={20} className="text-red-600 dark:text-red-400" />
          )}
          <p
            className={`text-sm font-medium ${
              notification.type === "success"
                ? "text-green-800 dark:text-green-200"
                : notification.type === "warning"
                  ? "text-amber-800 dark:text-amber-200"
                  : "text-red-800 dark:text-red-200"
            }`}
          >
            {notification.message}
          </p>
        </div>
      )}

      {/* Formulário Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Formulário */}
        <div className="lg:col-span-2 space-y-6">
          <section className="p-6 rounded-2xl border bg-surface border-border space-y-6">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <BookOpen size={20} style={{ color: accentColor }} />
              </div>
              <h3 className="font-bold text-lg">Dados do Módulo</h3>
            </div>

            {/* Título */}
            <div>
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Título do Módulo *
              </Label>
              <InputComponent
                value={title}
                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                placeholder="Ex: Fundamentos de React"
                disabled={isSaving}
              />
              <p className="text-xs text-text-secondary mt-1.5">
                Mínimo de 3 caracteres
              </p>
            </div>

            {/* Descrição */}
            <div>
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Descrição *
              </Label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o conteúdo que será abordado neste módulo..."
                disabled={isSaving}
                rows={5}
                className="w-full px-4 py-3 rounded-lg border bg-background border-border text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              />
              <div className="flex items-center justify-between mt-1.5">
                <p className="text-xs text-text-secondary">
                  Mínimo de 10 caracteres
                </p>
                <p className="text-xs text-text-secondary">
                  {description.length} caracteres
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Coluna Lateral - Configurações */}
        <div className="lg:col-span-1 space-y-6">
          {/* Ordem de Exibição */}
          <section className="p-6 rounded-2xl border bg-surface border-border space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <Hash size={20} style={{ color: accentColor }} />
              </div>
              <h3 className="font-bold text-lg">Ordenação</h3>
            </div>

            <div>
              <Label className="block text-sm font-medium text-text-secondary mb-2">
                Posição no Curso *
              </Label>
              <InputComponent
                type="number"
                min={1}
                value={orderIndex}
                onChange={(e) =>
                  setOrderIndex(
                    (e.target as HTMLInputElement).valueAsNumber || 1,
                  )
                }
                placeholder="1"
                disabled={isSaving}
              />
              <p className="text-xs text-text-secondary mt-1.5">
                Define em qual ordem este módulo aparece no curso
              </p>
            </div>
          </section>

          {/* Informações */}
          <section className="p-5 rounded-xl border bg-surface border-border">
            <div className="flex items-start gap-3">
              <div
                className="p-2 rounded-lg mt-0.5"
                style={{ backgroundColor: `${accentColor}15` }}
              >
                <FileText size={18} style={{ color: accentColor }} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-text-primary mb-2">
                  Dicas
                </h4>
                <ul className="text-xs text-text-secondary space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Use títulos claros e objetivos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>A descrição deve resumir o conteúdo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>A ordem define a sequência de aprendizado</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Botões de Ação - Fixos no rodapé */}
      <section className="sticky bottom-0 p-4 rounded-xl border bg-surface border-border shadow-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm text-text-secondary">
            Não esqueça de salvar suas alterações
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCancel}
              isDisabled={isSaving}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </Button>
            <ButtonComponent
              onClick={handleSave}
              isDisabled={
                isSaving ||
                !title.trim() ||
                title.trim().length < 3 ||
                !description.trim() ||
                description.trim().length < 10
              }
            >
              <div className="flex items-center gap-2">
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Salvando...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Salvar Alterações</span>
                  </>
                )}
              </div>
            </ButtonComponent>
          </div>
        </div>
      </section>
    </div>
  );
}
