import { useEffect, useState } from "react";

function AdminPanel() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!auth) return;

    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert")
      .then((res) => res.json())
      .then((data) => {
        if (!data.meals) return;

        const savedPrices =
          JSON.parse(localStorage.getItem("adminPrices")) || {};

        const hidden =
          JSON.parse(localStorage.getItem("hiddenProducts")) || [];

        const updated = data.meals.map((p) => ({
          ...p,
          price:
            savedPrices[p.idMeal] ||
            Math.floor(Math.random() * 200) + 100,
          hidden: hidden.includes(p.idMeal),
        }));

        setProducts(updated);
      });
  }, [auth]);

  const login = () => {
    if (password === "bestcake") {
      setAuth(true);
    } else {
      alert("Неверный пароль");
    }
  };

  const changePrice = (id, newPrice) => {
    const saved =
      JSON.parse(localStorage.getItem("adminPrices")) || {};

    saved[id] = Number(newPrice);

    localStorage.setItem("adminPrices", JSON.stringify(saved));
  };

  const toggleHide = (id) => {
    let hidden =
      JSON.parse(localStorage.getItem("hiddenProducts")) || [];

    if (hidden.includes(id)) {
      hidden = hidden.filter((i) => i !== id);
    } else {
      hidden.push(id);
    }

    localStorage.setItem("hiddenProducts", JSON.stringify(hidden));

    setProducts(
      products.map((p) =>
        p.idMeal === id ? { ...p, hidden: !p.hidden } : p
      )
    );
  };

  if (!auth) {
    return (
      <div className="center">
        <h2>Admin Login</h2>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
        />
        <button onClick={login}>Войти</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Panel</h2>

      {products.map((p) => (
        <div key={p.idMeal} style={{ marginBottom: "10px" }}>
          <b>{p.strMeal}</b>

          <br />

          Цена:
          <input
            type="number"
            defaultValue={p.price}
            onBlur={(e) => changePrice(p.idMeal, e.target.value)}
          />

          <button onClick={() => toggleHide(p.idMeal)}>
            {p.hidden ? "Вернуть" : "Скрыть"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;