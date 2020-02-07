import axios from 'axios';
import { BASE_PATH, KEY } from './config';

export async function symbolSearch(company: string): Promise<any> {
  const res = await axios.get(
    `${BASE_PATH}/query?function=SYMBOL_SEARCH&keywords=${company}&apikey=${KEY}`,
  );
  return res.data;
}

export async function globalQuote(symbol: string): Promise<any> {
  const res = await axios.get(
    `${BASE_PATH}/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${KEY}`,
  );
  return res.data;
}
