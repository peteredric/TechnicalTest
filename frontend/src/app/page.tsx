"use client";

import { useEffect, useState } from "react";
import type { MasterStock } from "../../types/master-stock";
import { MasterStockListItem } from "../../types/master-stock-list-item";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"create" | "add" | "cancel">(
    "create",
  );
  const [stocks, setStocks] = useState<MasterStock[]>([]);
  const [stocksList, setStocksList] = useState<MasterStockListItem[]>([]);
  const [createStockForm, setCreateStockForm] = useState({
    nama_barang: "",
    sku: "",
    satuan_pembelian: "",
    satuan_penjualan: "",
    konversi: "",
  });
  const [addTransactionForm, setAddTransactionForm] = useState({
    nomor_transaksi: "",
    tanggal_transaksi: "",
    sku: "",
    quantity: "",
    keterangan: "",
  });
  const [cancelTransactionForm, setCancelTransactionForm] = useState({
    nomor_transaksi: "",
  });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  async function refreshData() {
    const stocksResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stock-transaction/master-stock`,
    );

    if (!stocksResponse.ok) {
      throw new Error("Failed to fetch stocks");
    }
    const stocksData = await stocksResponse.json();

    setStocks(stocksData);

    const stockListResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stock-transaction/master-stock-simple`,
    );

    if (!stockListResponse.ok) {
      throw new Error("Failed to fetch stocks list");
    }
    const stockListData = await stockListResponse.json();

    setStocksList(stockListData);
  }

  function handleCreateStockChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setCreateStockForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }
  async function handleCreateStockSubmit(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stock-transaction/create-master-stock`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...createStockForm,
          konversi: Number(createStockForm.konversi),
        }),
      },
    );

    const responseData = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", responseData);

    if (!response.ok) {
      setToast({
        message: responseData.message,
        type: "error",
      });
      throw new Error(
        responseData.message ?? "Unhandled error: Gagal membuat stock",
      );
    }

    setToast({
      message: responseData.message,
      type: "success",
    });
    await refreshData();

    // Clear the form
    setCreateStockForm({
      nama_barang: "",
      sku: "",
      satuan_pembelian: "",
      satuan_penjualan: "",
      konversi: "",
    });
  }

  function handleAddTransactionChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;

    setAddTransactionForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }
  async function handleAddTransactionSubmit(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stock-transaction/add-transaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...addTransactionForm,
          quantity: Number(addTransactionForm.quantity),
        }),
      },
    );

    const responseData = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", responseData);

    if (!response.ok) {
      setToast({
        message: responseData.message,
        type: "error",
      });
      throw new Error(
        responseData.message ?? "Unhandled error: Gagal menambahkan transaksi",
      );
    }

    setToast({
      message: responseData.message,
      type: "success",
    });

    await refreshData();

    // Clear the form
    setAddTransactionForm({
      nomor_transaksi: "",
      tanggal_transaksi: "",
      sku: "",
      quantity: "",
      keterangan: "",
    });
  }

  function handleCancelTransactionChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setCancelTransactionForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }
  async function handleCancelTransactionSubmit(
    event: React.SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/stock-transaction/cancel-transaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cancelTransactionForm,
          quantity: Number(cancelTransactionForm.nomor_transaksi),
        }),
      },
    );

    const responseData = await response.json();

    console.log("Status:", response.status);
    console.log("Response:", responseData);

    if (!response.ok) {
      setToast({
        message: responseData.message,
        type: "error",
      });
      throw new Error(
        responseData.message ?? "Unhandled error: Gagal cancel transaksi",
      );
    }

    setToast({
      message: responseData.message,
      type: "success",
    });

    await refreshData();

    // Clear the form
    setCancelTransactionForm({
      nomor_transaksi: "",
    });
  }

  useEffect(() => {
    refreshData();
  }, []);
  return (
    <main className="flex h-screen flex-col">
      {/* Website header */}
      <header className="h-[80px] border-b p-6">
        <h1 className="text-2xl font-bold">Stock Management</h1>
      </header>
      <div className="flex flex-1">
        {/* Left side: Stock Table */}
        <section className="w-2/3 border-r p-6">
          <div className="mb-4 flex items-center gap-16">
            <h2 className="text-2xl font-bold">Master Stock</h2>

            <button
              onClick={refreshData}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100"
            >
              Refresh
            </button>
          </div>

          <table className="mt-6 w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2 text-left">SKU</th>

                <th className="border p-2 text-left">Nama Barang</th>

                <th className="border p-2 text-left">Pembelian</th>

                <th className="border p-2 text-left">Penjualan</th>

                <th className="border p-2 text-left">Konversi</th>
              </tr>
            </thead>

            <tbody>
              {stocks.map((stock) => (
                <tr key={stock.sku}>
                  <td className="border p-2">{stock.sku}</td>

                  <td className="border p-2">{stock.nama_barang}</td>

                  <td className="border p-2">
                    {stock.quantity_pembelian} {stock.satuan_pembelian}
                  </td>

                  <td className="border p-2">
                    {stock.quantity_penjualan} {stock.satuan_penjualan}
                  </td>

                  <td className="border p-2">
                    {stock.konversi} {stock.satuan_penjualan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Right side: Management */}
        <section className="w-1/3 p-6">
          <div className="mt-2 flex w-full justify-between gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex rounded-t-lg px-3.5 py-1.5 text-sm font-medium transition ${
                activeTab === "create"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Create Stock
            </button>

            <button
              onClick={() => setActiveTab("add")}
              className={`flex rounded-t-lg px-3.5 py-1.5 text-sm font-medium transition ${
                activeTab === "add"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Add Stock
            </button>

            <button
              onClick={() => setActiveTab("cancel")}
              className={`flex rounded-t-lg px-3.5 py-1.5 text-sm font-medium transition ${
                activeTab === "cancel"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Cancel Transaction
            </button>
          </div>

          <div className="mt-6">
            {activeTab === "create" && (
              <form onSubmit={handleCreateStockSubmit}>
                <h2 className="mb-4 text-xl font-bold">Create New Stock</h2>

                <div className="mb-4">
                  <label htmlFor="new_stock_nama_barang" className="mb-1 block">
                    Nama Barang
                  </label>

                  <input
                    id="new_stock_nama_barang"
                    name="nama_barang"
                    type="text"
                    value={createStockForm.nama_barang}
                    onChange={handleCreateStockChange}
                    className="w-full rounded border p-2"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="new_stock_sku" className="mb-1 block">
                    SKU
                  </label>

                  <input
                    id="new_stock_sku"
                    name="sku"
                    type="text"
                    value={createStockForm.sku}
                    onChange={handleCreateStockChange}
                    className="w-full rounded border p-2"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="new_stock_satuan_pembelian"
                    className="mb-1 block"
                  >
                    Satuan Pembelian
                  </label>

                  <input
                    id="new_stock_satuan_pembelian"
                    name="satuan_pembelian"
                    type="text"
                    value={createStockForm.satuan_pembelian}
                    onChange={handleCreateStockChange}
                    className="w-full rounded border p-2"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="new_stock_satuan_penjualan"
                    className="mb-1 block"
                  >
                    Satuan Penjualan
                  </label>

                  <input
                    id="new_stock_satuan_penjualan"
                    name="satuan_penjualan"
                    type="text"
                    value={createStockForm.satuan_penjualan}
                    onChange={handleCreateStockChange}
                    className="w-full rounded border p-2"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="new_stock_konversi" className="mb-1 block">
                    Konversi
                  </label>

                  <input
                    id="new_stock_konversi"
                    name="konversi"
                    type="number"
                    step="0.01"
                    value={createStockForm.konversi}
                    onChange={handleCreateStockChange}
                    className="w-full rounded border p-2"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Create Stock
                </button>
              </form>
            )}

            {activeTab === "add" && (
              <form onSubmit={handleAddTransactionSubmit}>
                <h2 className="mb-4 text-xl font-bold">Add Transaction</h2>

                <div className="mb-4">
                  <label
                    htmlFor="add_transaksi_nomor_transaksi"
                    className="mb-1 block"
                  >
                    Nomor Transaksi
                    <p className="mb-2 text-xs text-blue-200">
                      Opsional. Bila kosong, akan membuat nomor baru secara
                      otomatis
                    </p>
                  </label>

                  <input
                    id="add_transaksi_nomor_transaksi"
                    name="nomor_transaksi"
                    type="text"
                    value={addTransactionForm.nomor_transaksi}
                    onChange={handleAddTransactionChange}
                    className="w-full rounded border p-2"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="add_transaksi_tanggal_transaksi"
                    className="mb-1 block"
                  >
                    Tanggal Transaksi
                  </label>

                  <div className="relative">
                    <input
                      id="add_transaksi_tanggal_transaksi"
                      name="tanggal_transaksi"
                      type="date"
                      value={addTransactionForm.tanggal_transaksi}
                      onChange={handleAddTransactionChange}
                      className="w-full rounded border p-2 pr-10"
                    />

                    <button
                      type="button"
                      onClick={(event) => {
                        const input = event.currentTarget
                          .previousElementSibling as HTMLInputElement;

                        input.showPicker();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      aria-label="Open date picker"
                    >
                      📅
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="add_transaksi_sku" className="mb-1 block">
                    Item
                  </label>

                  <select
                    id="add_transaksi_sku"
                    name="sku"
                    value={addTransactionForm.sku}
                    onChange={handleAddTransactionChange}
                    className="w-full rounded border p-2"
                  >
                    <option value="" className="text-black">
                      Select an item
                    </option>

                    {stocksList.map((stock) => (
                      <option
                        key={stock.sku}
                        value={stock.sku}
                        className="text-black"
                      >
                        {stock.nama_barang} ({stock.sku})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="add_transaksi__quantity"
                    className="mb-1 block"
                  >
                    Quantity
                  </label>

                  <input
                    id="add_transaksi__quantity"
                    name="quantity"
                    type="number"
                    step="0.01"
                    value={addTransactionForm.quantity}
                    onChange={handleAddTransactionChange}
                    className="w-full rounded border p-2"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="add_transaksi_keterangan"
                    className="mb-1 block"
                  >
                    Keterangan
                  </label>

                  <input
                    id="add_transaksi_keterangan"
                    name="keterangan"
                    type="text"
                    value={addTransactionForm.keterangan}
                    onChange={handleAddTransactionChange}
                    className="w-full rounded border p-2"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Add Transaction
                </button>
              </form>
            )}

            {activeTab === "cancel" && (
              <form onSubmit={handleCancelTransactionSubmit}>
                <h2 className="mb-4 text-xl font-bold">Cancel Transaction</h2>

                <div className="mb-4">
                  <label
                    htmlFor="cancel_nomor_transaksi"
                    className="mb-1 block"
                  >
                    Nomor Transaksi
                  </label>

                  <input
                    id="cancel_nomor_transaksi"
                    name="nomor_transaksi"
                    type="text"
                    value={cancelTransactionForm.nomor_transaksi}
                    onChange={handleCancelTransactionChange}
                    className="w-full rounded border p-2"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Cancel Transaction
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
      {toast && (
        <div
          className={`fixed bottom-6 left-6 z-50 flex items-center gap-4 rounded-lg px-6 py-3 text-white shadow-lg ${
            toast.type === "success" ? "bg-green-700" : "bg-red-800"
          }`}
        >
          <span>{toast.message}</span>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="font-bold text-white hover:opacity-70"
            aria-label="Close notification"
          >
            x
          </button>
        </div>
      )}
    </main>
  );
}
