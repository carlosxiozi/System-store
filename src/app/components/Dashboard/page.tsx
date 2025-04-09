"use client";

import React, { useEffect, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card } from "react-bootstrap";
import { CloudSun, Clock } from "lucide-react";
import BarcodeReader from "react-barcode-reader";
import Swal from "sweetalert2";

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
  const [scanning, setScanning] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  const [change, setChange] = useState<number>(0);
  const [isClient, setIsClient] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setIsClient(true); // Solo después de que el componente se monta, actualizar isClient
  }, []);
  // Focus automático después de cada Enter global
  useEffect(() => {
    // Espera un tick para asegurarse que el input ya está en el DOM
    const timeout = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100); // este delay asegura que el focus esté a tiempo
  
    return () => clearTimeout(timeout);
  }, []);
  

  const totalProducts = listBuy.reduce((acc, p) => acc + p.cantidad, 0);
  const totalSales = listBuy.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  useEffect(() => {
    if (paymentAmount === "") {
      setChange(0);
    } else {
      const calculatedChange = Number(paymentAmount) - totalSales;
      setChange(calculatedChange > 0 ? calculatedChange : 0);
    }
  }, [paymentAmount, totalSales]);

  useEffect(() => {
    if (isClient) {  // Solo ejecutar después de que el componente se haya montado
      setTime(new Date());
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
    }
  }, [isClient]);

  useEffect(() => {
    if (isClient) {  // Solo ejecutar después de que el componente se haya montado
      const fetchWeather = async () => {
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=16.75&longitude=-93.12&current_weather=true&lang=es`
          );
          const data = await res.json();
          setWeather(data.current_weather);
        } catch (err) {
          console.error("Error al obtener el clima:", err);
        }
      };
      fetchWeather();
    }
  }, [isClient]);

  const handleScan = async (code: string) => {
    setScanning(true);
    try {
      const res = await fetch(`http://localhost:8000/api/productos/code/${code}`);
      if (!res.ok){
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se encontró el producto con el código escaneado.",
          confirmButtonText: "Aceptar",
        });
        return;
      }

      const data = await res.json();
      const product = data.data;

      if (product) {
        product.precio = parseFloat(product.precio);

        setListBuy((prev) => {
          const exists = prev.find((p) => p.id === product.id);
          return exists
            ? prev.map((p) =>
              p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p
            )
            : [...prev, { ...product, cantidad: 1 }];
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al escanear el código.",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setScanning(false);
    }
  };

  const handleManualSearch = async () => {
    const code = searchInput.trim();
    if (!code) return;

    try {
      const res = await fetch(`http://localhost:8000/api/productos/code/${code}`);
      if (!res.ok) throw new Error(`Error: ${res.statusText}`);

      const data = await res.json();
      const product = data.data;

      if (product && product.id && product.precio) {
        product.precio = parseFloat(product.precio);

        setListBuy((prev) => {
          const exists = prev.find((p) => p.id === product.id);
          return exists
            ? prev.map((p) =>
              p.id === product.id ? { ...p, cantidad: p.cantidad + 1 } : p
            )
            : [...prev, { ...product, cantidad: 1 }];
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Producto no encontrado",
          text: "No se encontró el producto con el código ingresado.",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al buscar el producto.",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setSearchInput("");
    }
  };

  const incrementQuantity = (id: string) => {
    setListBuy((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p))
    );
  };

  const decrementQuantity = (id: string) => {
    setListBuy((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, p.cantidad - 1) } : p
      )
    );
  };

  const removeProduct = (id: string) => {
    setListBuy((prev) => prev.filter((p) => p.id !== id));
  };

  const cancelSale = () => setListBuy([]);

  const completeSale = async () => {
    if (totalSales === 0) {
      Swal.fire({
        icon: "warning",
        title: "Venta vacía",
        text: "No hay productos en la venta.",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    if (paymentAmount === "" || paymentAmount < totalSales) {
      Swal.fire({
        icon: "warning",
        title: "Monto insuficiente",
        text: "El monto ingresado es menor al total de la venta.",
        confirmButtonText: "Aceptar",
      });
      return;
    }
    if (change < 0) {
      Swal.fire({
        icon: "warning",
        title: "Cambio negativo",
        text: "El cambio no puede ser negativo.",
        confirmButtonText: "Aceptar",
      });
      return;
    }if(listBuy.length > 0){
      try{
        const res= await fetch("http://localhost:8000/api/ventas/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            total: totalSales,
            productos: listBuy.map((p) => ({
              id: p.id,
              cantidad: p.cantidad,
            })),
          }),
        });
        Swal.fire({
          icon: "success",
          title: "Venta completada",
          text: `Cambio: $${change.toFixed(2)}`,
          confirmButtonText: "Aceptar",
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Ocurrió un error al completar la venta.",
          confirmButtonText: "Aceptar",
        });
      }
    }
    setListBuy([]);
  };

  return (
    <div className="h-fit bg-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="w-full h-fit max-w-md shadow-md rounded-lg bg-white flex items-center">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="🔍 Buscar por código"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleManualSearch();
                searchInputRef.current?.focus(); // vuelve a hacer focus tras buscar
              }
            }}
            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          />

        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Tabla de productos */}
        <div className="md:w-3/4 w-full bg-white p-6 rounded-2xl shadow-md overflow-auto">
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Productos en venta
          </h2>
          <div className="overflow-x-auto shadow-md rounded-lg">
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
                    <td colSpan={4} className="text-gray-500 py-4">
                      No hay productos agregados.
                    </td>
                  </tr>
                ) : (
                  listBuy.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.name}</td>
                      <td>${producto.precio.toFixed(2)}</td>
                      <td>{producto.cantidad}</td>
                      <td>
                        <div className="flex justify-center gap-2 items-center">
                          <button
                            aria-label="Disminuir cantidad"
                            className="bg-red-500 hover:bg-red-600 text-white px-2 rounded"
                            onClick={() => decrementQuantity(producto.id)}
                          >
                            -
                          </button>
                          <button
                            aria-label="Aumentar cantidad"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 rounded"
                            onClick={() => incrementQuantity(producto.id)}
                          >
                            +
                          </button>
                          <button
                            aria-label="Eliminar producto"
                            onClick={() => removeProduct(producto.id)}
                            className="bg-gray-800 text-white px-2 py-1 rounded"
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Totales y clima */}
        <div className="md:w-1/4 w-full bg-white p-2 rounded-2xl shadow-md flex flex-col ">
          <div>
            <h2 className="text-2xl font-bold text-center  text-gray-800">Totales</h2>
            <p className="text-gray-600 font-medium">Total de productos:</p>
            <p className="text-xl font-bold text-gray-700 text-center">{totalProducts}</p>
            <p className="text-gray-600 font-medium mt-4">Total a pagar:</p>
            <p className="text-xl font-bold text-gray-700 text-center">${totalSales.toFixed(2)}</p>
            <p className="text-gray-600 font-medium mt-4">Con cuánto pagó:</p>
            <input
              type="number"
              placeholder="Escribe el monto"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value === "" ? "" : parseFloat(e.target.value))}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
            />
            <p className="text-gray-600 font-medium mt-4">Cambio:</p>
            <p className="text-xl font-bold text-gray-700 text-center">
              ${change.toFixed(2)}
            </p>

            <div className="flex flex-col md:flex-row gap-2 ">
              <button
                className="w-full bg-green-600 text-white  rounded-lg shadow hover:bg-green-700 transition"
                onClick={completeSale}
              >
                Completar venta
              </button>
              <button
                className="w-full bg-yellow-500 text-white py-2 rounded-lg shadow hover:bg-yellow-600 transition"
                onClick={cancelSale}
              >
                Cancelar venta
              </button>
            </div>
          </div>

          {/* Reloj y clima */}
          {time && (
            <Card className="mt-6 shadow-md rounded-lg  bg-gray-50">
              <Card.Body className="text-center">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold flex justify-center items-center gap-2 text-gray-800">
                    <Clock size={18} />
                    Hora actual
                  </h3>
                  <p className="text-gray-700 text-xl font-mono">
                    {time.toLocaleTimeString("es-MX", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold flex justify-center items-center gap-2 text-gray-800">
                    <CloudSun size={18} />
                    Clima en Tuxtla
                  </h3>
                  {weather ? (
                    <>
                      <p className="text-gray-600">Temp: {weather.temperature}°C</p>
                      <p className="text-gray-600">Viento: {weather.windspeed} km/h</p>
                    </>
                  ) : (
                    <p className="text-gray-600">Cargando clima...</p>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}
          <BarcodeReader onScan={handleScan} onError={(err: Error) => console.error(err)} />
        </div>
      </div>
    </div>
  );

};

export default Dashboard;
