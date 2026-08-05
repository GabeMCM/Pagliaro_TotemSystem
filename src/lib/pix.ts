function crc16ccitt(payload: string) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

export function injectAmountInPix(emvco: string, amount: number): string {
  let cleanEmvco = emvco.trim();
  const crcIndex = cleanEmvco.lastIndexOf("6304");
  if (crcIndex === -1 || !cleanEmvco.startsWith("000201")) {
    return cleanEmvco;
  }
  
  let payloadWithoutCrc = cleanEmvco.substring(0, crcIndex);
  
  let parsed: Record<string, string> = {};
  let i = 0;
  while (i < payloadWithoutCrc.length) {
    const id = payloadWithoutCrc.substring(i, i + 2);
    const len = parseInt(payloadWithoutCrc.substring(i + 2, i + 4), 10);
    const val = payloadWithoutCrc.substring(i + 4, i + 4 + len);
    parsed[id] = val;
    i += 4 + len;
  }
  
  parsed["54"] = amount.toFixed(2);
  
  let newPayload = "";
  const formatLength = (val: string) => val.length.toString().padStart(2, '0');
  
  const keys = Object.keys(parsed).sort((a, b) => parseInt(a) - parseInt(b));
  for (const k of keys) {
    newPayload += `${k}${formatLength(parsed[k])}${parsed[k]}`;
  }
  
  newPayload += "6304";
  const crc = crc16ccitt(newPayload);
  return `${newPayload}${crc}`;
}

export function generatePixPayload(
  pixKey: string,
  merchantName: string,
  merchantCity: string,
  amount: number
): string {
  const cleanKey = pixKey.trim();

  if (cleanKey.startsWith("000201") && cleanKey.includes("6304")) {
    return injectAmountInPix(cleanKey, amount);
  }

  const formatLength = (val: string) => val.length.toString().padStart(2, '0');

  const payloadFormat = "000201";
  
  const merchantAccountInfo = `0014BR.GOV.BCB.PIX01${formatLength(cleanKey)}${cleanKey}`;
  const merchantAccount = `26${formatLength(merchantAccountInfo)}${merchantAccountInfo}`;
  const merchantCategoryCode = "52040000";
  const transactionCurrency = "5303986";
  
  const amountStr = amount.toFixed(2);
  const transactionAmount = `54${formatLength(amountStr)}${amountStr}`;
  
  const countryCode = "5802BR";
  
  const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const cleanName = removeAccents(merchantName).substring(0, 25).replace(/[^a-zA-Z0-9\s]/gi, '').trim().toUpperCase() || "NOME";
  const nameField = `59${formatLength(cleanName)}${cleanName}`;
  
  const cleanCity = removeAccents(merchantCity).substring(0, 15).replace(/[^a-zA-Z0-9\s]/gi, '').trim().toUpperCase() || "CIDADE";
  const cityField = `60${formatLength(cleanCity)}${cleanCity}`;
  
  const additionalDataField = "0503***"; // TxId
  const additionalData = `62${formatLength(additionalDataField)}${additionalDataField}`;
  
  const payloadToCRC = `${payloadFormat}${merchantAccount}${merchantCategoryCode}${transactionCurrency}${transactionAmount}${countryCode}${nameField}${cityField}${additionalData}6304`;
  
  const crc = crc16ccitt(payloadToCRC);
  
  return `${payloadToCRC}${crc}`;
}
