import { omit } from 'lodash';

import ordersDAO from '~/model/DAO/ordersDAO';
import { ProductType } from '~/types/Product';
import cartsService from './cartsService';
import productsService from './productsService';
import { NewOrderType, OrderType } from '~/types/Order';
import { CartWithProductsType } from '~/types/Cart';
import mails from './mails';

type StockType = {
  productId: string;
  stock: number;
}[];

class OrderService {
  async addByUserCart(userMail: string): Promise<OrderType> {
    try {
      const cart = await cartsService.getByUserMail(userMail);
      if (!cart) {
        throw new Error('ELEMENT_NOT_EXISTS');
      }
      if (cart.items.length === 0) {
        throw new Error('EMPTY_CART');
      }
      const products = await productsService.getAll();
      const newStocks = this._getNewStocks(products, cart);
      this._throwErrorIfInsufficentStock(newStocks);
      const newOrder = this._getOrderFromCart(userMail, cart);
      const addedOrder = await ordersDAO.add(newOrder);
      await this._updateStocks(newStocks);
      await cartsService.emptyCart(userMail, cart._id.toString());
      await this.notifyByMail(addedOrder, products);
      return addedOrder;
    } catch (error) {
      throw error;
    }
  }

  async getByUserMail(userMail: string): Promise<OrderType[]> {
    return ordersDAO.getByUserMail(userMail);
  }

  /**
   *
   * PRIVATE METHODS
   *
   */

  private _getNewStocks(products: ProductType[], cart: CartWithProductsType): StockType {
    const newStocks: StockType = [];
    cart.items.forEach((item) => {
      const { product, count } = item;
      const productId = product._id.toString();
      const foundProduct = products.find((e) => e._id.toString() === productId);
      if (!foundProduct) {
        throw new Error(`No se encuentra el producto con ID ${product._id}.`);
      }
      const { stock } = foundProduct;
      const newStock = stock - count;
      newStocks.push({ productId, stock: newStock });
    });
    return newStocks;
  }

  private _throwErrorIfInsufficentStock(newStocks: StockType): void {
    newStocks.forEach(({ productId, stock }) => {
      if (stock < 0) {
        throw new Error(`No hay suficiente stock para el producto ${productId}.`);
      }
    });
  }

  private _getOrderFromCart(userMail: string, cart: CartWithProductsType): NewOrderType {
    const items = cart.items.map((e) => {
      return { productId: e.product._id, count: e.count };
    });
    const newOrder = {
      items,
      userMail,
      date: new Date(),
      state: 'generated',
    } as const;
    return newOrder;
  }

  private async _updateStocks(newStocks: StockType): Promise<boolean> {
    try {
      const promises = newStocks.map(({ productId, stock }) => this._updateStock(productId, stock));
      await Promise.all(promises);
      return true;
    } catch (error) {
      throw error;
    }
  }

  private async _updateStock(productId: string, stock: number): Promise<ProductType> {
    try {
      const product = await productsService.getById(productId);
      const newState = omit(product, ['_id']);
      newState.stock = stock;
      return productsService.update(productId, newState);
    } catch (error) {
      throw error;
    }
  }

  private async notifyByMail(order: OrderType, products: ProductType[]): Promise<boolean> {
    try {
      const getProduct = (productId: string) =>
        products.find((e) => e._id.toString() === productId);
      const headers = ['Producto', 'Cantidad', 'Precio'];
      let html = '<p>Se ha generado el nuevo carrito de compras.</p>';
      html += `<p>Usuario: ${order.userMail}</p>`;
      html += `<p>Hora: ${order.date}</p>`;
      html += `<p>Productos</p><table border="1"><tr>`;
      headers.forEach((header) => {
        html += `<td>${header}</td>`;
      });
      html += '</tr>';
      order.items.forEach((row) => {
        const { name, price } = getProduct(row.productId.toString()) as ProductType;
        html += `<tr><td>${name}</td><td>${row.count}</td><td>$${price}</td></tr>`;
      });
      html += '</table>';
      await mails.sendMail(order.userMail, 'Nueva orden de compra', html);
      console.log(`Mail enviado a ${order.userMail}:`);
      console.log(html);
      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default new OrderService();
