import { productService } from '@/api/product/product'
import type { ProductResponse } from '@/api/types/product'

export interface ProductListLoaderData {
  products: ProductResponse[]
  errorMessage: string
}

export const productsListLoader = async (): Promise<ProductListLoaderData> => {
  try {
    const products = await productService.getList()
    return { products, errorMessage: '' }
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return {
      products: [],
      errorMessage: '目前無法取得商品資料，請稍後再試。',
    }
  }
}
