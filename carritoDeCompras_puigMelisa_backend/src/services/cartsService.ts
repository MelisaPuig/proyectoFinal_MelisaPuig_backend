import { isNull } from 'lodash';
import cartsDAO from '~/model/DAO/cartsDAO';
import { NewCartType, CartType, CartItemType, CartWithProductsType } from '~/types/Cart';

class CartsService {
  async getByUserMail(userMail: string): Promise<CartWithProductsType | null> {
    return cartsDAO.getByUserMail(userMail);
  }

  async newCart(userMail: string, newCartInfo: NewCartType): Promise<CartType> {
    try {
      const existingCart = await this.getByUserMail(userMail);
      if (!isNull(existingCart)) {
        throw new Error(`User ${userMail} already have a cart.`);
      }
      return cartsDAO.newCart(newCartInfo);
    } catch (error) {
      throw error;
    }
  }

  async delete(userMail: string, cartId: string): Promise<boolean> {
    try {
      await this._throwErrorIfUserCartNotExists(userMail, cartId);
      return cartsDAO.delete(cartId);
    } catch (error) {
      throw error;
    }
  }

  async addItem(
    userMail: string,
    cartId: string,
    newItem: CartItemType,
  ): Promise<CartWithProductsType> {
    try {
      await this._throwErrorIfUserCartNotExists(userMail, cartId);
      return cartsDAO.addItem(cartId, newItem);
    } catch (error) {
      throw error;
    }
  }

  async updateItemCount(
    userMail: string,
    cartId: string,
    productId: string,
    count: number,
  ): Promise<CartWithProductsType> {
    try {
      await this._throwErrorIfUserCartNotExists(userMail, cartId);
      return cartsDAO.updateItemCount(cartId, productId, count);
    } catch (error) {
      throw error;
    }
  }

  async removeItem(
    userMail: string,
    cartId: string,
    itemIndex: number,
  ): Promise<CartWithProductsType> {
    try {
      await this._throwErrorIfUserCartNotExists(userMail, cartId);
      return cartsDAO.removeItem(cartId, itemIndex);
    } catch (error) {
      throw error;
    }
  }

  async emptyCart(userMail: string, cartId: string): Promise<CartWithProductsType> {
    try {
      await this._throwErrorIfUserCartNotExists(userMail, cartId);
      return cartsDAO.emptyCart(cartId);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * PRIVATE FUNCTIONS
   *
   */

  private async _throwErrorIfUserCartNotExists(userMail: string, cartId: string): Promise<void> {
    try {
      const isUserCart = await cartsDAO.isUserCart(userMail, cartId);
      if (!isUserCart) {
        throw new Error('ELEMENT_NOT_FOUND');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new CartsService();
