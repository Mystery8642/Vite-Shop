import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("currentUser"))
  );

  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert")
      .then((res) => res.json())
      .then((data) => {
        if (!data.meals) return;

        const savedPrices =
          JSON.parse(localStorage.getItem("adminPrices")) || {};

        const hiddenProducts =
          JSON.parse(localStorage.getItem("hiddenProducts")) || [];

        const productsWithPrice = data.meals
          .filter((p) => !hiddenProducts.includes(p.idMeal))
          .map((p) => ({
            ...p,
            price:
              savedPrices[p.idMeal] ||
              Math.floor(Math.random() * 200) + 100,
          }));

        setProducts(productsWithPrice);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.idMeal);

    if (exists) {
      setCart(
        cart.map((item) =>
          item.id === product.idMeal
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.idMeal,
          name: product.strMeal,
          image: product.strMealThumb,
          price: product.price,
          quantity: 1,
        },
      ]);
    }
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <div>
      <header>
        <h1>Кондитерские изделия</h1>

        <div className="top-bar">
          <input
            className="search"
            placeholder="Поиск десертов"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button onClick={() => navigate("/about")}>About</button>
          <button onClick={() => navigate("/admin")}>Admin</button>

          <button>
            Корзина ({cart.reduce((s, i) => s + i.quantity, 0)})
          </button>

          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <button onClick={() => navigate("/login")}>Login</button>
          )}
        </div>
      </header>

      <section id="menu">
        {products
          .filter((p) =>
            p.strMeal.toLowerCase().includes(search.toLowerCase())
          )
          .map((product) => (
            <div
              className="card"
              key={product.idMeal}
              onClick={() => navigate(`/product/${product.idMeal}`)}
            >
              <img src={product.strMealThumb} alt="" />
              <h3>{product.strMeal}</h3>
              <p>{product.price} сом</p>

              <button
                onClick={(e) => {
                  e.stopPropagation(); 
                  addToCart(product);
                }}
              >
                Добавить в корзину
              </button>
            </div>
          ))}
      </section>
    </div>
  );
}

export default App;