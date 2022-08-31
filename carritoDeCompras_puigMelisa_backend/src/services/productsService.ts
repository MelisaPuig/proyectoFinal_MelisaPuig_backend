import productsDAO from '~/model/DAO/productsDAO';
import { NewProductType, ProductType, UpdateableProductType } from '~/types/Product';

class ProductsService {
  async add(newProduct: NewProductType): Promise<ProductType> {
    return productsDAO.add(newProduct);
  }

  async getById(id: string): Promise<ProductType> {
    return productsDAO.getById(id);
  }

  async getAll(): Promise<ProductType[]> {
    return productsDAO.getAll();
  }

  async getByCategory(category: string): Promise<ProductType[]> {
    return productsDAO.getByCategory(category);
  }

  async getCategories(): Promise<string[]> {
    return productsDAO.getCategories();
  }

  async update(id: string, productData: UpdateableProductType): Promise<ProductType> {
    return productsDAO.update(id, productData);
  }

  async delete(id: string): Promise<boolean> {
    return productsDAO.delete(id);
  }
}

export default new ProductsService();
