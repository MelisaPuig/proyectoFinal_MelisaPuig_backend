import OrderORM from '~/model/ORM/OrderORM';
import { NewOrderType, OrderType } from '~/types/Order';

class OrderDAO {
  async add(newOrder: NewOrderType): Promise<OrderType> {
    try {
      const orderNumber = await this._getNextCartNumber();
      const orderData = {
        orderNumber,
        ...newOrder,
      };
      const addedOrder = new OrderORM(orderData);
      await addedOrder.save();
      return addedOrder.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getByUserMail(userMail: string): Promise<OrderType[]> {
    try {
      const orders = await OrderORM.find({ userMail });
      if (!orders) {
        return [];
      }
      return orders.map((e) => e.toObject());
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * PRIVATE
   *
   */

  private async _getNextCartNumber(): Promise<number> {
    try {
      const ordersCount = await OrderORM.count();
      if (ordersCount === 0) {
        return 1;
      }
      const maxResult = await OrderORM.find().sort({ orderNumber: -1 }).limit(1);
      return maxResult[0].toObject().orderNumber + 1;
    } catch (error) {
      throw error;
    }
  }
}

export default new OrderDAO();
