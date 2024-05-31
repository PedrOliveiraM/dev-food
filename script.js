const menu = document.getElementById('menu'); // menu
const cartItems = document.getElementById('card-items'); // itens dentro do modal
const cartBtn = document.getElementById('cart-btn'); // botao footer
const cartModal = document.getElementById('cart-modal'); // modal
const cartTotal = document.getElementById('card-total'); // total no modal
const closeModalBtn = document.getElementById('close-modal-btn'); // botao fechar modal
const checkoutBtn = document.getElementById('checkout-btn'); // botao finalizar compra
const cartCount = document.getElementById('cart-count'); // contador de itens no botao footer
const addressInput = document.getElementById('address-input'); // input endereco
const addressWarning = document.getElementById('address-warn'); // warning endereco
const nameInput = document.getElementById('name-input'); // input nome
const nameWarning = document.getElementById('name-warn'); // warning nome

// variaveis

let listCart = [];

// função abrir o modal quando clicar no "Meu carrinho"
cartBtn.addEventListener('click', () => {
  uptadeCart();
  //tenho que adicionar a classe flex
  cartModal.classList.add('flex');
  // remover a classe hidden
  cartModal.classList.remove('hidden');
});

// Função fechar modal ao clicar fora
cartModal.addEventListener('click', (e) => {
  if (e.target === cartModal) {
    cartModal.classList.remove('flex');
    cartModal.classList.add('hidden');
  }
});

// função fechar o modal quando clicar no "fechar"
closeModalBtn.addEventListener('click', () => {
  //tenho que remover a classe flex
  cartModal.classList.remove('flex');
  // adicionar a classe hidden
  cartModal.classList.add('hidden');
});

// função evento no input
addressInput.addEventListener('input', (e) => {
  let inputValue = e.target.value;
  if (inputValue !== '') {
    addressWarning.classList.add('hidden');
    addressInput.classList.remove('border-red-500');
  }
});
nameInput.addEventListener('input', (e) => {
  let inputValue = e.target.value;
  if (inputValue !== '') {
    nameWarning.classList.add('hidden');
    nameInput.classList.remove('border-red-500');
  }
});

// verificando campo do endereço e emitindo alerta
// botao checkout
checkoutBtn.addEventListener('click', () => {
  if (checkRestaurantOpen()) {
    Toastify({
      text: 'Opss! O restaurante está fechado! 🕒🔒',
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'center', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'red',
      },
      onClick: function () {}, // Callback after click
    }).showToast();
    return;
  }
  if (listCart.length === 0) {
    Toastify({
      text: 'Opa! Você esqueceu de adicionar itens ao carrinho! 🛒🤔',
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'center', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: 'gray',
      },
      onClick: function () {}, // Callback after click
    }).showToast();
    return;
  }
  if (nameInput.value == '') {
    nameWarning.classList.remove('hidden');
    nameInput.classList.add('border-red-500');
    return;
  }
  if (addressInput.value == '') {
    addressWarning.classList.remove('hidden');
    addressInput.classList.add('border-red-500');
    return;
  }

  const name = nameInput.value;
  const cart = listCart
    .map((item) => {
      return `- ${item.quantity}x ${item.name} (R$ ${item.price.toFixed(2)})`;
    })
    .join('\n');

  const total = listCart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);

  const message = encodeURIComponent(
    `Olá, me chamo ${name} e gostaria de fazer um pedido:\n\n${cart}\n\nTotal: R$ ${total}\n\nEndereço: ${addressInput.value}`
  );
  const phone = '62998092832';

  window.open(`http://wa.me/+55${phone}?text=${message}`, '_blank');

  listCart = [];
  total = 0;
  uptadeCart();
});

function checkRestaurantOpen() {
  const date = new Date();
  const hour = date.getHours();
  return hour >= 15 && hour <= 23;
}

// botao item e mostrando no modal
// para pegar um item que foi clicado ( e.target )
// pegar um item que foi clicado e tem uma classe ( e.target.closest('.nome-da-classe') )

menu.addEventListener('click', (e) => {
  let parentButton = e.target.closest('.add-to-cart-btn');
  if (parentButton) {
    const dataName = parentButton.getAttribute('data-name');
    const dataPrice = parseFloat(parentButton.getAttribute('data-price'));
    addToCart(dataName, dataPrice);
  }
});

//Adicionando no carrinho
function addToCart(name, price) {
  // verificar se item ja existe

  const existItem = listCart.find((item) => item.name === name);

  if (existItem) {
    existItem.quantity++;
  } else {
    listCart.push({
      name,
      price,
      quantity: 1,
    });
  }

  console.log(listCart);
  uptadeCart();
}

// atualizando o carrinho
function uptadeCart() {
  // zerar html
  cartItems.innerHTML = '';
  // var total
  let total = 0;
  let cont = 0;

  // para cada item faça
  listCart.forEach((item) => {
    // criei uma nova div
    const cartItemElements = document.createElement('div');

    cartItemElements.classList.add(
      'flex',
      'justify-between',
      'flex-col',
      'mb-4'
    );

    cartItemElements.innerHTML = `
    <div class="flex items-center justify-between">
        <div class="flex flex-col gap-2 mt-4">
            <p class="flex gap-2 font-medium">
                ${item.name}
            </p>
            <p class="mt-1">R$ ${item.price.toFixed(2)}</p>
        </div>
        <div class="flex items-center gap-2">
            <button class="remove-item-btn" data-name="${item.name}">
                <i class="fa-solid fa-minus w-6 h-6 hover:scale-110 duration-300"></i>
            </button>
            <span class="font-bold">${item.quantity}</span>
            <button class="add-item-btn" data-name="${item.name}">
                <i class="fa-solid fa-plus w-6 h-6 hover:scale-110 duration-300" ></i>
            </button>
        </div>
    </div>
    <hr class="mt-2">`;

    if (listCart.length === 0) total = 0;

    total += item.price * item.quantity;
    cont += item.quantity;
    // adicionar no html
    cartItems.appendChild(cartItemElements);
    cartTotal.innerHTML = `Total: R$ ${total}`;
  });

  // atualizar contador
  cartCount.innerHTML = cont;
}

// remover item do carrinho
cartItems.addEventListener('click', (e) => {
  let parentButton = e.target.closest('.remove-item-btn');
  if (parentButton) {
    const nameItem = parentButton.getAttribute('data-name');
    existItem = listCart.find((item) => item.name === nameItem);
    if (existItem) {
      existItem.quantity--;
      if (existItem.quantity === 0) {
        listCart = listCart.filter((item) => item.name !== nameItem);
      }
    }
  }
  uptadeCart();
});
// adicionar + 1 item
cartItems.addEventListener('click', (e) => {
  let parentButton = e.target.closest('.add-item-btn');
  if (parentButton) {
    const nameItem = parentButton.getAttribute('data-name');
    existItem = listCart.find((item) => item.name === nameItem);
    if (existItem) {
      existItem.quantity++;
    }
  }
  uptadeCart();
});

// verificação para mudar a cor do horário do restaurante
const restaurantHours = document.getElementById('date-span');
if (checkRestaurantOpen()) {
  restaurantHours.classList.remove('bg-red-600');
  restaurantHours.classList.add('bg-green-500');
} else {
  restaurantHours.classList.remove('bg-green-600');
  restaurantHours.classList.add('bg-red-500');
}
