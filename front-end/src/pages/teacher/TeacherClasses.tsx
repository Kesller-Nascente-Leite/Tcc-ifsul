/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { ButtonComponent } from "../../components/ButtonComponent";
import { InputComponent } from "../../components/InputComponent";
import { CourseApi } from "../../api/course.api";

type ClassItem = {
  id: string | number;
  title: string;
  description?: string;
};

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function TeacherClasses() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [classes, setClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    CourseApi.list()
      .then((res) => {
        const list = res.data || [];
        const mapped: ClassItem[] = list.map((c: any) => ({
          id: c.id,
          title: c.title ?? "",
          description: c.description ?? "",
        }));
        setClasses(mapped);
      })
      .catch((err) => console.error("Failed to load courses", err));
  }, []);

  const saveClass = () => {
    if (!title.trim()) return;
    const userRaw = localStorage.getItem("user");
    let teacherId: number | undefined;
    if (userRaw) {
      try {
        const u = JSON.parse(userRaw);
        teacherId = u.id;
      } catch (err) {
        console.error("Erro ao obter dados do usuário", err);
      }
    }

    if (!teacherId) {
      console.error("ID do professor não encontrado");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      published: false,
      teacherId: teacherId,
    };

    CourseApi.create(payload)
      .then((res) => {
        const created = res.data;
        const newClass: ClassItem = {
          id: created.id ?? uid(),
          title: created.title ?? title.trim(),
          description: created.description ?? description.trim(),
        };
        setClasses((s) => [newClass, ...s]);
        setTitle("");
        setDescription("");
      })
      .catch((err) => console.error("Failed to create course", err));
  };

  const deleteClass = (id: string | number) => {
    if (typeof id === "number") {
      CourseApi.remove(id)
        .then(() => setClasses((s) => s.filter((c) => c.id !== id)))
        .catch((err) => console.error("Failed to delete course", err));
    } else {
      setClasses((s) => s.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Turmas</h1>
          <p className="text-sm text-text-secondary">
            Crie e gerencie suas turmas
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-6 rounded-2xl border bg-surface border-border">
          <h3 className="font-bold mb-3">Nova Turma</h3>

          <label className="block text-sm text-text-secondary mb-1">
            Título
          </label>
          <InputComponent
            value={title}
            onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
            placeholder="Ex: Matemática - 1º Ano A"
          />

          <label className="block text-sm text-text-secondary mt-3 mb-1">
            Descrição
          </label>
          <InputComponent
            value={description}
            onChange={(e) =>
              setDescription((e.target as HTMLInputElement).value)
            }
            placeholder="Descreva a turma..."
          />

          <div className="mt-6">
            <ButtonComponent onClick={saveClass}>
              Salvar Turma
            </ButtonComponent>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl border bg-surface border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Turmas Criadas</h3>
          </div>

          {classes.length === 0 ? (
            <div className="text-text-secondary">
              Nenhuma turma criada ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/20 border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-text-primary">
                        {c.title}
                      </div>
                      {c.description && (
                        <div className="text-xs text-text-secondary">
                          {c.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <ButtonComponent size="sm">Editar</ButtonComponent>
                      <button
                        className="text-sm text-red-500"
                        onClick={() => deleteClass(c.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
