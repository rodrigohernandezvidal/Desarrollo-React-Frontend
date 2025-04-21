// Archivo para simular datos antes de conectar con backend
const mockPurchases = [
    {
      id: 1,
      razonSocial: "Proveedor Uno S.A.",
      tipoDocumento: "Factura Afecta",
      numeroDocumento: "F-001",
      fecha: "2023-10-15",
      estado: "INGRESADO",
      neto: 1000000,
      iva: 190000,
      total: 1190000,
      proveedorRut: "76.123.456-7",
      observaciones: "",
      siiId: "SII-12345" // ID de referencia en SII
    },
    // Más documentos...
  ];
  
  export const getPurchases = () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockPurchases), 500);
    });
  };
  
  export const createPurchase = (purchaseData) => {
    return new Promise((resolve) => {
      const newPurchase = {
        ...purchaseData,
        id: mockPurchases.length + 1,
        estado: "INGRESADO",
        fecha: new Date().toISOString().split('T')[0]
      };
      mockPurchases.unshift(newPurchase);
      setTimeout(() => resolve(newPurchase), 300);
    });
  };