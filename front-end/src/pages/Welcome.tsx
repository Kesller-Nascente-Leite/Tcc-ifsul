import { Link } from "react-router";

export function Welcome() {
  return (
    <div className="container">
      <Link to={"/login"}>
        <button>Login</button>
      </Link>
    </div>
  );
}
