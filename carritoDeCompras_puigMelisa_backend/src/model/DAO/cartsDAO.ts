import CartORM from '~/model/ORM/CartORM';
import { NewCartType, CartType, CartItemType, CartWithProductsType } from '~/types/Cart';
import { ProductType } from '~/types/Product';

class CartsDAO {
  async getById(id: string): Promise<CartWithProductsType> {
    try {
      const cart = await CartORM.findOne({ _id: id }).populate('items.productId');
      if (!cart) {
        throw new Error(`ELEMENT_NOT_FOUND`);
      }
      const parsedCart = cart.toObject();
      const parsedCartWithItems = {
        ...parsedCart,
        items: cart.items.map((e) => ({
          count: e.count,
          product: e.productId as unknown as ProductType,
        })),
      };
      return parsedCartWithItems;
    } catch (error) {
      throw error;
    }
  }

  async getRawById(id: string): Promise<CartType> {
    try {
      const cart = await CartORM.findOne({ _id: id });
      if (!cart) {
        throw new Error(`ELEMENT_NOT_FOUND`);
      }
      return cart.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getByUserMail(userMail: string): Promise<CartWithProductsType | null> {
    try {
      const userCart = await CartORM.findOne({ userMail });
      if (!userCart) {
        return null;
      }
      const createdId = userCart.toObject()._id.toString();
      return this.getById(createdId);
    } catch (error) {
      throw error;
    }
  }

  async newCart(newCartInfo: NewCartType): Promise<CartType> {
    try {
      const cartData = {
        date: new Date(),
        items: [],
        ...newCartInfo,
      };
      const addedCart = new CartORM(cartData);
      await addedCart.save();
      return addedCart.toObject();
    } catch (error) {
      throw error;
    }
  }

  async isUserCart(userMail: string, cartId: string): Promise<boolean> {
    try {
      const foundCart = await CartORM.findOne({ userMail, cartId });
      return foundCart !== null;
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this._throwErrorIfCartNotExists(id);
      const deleted = await CartORM.deleteOne({ _id: id });
      return deleted.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }

  async addItem(cartId: string, newItem: CartItemType): Promise<CartWithProductsType> {
    try {
      const { productId, count } = newItem;
      const cart = await this.getRawById(cartId);
      const { items } = cart;
      const itemIndex = items.findIndex((e) => e.productId.toString() === productId);
      if (itemIndex < 0) {
        await CartORM.updateOne({ _id: cartId }, { $push: { items: newItem } });
      } else {
        const actualCount = items[itemIndex].count;
        const newCount = actualCount + count;
        return this.updateItemCount(cartId, productId, newCount);
      }
      return this.getById(cartId);
    } catch (error) {
      throw error;
    }
  }

  async updateItemCount(
    cartId: string,
    productId: string,
    count: number,
  ): Promise<CartWithProductsType> {
    try {
      const cart = await this.getRawById(cartId);
      const { items } = cart;
      const itemIndex = items.findIndex((e) => e.productId.toString() === productId);
      if (itemIndex < 0) {
        return this.addItem(cartId, { productId, count });
      }
      if (count === 0) {
        return this.removeItem(cartId, itemIndex);
      }
      items[itemIndex].count = count;
      await CartORM.updateOne({ _id: cartId }, { $set: { items } });
      return this.getById(cartId);
    } catch (error) {
      throw error;
    }
  }

  async removeItem(cartId: string, itemIndex: number): Promise<CartWithProductsType> {
    try {
      const { items } = await this.getRawById(cartId);
      items.splice(itemIndex, 1);
      await CartORM.updateOne({ _id: cartId }, { $set: { items } });
      return this.getById(cartId);
    } catch (error) {
      throw error;
    }
  }

  async emptyCart(cartId: string): Promise<CartWithProductsType> {
    try {
      await this._throwErrorIfCartNotExists(cartId);
      await CartORM.updateOne({ _id: cartId }, { $set: { items: [] } });
      return this.getById(cartId);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * PRIVATE FUNCTIONS
   *
   */

  private async _throwErrorIfCartNotExists(cartId: string): Promise<void> {
    try {
      const foundCart = await CartORM.findOne({ cartId });
      if (!foundCart) {
        throw new Error('ELEMENT_NOT_FOUND');
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new CartsDAO();
