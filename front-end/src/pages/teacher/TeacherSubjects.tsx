import { useEffect, useState } from "react";
import { ButtonComponent } from "../../components/ui/ButtonComponent";
import { InputComponent } from "../../components/ui/InputComponent";
import { SubjectApi } from "../../api/subject.api";

type ModuleItem = {
  id: string;
  title: string;
  description?: string;
};

type SubjectItem = {
  id: string | number;
  title: string;
  description?: string;
  modules: ModuleItem[];
};

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function TeacherSubjects() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);

  useEffect(() => {
    SubjectApi.list()
      .then((res) => {
        const list = res.data || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: SubjectItem[] = list.map((s: any) => ({
          id: s.id,
          title: s.name ?? "",
          description: s.description ?? "",
          modules: [],
        }));
        setSubjects(mapped);
      })
      .catch((err) => console.error("Failed to load subjects", err));
  }, []);

  const addModule = () => {
    if (!moduleTitle.trim()) return;
    setModules((s) => [
      ...s,
      { id: uid(), title: moduleTitle.trim(), description: moduleDesc.trim() },
    ]);
    setModuleTitle("");
    setModuleDesc("");
  };

  const removeModule = (id: string) =>
    setModules((s) => s.filter((m) => m.id !== id));

  const saveSubject = () => {
    if (!title.trim() || !color.trim()) return;
    const payload = {
      name: title.trim(),
      description: description.trim(),
      color: color.trim(),
    };
    SubjectApi.create(payload)
      .then((res) => {
        const created = res.data;
        const newSubject: SubjectItem = {
          id: created.id ?? uid(),
          title: created.name ?? title.trim(),
          description: created.description ?? description.trim(),
          modules,
        };
        setSubjects((s) => [newSubject, ...s]);
        setTitle("");
        setDescription("");
        setColor("#3B82F6");
        setModules([]);
      })
      .catch((err) => console.error("Failed to create subject", err));
  };

  const deleteSubject = (id: string | number) => {
    // attempt server delete when possible
    if (typeof id === "number") {
      SubjectApi.remove(id)
        .then(() => setSubjects((s) => s.filter((it) => it.id !== id)))
        .catch((err) => console.error("Failed to delete subject", err));
    } else {
      setSubjects((s) => s.filter((it) => it.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Materias</h1>
          <p className="text-sm text-text-secondary">
            Crie e gerencie matérias e seus módulos
          </p>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-6 rounded-2xl border bg-surface border-border">
          <h3 className="font-bold mb-3">Nova Matéria</h3>

          <label className="block text-sm text-text-secondary mb-1">
            Título
          </label>
          <InputComponent
            value={title}
            onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
          />

          <label className="block text-sm text-text-secondary mt-3 mb-1">
            Descrição
          </label>
          <InputComponent
            value={description}
            onChange={(e) =>
              setDescription((e.target as HTMLInputElement).value)
            }
          />

          <label className="block text-sm text-text-secondary mt-3 mb-1">
            Cor
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-border"
            />
            <InputComponent
              value={color}
              onChange={(e) => setColor((e.target as HTMLInputElement).value)}
              placeholder="#3B82F6"
            />
          </div>

          <div className="mt-4">
            <h4 className="font-semibold">Módulos</h4>
            <div className="mt-2 space-y-2">
              {modules.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div>
                    <div className="font-semibold text-sm text-text-primary">
                      {m.title}
                    </div>
                    {m.description && (
                      <div className="text-xs text-text-secondary">
                        {m.description}
                      </div>
                    )}
                  </div>
                  <button
                    className="text-sm text-red-500"
                    onClick={() => removeModule(m.id)}
                  >
                    Remover
                  </button>
                </div>
              ))}

              <div className="space-y-2">
                <InputComponent
                  placeholder="Título do módulo"
                  value={moduleTitle}
                  onChange={(e) =>
                    setModuleTitle((e.target as HTMLInputElement).value)
                  }
                />
                <InputComponent
                  placeholder="Descrição do módulo (opcional)"
                  value={moduleDesc}
                  onChange={(e) =>
                    setModuleDesc((e.target as HTMLInputElement).value)
                  }
                />
                <div className="flex gap-2">
                  <ButtonComponent size="sm" onClick={addModule}>
                    Adicionar módulo
                  </ButtonComponent>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <ButtonComponent onClick={saveSubject}>
              Salvar Matéria
            </ButtonComponent>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl border bg-surface border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Matérias Criadas</h3>
          </div>

          {subjects.length === 0 ? (
            <div className="text-text-secondary">
              Nenhuma matéria criada ainda.
            </div>
          ) : (
            <div className="space-y-3">
              {subjects.map((s) => (
                <div
                  key={s.id}
                  className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/20 border-border"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-text-primary">
                        {s.title}
                      </div>
                      {s.description && (
                        <div className="text-xs text-text-secondary">
                          {s.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <ButtonComponent size="sm">Editar</ButtonComponent>
                      <button
                        className="text-sm text-red-500"
                        onClick={() => deleteSubject(s.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>

                  {s.modules.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-semibold mb-2">Módulos</div>
                      <ul className="space-y-2">
                        {s.modules.map((m) => (
                          <li
                            key={m.id}
                            className="text-sm text-text-secondary"
                          >
                            • {m.title}{" "}
                            {m.description && (
                              <span className="text-xs text-text-secondary">
                                — {m.description}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
