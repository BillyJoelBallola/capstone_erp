import React from 'react';
import { Routes, Route } from 'react-router-dom';

import _404 from "./pages/_404";
import Login from "./pages/Login";
import Layout from './pages/Layout';
import ChangePassword from './pages/ChangePassword';

import Operations from './pages/Operations';

import Settings from "./pages/settings/Settings";
import ManageUsers from './pages/settings/ManageUsers';
import UserForm from './pages/settings/UserForm';

import Inventory from './pages/inventory/Inventory';
import Adjustments from './pages/inventory/Adjustments';
import InventoryReport from './pages/inventory/InventoryReport';

import SupplyChain from './pages/supplyChain/SupplyChain';
import Suppliers from './pages/supplyChain/Suppliers';
import SupplierForm from './pages/supplyChain/SupplierForm';
import Shipments from './pages/supplyChain/Shipments';
import ShipmentForm from './pages/supplyChain/ShipmentForm';

import Financial from './pages/financial/Financial';
import Bills from './pages/financial/Bills';
import BillForm from './pages/shared/BillForm';
import Payments from './pages/financial/Payments';
import PaymentForm from './pages/financial/PaymentForm';
import JournalEntries from './pages/financial/JournalEntries';

import Products from './pages/shared/Products';
import ProductForm from './pages/shared/ProductForm';
import RawMaterials from './pages/shared/RawMaterials';
import RawMaterialForm from './pages/shared/RawMaterialForm';
import Productions from './pages/shared/Productions';
import ProductionForm from './pages/shared/ProductionForm';
import Purchase from './pages/shared/Purchase';
import PurchaseForm from './pages/shared/PurchaseForm';
import Replenishment from './pages/shared/Replenishment';
import ProductForecast from './pages/shared/ProductForecast';
import MaterialForecast from './pages/shared/MaterialForecast';

import HumanResource from './pages/humanResource/HumanResource';
import Dashboard from './pages/dashboard/Dashboard';

import Sales from './pages/sales/Sales';
import Orders from './pages/sales/Orders';
import OrderForm from './pages/sales/OrderForm';

const App = () => {
    return (
        <Routes>
            <Route path='/*' element={<_404 />} />
            <Route path='/login' element={<Login />} />
            <Route path='/change_password/:email?' element={<ChangePassword />} />
            <Route path="/" element={<Layout />}>
                <Route path='/' element={<Operations />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/settings' element={<Settings />} />
                <Route path='/settings/manage-users' element={<ManageUsers />} />
                <Route path='/settings/manage-users/user-form/:id?' element={<UserForm />} />
                <Route path='/inventory' element={<Inventory />} />
                <Route path='/inventory/adjustments' element={<Adjustments />} />
                <Route path='/inventory/inventory_report' element={<InventoryReport />} />
                <Route path='/:op/products' element={<Products />} />
                <Route path='/supply-chain' element={<SupplyChain />} />
                <Route path='/supply-chain/shipments' element={<Shipments />} />
                <Route path='/:op/shipments/shipment-form/:id?' element={<ShipmentForm />} />
                <Route path='/:op/suppliers' element={<Suppliers />} />
                <Route path='/:op/suppliers/supplier-form/:id?' element={<SupplierForm />} />
                <Route path='/financial' element={<Financial />} />
                <Route path='/financial/bills' element={<Bills />} />
                <Route path='/financial/payments' element={<Payments />} />
                <Route path='/financial/payments/payment-form/:id?' element={<PaymentForm />} />
                <Route path='/financial/journal_entries' element={<JournalEntries />} />
                <Route path='/:op/bills/bill-form/:purchase?/:id?' element={<BillForm />} />
                <Route path='/:op/productions' element={<Productions />} />
                <Route path='/:op/productions/production-form/:id?' element={<ProductionForm />} />
                <Route path='/:op/products/product-form/:id?' element={<ProductForm />} />
                <Route path='/:op/raw-materials' element={<RawMaterials />} />
                <Route path='/:op/raw-materials/raw-material-form/:id?' element={<RawMaterialForm />} />
                <Route path='/:op/purchases' element={<Purchase />} />
                <Route path='/:op/purchases/purchase-form/:id?' element={<PurchaseForm />} />
                <Route path='/:op/replenishment' element={<Replenishment />} />
                <Route path='/:op/product_forecast/:id?' element={<ProductForecast />} />
                <Route path='/:op/material_forecast/:id?' element={<MaterialForecast />} />
                <Route path='/human-resource' element={<HumanResource />} />
                <Route path='/sales' element={<Sales />} />
                <Route path='/sales/orders' element={<Orders />} />
                <Route path='/sales/orders/order-form/:id?' element={<OrderForm />} />
            </Route>
        </Routes>
    )
}

export default App;