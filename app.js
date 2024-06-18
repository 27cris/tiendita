//Selecciona elementos HTML que se van a manipular
let listProductHTML = document.querySelector('.lista-productos');
let listCartHTML = document.querySelector('.lista-carrito');
let iconCart = document.querySelector('.icono-carrito');
let iconCartSpan = document.querySelector('.icono-carrito span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.cerrar');

// Inicializa arrays vacíos para productos y carrito
let products = [];
let cart = [];

// Añade un event listener al ícono del carrito para mostrar/ocultar el carrito al hacer clic
iconCart.addEventListener('click', () => {
    body.classList.toggle('mostrarCarrito');
});

// Añade un event listener al botón de cerrar para mostrar/ocultar el carrito al hacer clic
closeCart.addEventListener('click', () => {
    body.classList.toggle('mostrarCarrito');
});

// Función para agregar datos de productos al HTML
const addDataToHTML = () => {
    // Si hay productos, los recorre y agrega al HTML
    if(products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="precio">$${product.price}</div>
            <button class="agregarCarrito">Agregar al Carrito</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

// Añade un event listener a la lista de productos para agregar productos al carrito al hacer clic en el botón
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('agregarCarrito')){
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

// Función para agregar productos al carrito
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};

// Guarda el carrito en el almacenamiento local
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Función para actualizar el HTML del carrito
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="imagen">
                <img src="${info.image}">
            </div>
            <div class="nombre">
                ${info.name}
            </div>
            <div class="precioTotal">$${info.price * item.quantity}</div>
            <div class="cantidad">
                <span class="menos"><</span>
                <span>${item.quantity}</span>
                <span class="mas">></span>
            </div>
            `;
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

// Añade un event listener a la lista del carrito para cambiar la cantidad de productos al hacer clic en los botones
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('menos') || positionClick.classList.contains('mas')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('mas') ? 'mas' : 'menos';
        changeQuantityCart(product_id, type);
    }
});

// Función para cambiar la cantidad de productos en el carrito
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        if(type === 'mas') {
            cart[positionItemInCart].quantity += 1;
        } else {
            let changeQuantity = cart[positionItemInCart].quantity - 1;
            if (changeQuantity > 0) {
                cart[positionItemInCart].quantity = changeQuantity;
            } else {
                cart.splice(positionItemInCart, 1);
            }
        }
    }
    addCartToHTML();
    addCartToMemory();
};

// Función para inicializar la aplicación
const initApp = () => {
    // Obtiene los datos de los productos desde un archivo JSON
    fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

        // Obtiene los datos del carrito desde el almacenamiento local
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    });
};


// Llama a la función para inicializar la aplicación
initApp();
