'use client';

import React, { useEffect, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import { CloudSun, Clock } from "lucide-react";
import BarcodeReader from "react-barcode-reader";
import Swal from "sweetalert2";
import { useGetNotes } from '@/app/hooks/useNotes';
import ModalAgregarDeuda from "@/app/components/Dashboard/components/ModalAgregarDeuda";
import ModalAbonarDeuda from "@/app/components/Dashboard/components/ModalAbonarDeuda";

type Producto = {
  id: string;
  name: string;
  precio: number;
  cantidad: number;
};

const Dashboard = () => {
  const [time, setTime] = useState<Date | null>(null);
  const [weather, setWeather] = useState<{ temperature: number; windspeed: number } | null>(null);
  const [listBuy, setListBuy] = useState<Producto[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [change, setChange] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);
  const { notes: fetchedNotes = { data: [] } } = useGetNotes();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [showModalDeuda, setShowModalDeuda] = useState(false);
  const [showModalAbono, setShowModalAbono] = useState(false);

  const totalProducts = listBuy.reduce((acc, p) => acc + p.cantidad, 0);
  const totalSales = listBuy.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  useEffect(() => {
    setIsClient(true);
    const timeout = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (isClient) {
      setTime(new Date());
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [isClient]);

  useEffect(() => {
    if (paymentAmount === "") setChange(0);
    else setChange(Math.max(Number(paymentAmount) - totalSales, 0));
  }, [paymentAmount, totalSales]);

  useEffect(() => {
    if (isClient) {
      const fetchWeather = async () => {
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=16.75&longitude=-93.12&current_weather=true&lang=es`);
          const data = await res.json();
          setWeather(data.current_weather);
        } catch {
          Swal.fire({ icon: "error", title: "Error al obtener el clima" });
        }
      };
      fetchWeather();
    }
  }, [isClient]);

  const handleScan = async (code: string) => {
    try {
      const res = await fetch(`https://sistema-tiendasss-1.onrender.com/api/productos/code/${code}`);
      if (!res.ok) throw new Error("Producto no encontrado");

      const data = await res.json();
      const product = data.data;
      product.precio = parseFloat(product.precio);

      setListBuy((prev) => {
        const exists = prev.find((p) => p.id === product.id);
        return exists
          ? prev.map((p) => (p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p))
          : [...prev, { ...product, cantidad: 1 }];
      });
    } catch {
      Swal.fire({ icon: "error", title: "Producto no encontrado" });
    } finally {
      setSearchInput("");
    }
  };
  const handlecomplete = () => {
    setPaymentAmount(totalSales);
    setChange(0);
  }
  const handleManualSearch = async () => {
    const code = searchInput.trim();
    if (!code) return;

    try {
      const res = await fetch(`https://sistema-tiendasss-1.onrender.com/api/productos/code/${code}`);
      if (!res.ok) throw new Error();

      const data = await res.json();
      const product = data.data;
      product.precio = parseFloat(product.precio);

      setListBuy((prev) => {
        const exists = prev.find((p) => p.id === product.id);
        return exists
          ? prev.map((p) => (p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p))
          : [...prev, { ...product, cantidad: 1 }];
      });
    } catch {
      Swal.fire({ icon: "error", title: "Producto no encontrado" });
    } finally {
      setSearchInput("");
    }
  };

  const completeSale = async () => {
    if (totalSales === 0) {
      Swal.fire({ icon: "warning", title: "Venta vacía" });
      return;
    }
    if (paymentAmount === "" || paymentAmount < totalSales) {
      Swal.fire({ icon: "warning", title: "Monto insuficiente" });
      return;
    }

    try {
      await fetch("https://sistema-tiendasss-1.onrender.com/api/ventas/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          total: totalSales,
          productos: listBuy.map((p) => ({ id: p.id, cantidad: p.cantidad })),
        }),
      });

      Swal.fire({ icon: "success", title: `Venta completada. Cambio: $${change.toFixed(2)}` });
    } catch {
      Swal.fire({ icon: "error", title: "Error al completar venta" });
    }

    setListBuy([]);
    setChange(0);
    setPaymentAmount("");
  };

  const incrementQuantity = (id: string) =>
    setListBuy((prev) => prev.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p)));

  const decrementQuantity = (id: string) =>
    setListBuy((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad - 1) } : p))
    );

  const removeProduct = (id: string) =>
    setListBuy((prev) => prev.filter((p) => p.id !== id));

  const cancelSale = () => {
    setListBuy([]);
    setChange(0);
    setPaymentAmount("");
  };

  return (
    <div className="h-fit bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h3 className="text-3xl font-bold">Ventas</h3>
        <input
          ref={searchInputRef}
          type="text"
          placeholder="🔍 Buscar por código"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Productos */}
        <div className="md:w-3/4 w-full bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-center mb-4">Productos en venta</h2>
          <div className="overflow-x-auto">
            <Table borderless hover responsive className="text-center">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listBuy.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No hay productos agregados.</td>
                  </tr>
                ) : (
                  listBuy.map((p) => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>${p.precio.toFixed(2)}</td>
                      <td>{p.cantidad}</td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => decrementQuantity(p.id)} className="bg-red-500 text-white px-2 rounded">-</button>
                          <button onClick={() => incrementQuantity(p.id)} className="bg-blue-500 text-white px-2 rounded">+</button>
                          <button onClick={() => removeProduct(p.id)} className="bg-gray-700 text-white px-2 rounded">✕</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Totales */}
        <div className="md:w-1/4 w-full bg-white p-4 rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-center mb-2">Totales</h2>
          <p>Productos: <strong>{totalProducts}</strong></p>
          <p className="text-2xl font-bold text-green-700 mt-2">Total: <span className="text-3xl">${totalSales.toFixed(2)}</span></p>

          <label className="block mt-4 font-semibold text-gray-700">Pago con:</label>
          <button
            onClick={() => handlecomplete()}
            className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all duration-200 ease-in-out mt-2"
          >
            💰 Pago completo
          </button>
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
            className="w-full px-3 py-2 border rounded mt-1"
          />
          <p className="mt-2">Cambio: <strong>${change.toFixed(2)}</strong></p>

          <div className="grid grid-cols-2 gap-3 mt-6  ">
            <div className="h-fit w-fit rounded-full">
              <button
                onClick={completeSale}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-2 rounded-full  shadow transition-all duration-200"
              >
                ✅ Completar venta
              </button>

            </div>

            <button
              onClick={cancelSale}
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-semibold py-2 rounded-full shadow transition-all duration-200"
            >
              ❌ Cancelar
            </button>

            <button
              onClick={() => setShowModalDeuda(true)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white font-semibold py-2 rounded-full shadow transition-all duration-200"
            >
              📒 Agregar a deuda
            </button>

            <button
              onClick={() => setShowModalAbono(true)}
              className="bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800 text-white font-semibold py-2 rounded-full shadow transition-all duration-200"
            >
              💵 Abonar deuda
            </button>
          </div>


          {time && (
            <Card className="mt-4 bg-gray-50 shadow-sm">
              <Card.Body className="text-center">
                <h4 className="text-sm font-semibold flex items-center justify-center gap-1"><Clock size={16} /> Hora</h4>
                <p className="font-mono">{time.toLocaleTimeString()}</p>
                <h4 className="text-sm font-semibold flex items-center justify-center gap-1 mt-2"><CloudSun size={16} /> Clima</h4>
                {weather ? (
                  <>
                    <p>Temp: {weather.temperature}°C</p>
                    <p>Viento: {weather.windspeed} km/h</p>
                  </>
                ) : <p>Cargando...</p>}
              </Card.Body>
            </Card>
          )}
          <BarcodeReader onScan={handleScan} onError={(err) => console.error(err)} />
        </div>
      </div>

      {showModalDeuda && (
        <ModalAgregarDeuda
          clientes={fetchedNotes?.data || []}
          totalSales={totalSales}
          onCompleteVenta={completeSale}
          onClose={() => setShowModalDeuda(false)}
        />
      )}

      {showModalAbono && (
        <ModalAbonarDeuda
          clientes={fetchedNotes?.data || []}
          onClose={() => setShowModalAbono(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
