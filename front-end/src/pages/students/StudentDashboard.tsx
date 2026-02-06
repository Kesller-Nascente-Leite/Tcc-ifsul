import { useEffect, useState } from "react";
import type { User } from "../../types/User";
export function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(savedUser));
    }
  }, []);
  return (
    <h1>
      Seja bem vindo ao dashboard dos estudantes{" "}
      <strong>{user ? user.fullName : "Carregando..."}</strong>
    </h1>
  );
}
