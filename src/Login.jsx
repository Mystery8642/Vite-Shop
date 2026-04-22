import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!email || !password) {
      alert("Заполните все поля");
      return;
    }

    if (isLogin) {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        alert("Вход выполнен");
        navigate("/");
      } else {
        alert("Неверный email или пароль");
      }
    } else {
      const exists = users.find((u) => u.email === email);

      if (exists) {
        alert("Пользователь уже существует");
        return;
      }

      const newUser = { email, password };
      localStorage.setItem("users", JSON.stringify([...users, newUser]));
      alert("Регистрация успешна!");
      setIsLogin(true);
    }
  };

  return (
    <div className="center">
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={submit}>
        {isLogin ? "Войти" : "Зарегистрироваться"}
      </button>

      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer" }}>
        {isLogin
          ? "Нет аккаунта? Зарегистрироваться"
          : "Уже есть аккаунт? Войти"}
      </p>
    </div>
  );
}

export default Login;