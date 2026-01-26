import { Link } from "react-router";

export function Login() {
  return (
    <div className="container">
      <h1>
        Hello, World
        <br />
      </h1>
      <Link to={"/register"}>
        <button>Cadastre-se</button>
      </Link>
    </div>
  );
}
