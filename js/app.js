// Función para generar el array de productos
function generarProductos() {
    // Seleccionar todas las cards de la clase "tarjeta"
    const tarjetas = document.querySelectorAll(".tarjeta");

    // Crear un array para almacenar los productos
    const productos = [];

    // Recorrer cada tarjeta para extraer la información
    tarjetas.forEach((tarjeta, index) => {
        const id = index + 1; // Generar ID único
        const name = tarjeta.querySelector("h2")?.textContent.trim() || "Sin nombre";
        const description = tarjeta.querySelector("p")?.textContent.trim() || "Sin descripción";

        // Agregar el producto al array
        productos.push({
            id,
            Name: name,
            Description: description,
            Amount: "0", 
        });
    });

    // Mostrar el array en la consola
    console.log(productos);
}

// Llamar la función
generarProductos();
//configuracion del boton comprar para redirigir a la pagina de compra de producto
// Seleccion de todos los botones con la clase 'btn-comprar'
const botones = document.querySelectorAll('.btn-comprar');

// Agrega el evento a todos los botones
botones.forEach(boton => {
    boton.addEventListener('click', () => {
        window.location.href = '../pages/compras.html';
    });
});


//carrito de ventas de productos
// configuracion de productos con stock y dctos
const productos = {
    pretal: {
        nombre: 'Pretal',
        precio: 22,
        stock: 10,
        descuento: 0.1 
    },
    correa: {
        nombre: 'Correa',
        precio: 5,
        stock: 15,
        descuento: 0.05 
    },
    cepillo: {
        nombre: 'Cepillo',
        precio: 30,
        stock: 8,
        descuento: 0
    },
    extensible: {
        nombre: 'Extensible',
        precio: 20,
        stock: 100,
        descuento: 0.1 
    },
    alicate: {
        nombre: 'Alicate',
        precio: 15,
        stock: 150,
        descuento: 0.05 
    },
    botas: {
        nombre: 'Botas',
        precio: 300,
        stock: 28,
        descuento: 0
    },
    jaula: {
        nombre: 'Jaula',
        precio: 75,
        stock: 10,
        descuento: 0.1 
    },
    camas: {
        nombre: 'Camas',
        precio: 27,
        stock: 150,
        descuento: 0.05 
    },
    dispenser: {
        nombre: 'Dispenser',
        precio: 300,
        stock: 8,
        descuento: 0.1
    },
    comedero: {
        nombre: 'comedero',
        precio: 2,
        stock: 10,
        descuento: 0.1 
    }
    };

// Constante para el IVA
const IVA = 0.21;  // 21% de IVA

// Inicializar el carrito al cargar la página
document.addEventListener('DOMContentLoaded', cargarCarrito);

function agregarAlCarrito(nombre, precio, productoKey) {
    // Obtener el producto específico
    const producto = productos[productoKey];

    // Validar stock
    if (producto.stock <= 0) {
        alert('¡Producto agotado!');
        return;
    }

    // Obtener el carrito actual del localStorage
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Agregar nuevo producto
    carrito.push({ 
        nombre: producto.nombre, 
        precio: producto.precio,
        productoKey: productoKey
    });
    
    // Reducir stock
    producto.stock--;
    document.getElementById(`stock-${productoKey}`).textContent = producto.stock;
    
    // Guardar en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Actualizar vista del carrito
    renderizarCarrito();
}

function renderizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const subtotalCarrito = document.getElementById('subtotal-carrito');
    const descuentoCarrito = document.getElementById('descuento-carrito');
    const ivaCarrito = document.getElementById('iva-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Limpiar lista anterior
    listaCarrito.innerHTML = '';
    
    // Totales iniciales
    let subtotal = 0;
    let descuentoTotal = 0;
    
    // Renderizar cada producto
    carrito.forEach((producto, index) => {
        const productoInfo = productos[producto.productoKey];
        const li = document.createElement('li');
        
        // Calcular descuento individual
        const descuentoProducto = productoInfo.descuento * producto.precio;
        const precioConDescuento = producto.precio - descuentoProducto;
        
        li.innerHTML = `
            ${producto.nombre} - $${producto.precio} 
            ${productoInfo.descuento > 0 ? 
                `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}%: 
                -$${descuentoProducto.toFixed(2)})</span>` 
                : ''}
        `;
        
        // Botón para eliminar producto
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarDelCarrito(index);
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
        
        // Sumar al subtotal y descuentos
        subtotal += producto.precio;
        descuentoTotal += descuentoProducto;
    });
    
    // Calcular IVA
    const ivaTotal = (subtotal - descuentoTotal) * IVA;
    const total = subtotal - descuentoTotal + ivaTotal;
    
    // Actualizar totales
    subtotalCarrito.textContent = subtotal.toFixed(2);
    descuentoCarrito.textContent = descuentoTotal.toFixed(2);
    ivaCarrito.textContent = ivaTotal.toFixed(2);
    totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Recuperar el producto para devolver stock
    const producto = productos[carrito[index].productoKey];
    producto.stock++;
    document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;
    
    // Eliminar producto por índice
    carrito.splice(index, 1);
    
    // Actualizar localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    // Renderizar de nuevo
    renderizarCarrito();
}

function vaciarCarrito() {
    // Restaurar stock de todos los productos
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.forEach(item => {
        const producto = productos[item.productoKey];
        producto.stock++;
        document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock;
    });
    
    // Limpiar localStorage
    localStorage.removeItem('carrito');
    
    // Renderizar
    renderizarCarrito();
}

function cargarCarrito() {
    // Cargar carrito al iniciar la página
    renderizarCarrito();
}

// Funciones de Checkout
function mostrarCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Validar que hay productos en el carrito
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Mostrar modal de checkout
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'flex';
    
    // Actualizar totales en el modal
    const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
    const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
    const iva = parseFloat(document.getElementById('iva-carrito').textContent);
    const total = parseFloat(document.getElementById('total-carrito').textContent);
    
    document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('modal-descuento').textContent = descuento.toFixed(2);
    document.getElementById('modal-iva').textContent = iva.toFixed(2);
    document.getElementById('modal-total').textContent = total.toFixed(2);
}

function realizarCompra() {
    // Simular compra
    alert('¡Compra realizada con éxito!');
    
    // Vaciar carrito
    localStorage.removeItem('carrito');
    
    // Cerrar modal
    cerrarCheckout();
    
    // Renderizar carrito vacío
    renderizarCarrito();
}

function cerrarCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}
    
   
    
    