import { openDB } from "idb";

const DB_NAME = "raremed-offline";
const DB_VERSION = 2;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
upgrade(db) {
if (!db.objectStoreNames.contains("medicines")) {
db.createObjectStore("medicines", { keyPath: "_id" });
}


if (!db.objectStoreNames.contains("pharmacies")) {
  db.createObjectStore("pharmacies", { keyPath: "_id" });
}

if (!db.objectStoreNames.contains("hospitals")) {
  db.createObjectStore("hospitals", { keyPath: "_id" });
}

if (!db.objectStoreNames.contains("pendingRequests")) {
  db.createObjectStore("pendingRequests", { keyPath: "localId" });
}

if (!db.objectStoreNames.contains("metadata")) {
  db.createObjectStore("metadata", { keyPath: "key" });
}
if (!db.objectStoreNames.contains("inventory")) {
  db.createObjectStore("inventory", { keyPath: "_id" });
}

},
});

// Save multiple records into IndexedDB.
export async function saveRecords(storeName, records) {
if (!Array.isArray(records)) {
throw new Error("Records must be an array.");
}

const db = await dbPromise;
const tx = db.transaction(storeName, "readwrite");

for (const record of records) {
await tx.store.put(record);
}

await tx.done;
}

// Get all records from a store.
export async function getAllRecords(storeName) {
const db = await dbPromise;
return db.getAll(storeName);
}

// Save the time when data was last cached.
export async function saveCacheTime(storeName) {
const db = await dbPromise;

await db.put("metadata", {
key: storeName,
cachedAt: new Date().toISOString(),
});
}

// Get the last cache time.
export async function getCacheTime(storeName) {
const db = await dbPromise;
const record = await db.get("metadata", storeName);

return record?.cachedAt || null;
}

// Save a medicine request locally for later synchronization.
export async function savePendingRequest(request) {
const db = await dbPromise;

const localId =
globalThis.crypto?.randomUUID?.() ||
`${Date.now()}-${Math.random().toString(16).slice(2)}`;

const pendingRequest = {
...request,
localId,
syncStatus: "pending",
createdAt: new Date().toISOString(),
};

await db.put("pendingRequests", pendingRequest);

return pendingRequest;
}

// Get requests waiting to be synchronized.
export async function getPendingRequests() {
const db = await dbPromise;
return db.getAll("pendingRequests");
}
