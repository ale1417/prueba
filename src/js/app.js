let carrito = [];
const productosContainer = document.getElementById("productos-container");
const carritoContainer = document.getElementById("carrito-items");
const btnCarrito = document.getElementById("btnCarrito");
const carritoAside = document.getElementById("carrito");
const cerrarCarrito = document.getElementById("cerrarCarrito");
const contadorCarrito = document.getElementById("contadorCarrito");
const totalCarrito = document.getElementById("total");
const checkoutBtn = document.getElementById("checkout");

let dataPath = "src/data/data.json";
if (
  !(
    window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("127.0.0.1")
  )
) {
  dataPath = "./src/data/data.json";
}

fetch(dataPath)
  .then((res) => res.json())
  .then((data) => mostrarProductos(data))
  .catch((err) => console.error("Error cargando productos:", err));

function mostrarProductos(productos) {
  productos.forEach((prod) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <img src="${prod.img}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar</button>
    `;
    productosContainer.appendChild(div);
  });
}

window.agregarAlCarrito = function (id) {
  fetch(dataPath)
    .then((res) => res.json())
    .then((productos) => {
      const producto = productos.find((p) => p.id === id);
      const existe = carrito.find((item) => item.id === id);

      if (existe) {
        existe.cantidad++;
      } else {
        carrito.push({ ...producto, cantidad: 1 });
      }

      Swal.fire({
        icon: "success",
        title: producto.nombre,
        text: "Agregado al carrito",
        timer: 1200,
        showConfirmButton: false,
      });

      actualizarCarrito();
    });
};

function actualizarCarrito() {
  carritoContainer.innerHTML = "";
  let total = 0;

  carrito.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${item.nombre} - $${item.precio} x ${item.cantidad}</p>
      <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
      <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
      <button onclick="eliminarProducto(${item.id})">Eliminar</button>
    `;
    carritoContainer.appendChild(div);
    total += item.precio * item.cantidad;
  });

  contadorCarrito.textContent = carrito.reduce(
    (acc, prod) => acc + prod.cantidad,
    0
  );
  totalCarrito.textContent = `Total: $${total}`;
}

window.cambiarCantidad = function (id, cambio) {
  const item = carrito.find((p) => p.id === id);
  if (item) {
    item.cantidad += cambio;
    if (item.cantidad <= 0) eliminarProducto(id);
  }
  actualizarCarrito();
};

window.eliminarProducto = function (id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "Este producto será eliminado del carrito",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      carrito = carrito.filter((item) => item.id !== id);
      Swal.fire("Eliminado", "Producto eliminado del carrito", "success");
      actualizarCarrito();
    }
  });
};

checkoutBtn.addEventListener("click", () => {
  if (carrito.length === 0) {
    Swal.fire(
      "Carrito vacío",
      "Agregá algún producto antes de continuar",
      "warning"
    );
  } else {
    let resumen = carrito
      .map(
        (item) =>
          `${item.nombre} - ${item.cantidad} x $${item.precio} = $${
            item.cantidad * item.precio
          }`
      )
      .join("<br>");
    let total = carrito.reduce(
      (acc, prod) => acc + prod.precio * prod.cantidad,
      0
    );

    Swal.fire({
      title: "Resumen de tu compra",
      html: `${resumen}<br><br><strong>Total: $${total}</strong>`,
      confirmButtonText: "Finalizar",
    }).then(() => {
      carrito = [];
      actualizarCarrito();
    });
  }
});

btnCarrito.addEventListener("click", () => {
  carritoAside.classList.remove("hidden");
});

cerrarCarrito.addEventListener("click", () => {
  carritoAside.classList.add("hidden");
});
