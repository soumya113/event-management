import QRCode from "qrcode";

export const generateQrCode = () => {
  return `QR-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;
};

export const generateQrImage = async (value) => {
  return await QRCode.toDataURL(value, {
    width: 250,
    margin: 2,
  });
};