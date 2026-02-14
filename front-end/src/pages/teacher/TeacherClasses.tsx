import { useEffect, useState } from "react";
import { ButtonComponent } from "../../components/ButtonComponent";
import { InputComponent } from "../../components/InputComponent";

type ModuleItem = {
  id: string;
  title: string;
  description?: string;
};

type ClassItem = {
  id: string;
  title: string;
  subject?: string;
  students?: number;
  description?: string;
  modules: ModuleItem[];
};

const STORAGE_KEY = "teacher_classes";

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function TeacherClasses() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [students, setStudents] = useState<string>("");
  const [description, setDescription] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleDesc, setModuleDesc] = useState("");
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setClasses(JSON.parse(raw));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
  }, [classes]);

  const addModule = () => {
    if (!moduleTitle.trim()) return;
    setModules((s) => [...s, { id: uid(), title: moduleTitle.trim(), description: moduleDesc.trim() }]);
    setModuleTitle("");
    setModuleDesc("");
  };

  const removeModule = (id: string) => setModules((s) => s.filter((m) => m.id !== id));

  const saveClass = () => {
    if (!title.trim()) return;
    const newClass: ClassItem = {
      id: uid(),
      title: title.trim(),
      subject: subject.trim() || undefined,
      students: students ? Number(students) : undefined,
      description: description.trim(),
      modules,
    };
    setClasses((s) => [newClass, ...s]);
    setTitle("");
    setSubject("");
    setStudents("");
    setDescription("");
    setModules([]);
  };

  const deleteClass = (id: string) => setClasses((s) => s.filter((c) => c.id !== id));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Turmas</h1>
          <p className="text-sm text-text-secondary">Crie e gerencie suas turmas</p>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 p-6 rounded-2xl border bg-surface border-border">
          <h3 className="font-bold mb-3">Nova Turma</h3>

          <label className="block text-sm text-text-secondary mb-1">Título</label>
          <InputComponent value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} />

          <label className="block text-sm text-text-secondary mt-3 mb-1">Matéria</label>
          <InputComponent value={subject} onChange={(e) => setSubject((e.target as HTMLInputElement).value)} placeholder="Ex: Matemática - 1º Ano A" />

          <label className="block text-sm text-text-secondary mt-3 mb-1">Número de alunos</label>
          <InputComponent value={students} onChange={(e) => setStudents((e.target as HTMLInputElement).value)} type="number" />

          <label className="block text-sm text-text-secondary mt-3 mb-1">Descrição</label>
          <InputComponent value={description} onChange={(e) => setDescription((e.target as HTMLInputElement).value)} />

          <div className="mt-4">
            <h4 className="font-semibold">Módulos</h4>
            <div className="mt-2 space-y-2">
              {modules.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-semibold text-sm text-text-primary">{m.title}</div>
                    {m.description && <div className="text-xs text-text-secondary">{m.description}</div>}
                  </div>
                  <button className="text-sm text-red-500" onClick={() => removeModule(m.id)}>Remover</button>
                </div>
              ))}

              <div className="space-y-2">
                <InputComponent placeholder="Título do módulo" value={moduleTitle} onChange={(e) => setModuleTitle((e.target as HTMLInputElement).value)} />
                <InputComponent placeholder="Descrição do módulo (opcional)" value={moduleDesc} onChange={(e) => setModuleDesc((e.target as HTMLInputElement).value)} />
                <div className="flex gap-2">
                  <ButtonComponent size="sm" onClick={addModule}>Adicionar módulo</ButtonComponent>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <ButtonComponent onClick={saveClass}>Salvar Turma</ButtonComponent>
          </div>
        </div>

        <div className="lg:col-span-2 p-6 rounded-2xl border bg-surface border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Turmas Criadas</h3>
          </div>

          {classes.length === 0 ? (
            <div className="text-text-secondary">Nenhuma turma criada ainda.</div>
          ) : (
            <div className="space-y-3">
              {classes.map((c) => (
                <div key={c.id} className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900/20 border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-text-primary">{c.title}</div>
                      {c.subject && <div className="text-xs text-text-secondary">{c.subject}</div>}
                      {c.description && <div className="text-xs text-text-secondary">{c.description}</div>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="text-sm text-text-secondary">{c.students ?? "—"} alunos</div>
                      <div className="flex items-center gap-2">
                        <ButtonComponent size="sm">Editar</ButtonComponent>
                        <button className="text-sm text-red-500" onClick={() => deleteClass(c.id)}>Excluir</button>
                      </div>
                    </div>
                  </div>

                  {c.modules.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-semibold mb-2">Módulos</div>
                      <ul className="space-y-2">
                        {c.modules.map((m) => (
                          <li key={m.id} className="text-sm text-text-secondary">• {m.title} {m.description && <span className="text-xs text-text-secondary">— {m.description}</span>}</li>
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
