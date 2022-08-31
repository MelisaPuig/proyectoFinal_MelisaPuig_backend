const HANDLEBARS_CART_URL = '/public/hbs/cart-table.hbs';

async function getCartHTML() {
  const cart = await getUserCart();
  const products = cart.items.map((e) => {
    return {
      ...e.product,
      count: e.count,
      total: e.count * e.product.price,
    };
  });
  const hasProducts = products.length > 0;
  const subtotals = products.map((e) => e.total);
  const total = subtotals.reduce((partialSum, a) => partialSum + a, 0);
  return renderHandlebars(HANDLEBARS_CART_URL, {
    products,
    hasProducts,
    cartId: cart._id,
    total,
  });
}

async function loadCartHTML() {
  const itemsHTML = await getCartHTML();
  const componentDiv = document.getElementById('cart__container');
  componentDiv.innerHTML = itemsHTML;
}

async function createCart() {
  let destinationAddress = '';
  do {
    destinationAddress = prompt('Es necesario crear un carrito. Diga su dirección.');
  } while (destinationAddress === '');
  const URL = '/api/carts';
  const response = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify({ destinationAddress }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const cart = getPayloadFromResponse(response);
  return cart;
}

async function getUserCart() {
  const URL = '/api/carts';
  const response = await fetch(URL);
  let cart = await getPayloadFromResponse(response);
  if (cart === null) {
    cart = await createCart();
  }
  return cart;
}

async function addProductToCart(productId, count) {
  const { _id } = await getUserCart();
  const URL = '/api/carts/:id/items'.replace(':id', _id);
  const response = await fetch(URL, {
    method: 'POST',
    body: JSON.stringify({ productId, count }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const addedProduct = await getPayloadFromResponse(response);
  alert('El producto se ha agregado con éxito.');
}

async function setProductCount(productId) {
  const { _id } = await getUserCart();
  const productCountInput = document.getElementById('product__count_to_buy');
  const count = Number.parseInt(productCountInput.value, 10);
  const URL = '/api/carts/:id/items/:productId'
    .replace(':id', _id)
    .replace(':productId', productId);
  const response = await fetch(URL, {
    method: 'PUT',
    body: JSON.stringify({ count }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await getPayloadFromResponse(response);
  alert('El producto se ha modificado con éxito.');
}

async function generateOrder() {
  const { _id } = await getUserCart();
  const URL = '/api/orders';
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  await getPayloadFromResponse(response);
  alert('Se ha generado la orden correctamente.');
  window.location.href = '/productos';
}

document.addEventListener(
  'DOMContentLoaded',
  async function () {
    // Make sure user has a cart.
    await getUserCart();
    await loadCartHTML();
  },
  false,
);
