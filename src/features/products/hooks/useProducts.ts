import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { productsApi } from '../api/productsApi';
import { Product, PaginationParams } from '../../../types';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { products, selectedProduct, loading, error } = useAppSelector(
    (state) => state.products
  );

  // Buscar produtos
  const fetchProducts = useCallback(
    async (params?: PaginationParams & { category?: string; lowStock?: boolean }) => {
      dispatch({ type: 'products/setLoading', payload: true });
      try {
        const response = await productsApi.getProducts(params);
        if (response.success && response.data) {
          dispatch({ type: 'products/setProducts', payload: response.data.data });
          dispatch({ type: 'products/setError', payload: null });
        } else {
          dispatch({ type: 'products/setError', payload: response.error || 'Erro ao buscar produtos' });
        }
      } catch (err) {
        dispatch({
          type: 'products/setError',
          payload: 'Erro ao buscar produtos',
        });
      } finally {
        dispatch({ type: 'products/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Buscar produto por ID
  const fetchProductById = useCallback(
    async (id: string) => {
      dispatch({ type: 'products/setLoading', payload: true });
      try {
        const response = await productsApi.getProductById(id);
        if (response.success && response.data) {
          dispatch({ type: 'products/setSelectedProduct', payload: response.data });
          dispatch({ type: 'products/setError', payload: null });
          return response.data;
        } else {
          dispatch({ type: 'products/setError', payload: response.error || 'Produto não encontrado' });
          return null;
        }
      } catch (err) {
        dispatch({
          type: 'products/setError',
          payload: 'Erro ao buscar produto',
        });
        return null;
      } finally {
        dispatch({ type: 'products/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Buscar produto por código (SKU ou barcode)
  const fetchProductByCode = useCallback(
    async (code: string) => {
      dispatch({ type: 'products/setLoading', payload: true });
      try {
        const response = await productsApi.getProductByCode(code);
        if (response.success && response.data) {
          dispatch({ type: 'products/setError', payload: null });
          return response.data;
        } else {
          dispatch({ type: 'products/setError', payload: response.error || 'Produto não encontrado' });
          return null;
        }
      } catch (err) {
        dispatch({
          type: 'products/setError',
          payload: 'Erro ao buscar produto',
        });
        return null;
      } finally {
        dispatch({ type: 'products/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Criar produto
  const createProduct = useCallback(
    async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      dispatch({ type: 'products/setLoading', payload: true });
      try {
        const response = await productsApi.createProduct(productData);
        if (response.success && response.data) {
          dispatch({ type: 'products/addProduct', payload: response.data });
          dispatch({ type: 'products/setError', payload: null });
          return { success: true, data: response.data };
        } else {
          dispatch({ type: 'products/setError', payload: response.error || 'Erro ao criar produto' });
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao criar produto';
        dispatch({ type: 'products/setError', payload: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        dispatch({ type: 'products/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Atualizar produto
  const updateProduct = useCallback(
    async (id: string, productData: Partial<Product>) => {
      dispatch({ type: 'products/setLoading', payload: true });
      try {
        const response = await productsApi.updateProduct(id, productData);
        if (response.success && response.data) {
          dispatch({ type: 'products/updateProduct', payload: response.data });
          dispatch({ type: 'products/setError', payload: null });
          return { success: true, data: response.data };
        } else {
          dispatch({ type: 'products/setError', payload: response.error || 'Erro ao atualizar produto' });
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao atualizar produto';
        dispatch({ type: 'products/setError', payload: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        dispatch({ type: 'products/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Deletar produto
  const deleteProduct = useCallback(
    async (id: string) => {
      dispatch({ type: 'products/setLoading', payload: true });
      try {
        const response = await productsApi.deleteProduct(id);
        if (response.success) {
          dispatch({ type: 'products/deleteProduct', payload: id });
          dispatch({ type: 'products/setError', payload: null });
          return { success: true };
        } else {
          dispatch({ type: 'products/setError', payload: response.error || 'Erro ao excluir produto' });
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao excluir produto';
        dispatch({ type: 'products/setError', payload: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        dispatch({ type: 'products/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Atualizar estoque
  const updateStock = useCallback(
    async (id: string, quantity: number, operation: 'add' | 'subtract' | 'set') => {
      dispatch({ type: 'products/setLoading', payload: true });
      try {
        const response = await productsApi.updateStock(id, quantity, operation);
        if (response.success && response.data) {
          dispatch({ type: 'products/updateProduct', payload: response.data });
          dispatch({ type: 'products/setError', payload: null });
          return { success: true, data: response.data };
        } else {
          dispatch({ type: 'products/setError', payload: response.error || 'Erro ao atualizar estoque' });
          return { success: false, error: response.error };
        }
      } catch (err) {
        const errorMsg = 'Erro ao atualizar estoque';
        dispatch({ type: 'products/setError', payload: errorMsg });
        return { success: false, error: errorMsg };
      } finally {
        dispatch({ type: 'products/setLoading', payload: false });
      }
    },
    [dispatch]
  );

  // Buscar estatísticas
  const fetchProductStats = useCallback(async () => {
    try {
      const response = await productsApi.getProductStats();
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err) {
      return null;
    }
  }, []);

  // Buscar produtos com estoque baixo
  const fetchLowStockProducts = useCallback(async () => {
    try {
      const response = await productsApi.getLowStockProducts();
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    } catch (err) {
      return [];
    }
  }, []);

  // Selecionar produto
  const selectProduct = useCallback(
    (product: Product | null) => {
      dispatch({ type: 'products/setSelectedProduct', payload: product });
    },
    [dispatch]
  );

  // Limpar erro
  const clearError = useCallback(() => {
    dispatch({ type: 'products/setError', payload: null });
  }, [dispatch]);

  return {
    products,
    selectedProduct,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    fetchProductByCode,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    fetchProductStats,
    fetchLowStockProducts,
    selectProduct,
    clearError,
  };
};

