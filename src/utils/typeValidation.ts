/**
 * Utilitário para validar que os tipos do Redux estão alinhados com os tipos principais
 * Este arquivo serve como documentação e validação em tempo de compilação
 */

import type { RootState } from '../store';
import type {
  AuthState,
  CustomersState,
  PetsState,
  ServicesState,
  ServiceOrdersState,
  ProductsState,
  SalesState,
  StockState,
} from '../types';

// Validações de tipo - se houver erro de compilação aqui, os tipos não estão alinhados

type ValidateAuthState = AuthState extends RootState['auth'] ? true : false;
type ValidateCustomersState = CustomersState extends RootState['customers'] ? true : false;
type ValidatePetsState = PetsState extends RootState['pets'] ? true : false;
type ValidateServicesState = ServicesState extends RootState['services'] ? true : false;
type ValidateServiceOrdersState = ServiceOrdersState extends RootState['serviceOrders'] ? true : false;
type ValidateProductsState = ProductsState extends RootState['products'] ? true : false;
type ValidateSalesState = SalesState extends RootState['sales'] ? true : false;
type ValidateStockState = StockState extends RootState['stock'] ? true : false;

// Estas constantes garantem que a validação será executada
const _authValidation: ValidateAuthState = true;
const _customersValidation: ValidateCustomersState = true;
const _petsValidation: ValidatePetsState = true;
const _servicesValidation: ValidateServicesState = true;
const _serviceOrdersValidation: ValidateServiceOrdersState = true;
const _productsValidation: ValidateProductsState = true;
const _salesValidation: ValidateSalesState = true;
const _stockValidation: ValidateStockState = true;

// Exporta para evitar warning de variáveis não usadas
export const typeValidations = {
  auth: _authValidation,
  customers: _customersValidation,
  pets: _petsValidation,
  services: _servicesValidation,
  serviceOrders: _serviceOrdersValidation,
  products: _productsValidation,
  sales: _salesValidation,
  stock: _stockValidation,
};

/**
 * Mapa de validação de tipos do Redux
 * 
 * Este arquivo garante que:
 * 1. Todos os slices do Redux usam os tipos corretos de ../types
 * 2. Não há divergência entre tipos e implementação
 * 3. Mudanças em tipos causarão erro de compilação se não forem refletidas no Redux
 * 
 * Estados validados:
 * ✅ AuthState - Autenticação e usuário
 * ✅ CustomersState - Clientes/Tutores
 * ✅ PetsState - Pets
 * ✅ ServicesState - Serviços e Agendamentos
 * ✅ ServiceOrdersState - Ordens de Serviço
 * ✅ ProductsState - Produtos
 * ✅ SalesState - Vendas/PDV
 * ✅ StockState - Controle de Estoque
 */



