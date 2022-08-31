const HANDLEBARS_PRODUCTS_URL = '/public/hbs/products-table.hbs';

async function getProductsHTML(categories, products, chosenCategory) {
  const hasProducts = products.length > 0;
  const productsWithStock = products.map((e) => ({ ...e, hasStock: e.stock > 0 }));
  const categoriesWithSelection = categories.map((e) => ({
    value: e,
    selected: e === chosenCategory,
  }));
  return renderHandlebars(HANDLEBARS_PRODUCTS_URL, {
    categories: categoriesWithSelection,
    products: productsWithStock,
    hasProducts,
  });
}

function getChosenCategory() {
  const componentDiv = document.getElementById('products__categories');
  if (!componentDiv) {
    return '';
  }
  return componentDiv.value;
}

async function getCategories() {
  const URL = '/api/products/categories';
  const response = await fetch(URL);
  return getPayloadFromResponse(response);
}

async function getProducts(category) {
  let URL = `/api/products`;
  if (category) {
    URL = `/api/products/category/${category}`;
  }
  const response = await fetch(URL);
  return getPayloadFromResponse(response);
}

async function loadProducts() {
  const chosenCategory = getChosenCategory();
  const categories = await getCategories();
  const products = await getProducts(chosenCategory);
  const productsHTML = await getProductsHTML(categories, products, chosenCategory);
  const componentDiv = document.getElementById('products__container');
  componentDiv.innerHTML = productsHTML;
}

async function addToCart(productId) {
  const URL = '/api/carts';
  const response = await fetch(URL);
  const products = await getPayloadFromResponse(response);
  const productsHTML = await getProductsHTML(products);
  const componentDiv = document.getElementById('products__container');
  componentDiv.innerHTML = productsHTML;
}

document.addEventListener(
  'DOMContentLoaded',
  async function () {
    loadProducts();
  },
  false,
);
