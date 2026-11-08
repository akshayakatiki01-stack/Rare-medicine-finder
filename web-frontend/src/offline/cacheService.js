import {
saveRecords,
getAllRecords,
saveCacheTime,
getCacheTime,
} from "./database.js";

export async function fetchCachedRecords(url, storeName) {
try {
const response = await fetch(url);


if (!response.ok) {
  throw new Error(`Server returned ${response.status}`);
}

const result = await response.json();

const data = result.data ?? result;

const records = Array.isArray(data)
  ? data
  : data && typeof data === "object" && data._id
    ? [data]
    : [];
await saveRecords(storeName, records);
await saveCacheTime(storeName);

return {
  records,
  source: "online",
  cachedAt: new Date().toISOString(),
};


} catch (error) {
console.warn(`Could not fetch ${storeName} online:`, error.message);


const records = await getAllRecords(storeName);
const cachedAt = await getCacheTime(storeName);

return {
  records,
  source: "offline",
  cachedAt,
};


}
}
