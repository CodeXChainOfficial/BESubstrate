
export const extendDomain = (firstDate: number, duration: number): string => {
  const date = new Date(firstDate * 1000);
  const extendedDate = date.setFullYear(date.getFullYear() + duration) / 1000;
  return extendedDate.toString();
};

export const getDomainPrice = (domaninName: string, egldPrice: any) => {

  if(!egldPrice) {
    throw new Error('Error when reading egld_price from localcache');
  }

  const token_price = parseFloat(egldPrice || '0');
  const name = domaninName.replace('.mvx', '');
  let priceEgld = name.length < 4 ? 1 : name.length == 4 ? 0.1 : 0.01;
  const priceUsd = priceEgld * token_price;
  priceEgld = priceEgld * 1e18;
  return { priceEgld, priceUsd };
};

export const hexDecode = (hexx: string) => {
  const hex = hexx.toString();
  let str = '';
  for (let i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
};

export const base64Decode = (str: string) => {
  const buff = Buffer.from(str, 'base64');
  return buff.toString('ascii');
};
