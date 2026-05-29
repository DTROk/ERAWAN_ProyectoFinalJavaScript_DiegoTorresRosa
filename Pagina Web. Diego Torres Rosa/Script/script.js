//Los avisos que salen por pantalla con su tiempo de aparición

function dispararAviso(texto) {
    var contenedor = document.querySelector('.contenedor-avisos');
    if (!contenedor) return;

    const aviso = document.createElement('div');
    aviso.className = 'aviso-individual';
    aviso.innerText = texto;
    contenedor.appendChild(aviso);

    setTimeout(() => {
        aviso.style.animation = 'desaparecer 0.3s ease-in forwards';
        setTimeout(() => aviso.remove(), 300);
    }, 3000);
}


//Funciones del modo oscuro

function inicializarModoOscuro() {
    const btn = document.getElementById("btn-dark-mode");
    if (!btn) return;

    const yaActivo = localStorage.getItem('darkMode') === 'true';
    if (yaActivo) {
        document.body.classList.add("dark-mode");
        btn.textContent = "ON";
        btn.classList.add("on");
    }

    btn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const activo = document.body.classList.contains("dark-mode");
        localStorage.setItem('darkMode', activo);
        btn.textContent = activo ? "ON" : "OFF";
        btn.classList.toggle("on", activo);
    });
}


//Banner de cookies

function inicializarBannerCookies() {
    const banner = document.getElementById("cookie-banner");
    const btnAceptar = document.getElementById("btn-accept-cookies");

    if (localStorage.getItem('cookiesAceptadas') === 'true') {
        if (banner) banner.style.display = 'none';
        return;
    }

    if (btnAceptar) {
        btnAceptar.addEventListener("click", () => {
            if (banner) {
                banner.style.display = 'none';
                localStorage.setItem('cookiesAceptadas', 'true');
            }
        });
    }
}


//Inicios de sesión y autenticaciones

function mostrarNombreUsuario() {
    const display = document.getElementById('nombre-usuario-display');
    const usuario = localStorage.getItem('usuarioRegistrado');
    if (display && usuario) display.textContent = usuario;
}

function inicializarFormularioRegistro() {
    const checkPrivacidad = document.getElementById('check-privacidad');
    const btnRegistrar = document.getElementById('btn-registrar');
    const camposRequeridos = document.querySelectorAll('input[required]');

    if (!checkPrivacidad || !btnRegistrar) return;

    function validarFormulario() {
        const todosLlenos = Array.from(camposRequeridos).every(i => i.value.trim() !== "");
        btnRegistrar.disabled = !(todosLlenos && checkPrivacidad.checked);
    }

    camposRequeridos.forEach(input => input.addEventListener('input', validarFormulario));
    checkPrivacidad.addEventListener('change', validarFormulario);

    btnRegistrar.addEventListener("click", () => {
        const usuario = document.getElementById('usuario').value;
        const pass = document.getElementById('password').value;
        localStorage.setItem('usuarioRegistrado', usuario);
        localStorage.setItem('passRegistrada', pass);
        alert("Registro exitoso.");
        window.location.href = 'InicioSesion.html';
    });
}

function verificarLogin() {
    const userIngresado = document.getElementById('usuario-login').value;
    const passIngresada = document.getElementById('password-login').value;
    const userGuardado = localStorage.getItem('usuarioRegistrado');
    const passGuardada = localStorage.getItem('passRegistrada');

    if (userIngresado === userGuardado && passIngresada === passGuardada) {
        window.location.href = 'PagWeb2.html';
    } else {
        alert("Usuario o contraseña incorrectos.");
    }
}

function enviarRecuperacion() {
    const inputCorreo = document.querySelector('input[placeholder="Correo electrónico"]');
    const correo = inputCorreo ? inputCorreo.value : "";

    if (correo.trim() === "") {
        alert("Por favor, ingresa tu dirección de correo electrónico.");
    } else {
        alert("Revise su correo electrónico para iniciar el proceso de recuperación de contraseñas.");
        window.location.href = "InicioSesion.html";
    }
}


//Funciones del carrito

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carrito')) || [];
}

function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio, imagen, boton) {
    const tarjeta = boton.closest('.tarjeta-producto');
    const selectores = tarjeta.querySelectorAll('.selector-talla');

    for (const select of selectores) {
        if (select.value === "") {
            dispararAviso("Error: le falta seleccionar tallas, medidas o onzas");
            return;
        }
    }

    const carrito = obtenerCarrito();
    carrito.push({ nombre, precio: parseFloat(precio), imagen, cantidad: 1 });
    guardarCarrito(carrito);
    dispararAviso("Producto agregado correctamente");
    actualizarContadorCarrito();
}

function cargarCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.getElementById('lista-carrito');
    const totalEl = document.getElementById('total-carrito');
    const selectZona = document.getElementById('zona-envio');

    if (!contenedor) return;

    contenedor.innerHTML = "";
    let subtotal = 0;

    carrito.forEach((item, index) => {
        const precio = parseFloat(item.precio);
        const cantidad = parseInt(item.cantidad);
        subtotal += precio * cantidad;
        contenedor.innerHTML +=
            '<div class="item-carrito">' +
            '<img src="' + item.imagen + '">' +
            '<div style="flex-grow: 1;">' +
            '<strong>' + item.nombre + ' - ' + precio.toFixed(2) + '€ x ' + cantidad + '</strong>' +
            '</div>' +
            '<button onclick="eliminarDelCarrito(' + index + ')">Eliminar</button>' +
            '</div>';
    });
    const gastosEnvio = selectZona ? parseFloat(selectZona.value) : 0;
    if (totalEl) {
        totalEl.innerText = 'Total: ' + (subtotal + gastosEnvio).toFixed(2) + '€';
    }
}

function eliminarDelCarrito(index) {
    const carrito = obtenerCarrito();
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    cargarCarrito();
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const carrito = obtenerCarrito();
    const contadorEl = document.getElementById('contador-carrito');

    if (contadorEl) {
        let total = 0;
        for (let i = 0; i < carrito.length; i++) {
            total += parseInt(carrito[i].cantidad);
        }
        contadorEl.innerText = total;
    }
}


//Funciones de descuento

function aplicarDescuento() {
    const carrito = obtenerCarrito();
    const codigo = document.getElementById('codigo-descuento').value;
    const totalEl = document.getElementById('total-carrito');

    let subtotal = 0;
    for (let i = 0; i < carrito.length; i++) {
        subtotal += parseFloat(carrito[i].precio) * parseInt(carrito[i].cantidad);
    }

    if (codigo.toUpperCase() === "ERAWAN10") {
        subtotal *= 0.9;
        alert("¡Descuento del 10% aplicado!");
    } else {
        alert("Código no válido.");
        return;
    }

    const costoEnvio = parseFloat(localStorage.getItem('costoEnvio')) || 0;
    if (totalEl) {
        totalEl.innerText = 'Total: ' + (subtotal + costoEnvio).toFixed(2) + '€';
    }
}


//Funciones de envío

function calcularConEnvio() {
    const carrito = obtenerCarrito();
    const selectZona = document.getElementById('zona-envio');
    const totalEl = document.getElementById('total-carrito');

    let subtotal = 0;
    carrito.forEach(item => {
        subtotal += parseFloat(item.precio);
    });

    const zona = selectZona ? selectZona.value : "0";

    const costosEnvio = {
        peninsula: 15,
        baleares: 18
    };

    const costoEnvio = costosEnvio[zona] ?? 0;

    localStorage.setItem('costoEnvio', costoEnvio);
    if (totalEl) {
        totalEl.innerText = 'Total: ' + (subtotal + costoEnvio).toFixed(2) + '€';
    }
}


//Funciones de compras y pagos

function verificarCompra() {
    const carrito = obtenerCarrito();
    const selectZona = document.getElementById('zona-envio');
    const zona = selectZona ? selectZona.value : "0";
    const provincia = document.getElementById('provincia').value;
    const codPostal = document.getElementById('codigo-postal').value;
    const direccion = document.getElementById('direccion-calle').value;

    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return false;
    }

    if (zona === "0") {
        alert("Por favor, selecciona una zona de envío.");
        return false;
    }

    if ([provincia, codPostal, direccion].some(v => v.trim() === "")) {
        alert("Por favor, rellena todos los campos de envío.");
        return false;
    }

    localStorage.setItem('zonaSeleccionada', zona);
    window.location.href = "Pago.html";
}

function irAPago() {
    const totalEl = document.getElementById('total-carrito');
    sessionStorage.setItem('totalFinal', totalEl ? totalEl.innerText : "");
    window.location.href = "Pago.html";
}

function procesarPago() {
    const campos = [
        document.querySelector('input[placeholder="Nombre en la tarjeta"]').value,
        document.querySelector('input[placeholder="Número de tarjeta"]').value,
        document.querySelector('input[placeholder="MM/AA"]').value,
        document.querySelector('input[placeholder="CVC"]').value,
    ];

    if (campos.some(c => c.trim() === "")) {
        alert("Por favor, rellena todos los campos bancarios para continuar.");
        return false;
    }

    const zona = localStorage.getItem('zonaSeleccionada');

    const mensajes = {
        canarias: "Envío a Islas Canarias seleccionado. El tiempo de entrega es de 2-4 días hábiles.",
        peninsula: "Envío a Península seleccionado. El tiempo de entrega es de 7-10 días hábiles.",
        baleares: "Envío a Baleares seleccionado. El tiempo de entrega es de 10-15 días hábiles.",
    };

    alert(mensajes[zona] || "Pedido procesado correctamente.");
    window.location.href = "PagWeb2.html";
}


//Funciones de inicialización 

document.addEventListener("DOMContentLoaded", function () {
    inicializarModoOscuro();
    inicializarBannerCookies();
    mostrarNombreUsuario();
    inicializarFormularioRegistro();
    actualizarContadorCarrito();
});

window.addEventListener('load', function () {
    const banner = document.getElementById('cookie-banner');
    const btn = document.getElementById('btn-accept-cookies');

    if (localStorage.getItem('cookiesAceptadas') === 'true') {
        if (banner) banner.style.display = 'none';
    }

    if (btn) {
        btn.onclick = function () {
            if (banner) {
                banner.style.display = 'none';
                localStorage.setItem('cookiesAceptadas', 'true');
            }
        };
    }
});