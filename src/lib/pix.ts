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

export function generatePixPayload(
  pixKey: string,
  merchantName: string,
  merchantCity: string,
  amount: number
): string {
  const formatLength = (val: string) => val.length.toString().padStart(2, '0');

  const payloadFormat = "000201";
  
  // Limpar a chave pix de caracteres extras se for telefone ou CNPJ, mas mantendo e-mail
  // Na verdade, o BCB exige formato exato, por segurança é melhor quem digita colocar a chave correta.
  const cleanKey = pixKey.trim();

  const merchantAccountInfo = `0014BR.GOV.BCB.PIX01${formatLength(cleanKey)}${cleanKey}`;
  const merchantAccount = `26${formatLength(merchantAccountInfo)}${merchantAccountInfo}`;
  const merchantCategoryCode = "52040000";
  const transactionCurrency = "5303986";
  
  const amountStr = amount.toFixed(2);
  const transactionAmount = `54${formatLength(amountStr)}${amountStr}`;
  
  const countryCode = "5802BR";
  
  // Nomes e Cidades não podem ter acentos ou caracteres especiais e tamanho maximo 25 e 15
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
