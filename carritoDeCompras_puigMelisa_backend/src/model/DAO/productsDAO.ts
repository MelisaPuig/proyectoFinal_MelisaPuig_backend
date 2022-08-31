import ProductORM from '~/model/ORM/ProductORM';
import { NewProductType, ProductType, UpdateableProductType } from '~/types/Product';

class ProductDAO {
  async add(newProduct: NewProductType): Promise<ProductType> {
    try {
      const addedProduct = new ProductORM(newProduct);
      await addedProduct.save();
      return addedProduct.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getById(id: string): Promise<ProductType> {
    try {
      const product = await ProductORM.findOne({ _id: id });
      if (!product) {
        throw new Error('ELEMENT_NOT_FOUND');
      }
      return product.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getAll(): Promise<ProductType[]> {
    try {
      const products = await ProductORM.find();
      if (!products) {
        return [];
      }
      return products.map((e) => e.toObject());
    } catch (error) {
      throw error;
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      return ProductORM.find().distinct('category');
    } catch (error) {
      throw error;
    }
  }

  async getByCategory(category: string): Promise<ProductType[]> {
    try {
      const products = await ProductORM.find({ category });
      if (!products) {
        return [];
      }
      return products.map((e) => e.toObject());
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, productData: UpdateableProductType): Promise<ProductType> {
    try {
      await ProductORM.updateOne({ _id: id }, productData);
      return this.getById(id);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const deleted = await ProductORM.deleteOne({ _id: id });
      return deleted.deletedCount > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProductDAO();
