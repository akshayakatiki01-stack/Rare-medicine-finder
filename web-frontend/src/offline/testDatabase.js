import {
dbPromise,
saveRecords,
getAllRecords,
} from "./database.js";

async function testDatabase() {
try {
const db = await dbPromise;


console.log("IndexedDB connected:", db.name);

await saveRecords("medicines", [
  {
    _id: "offline-test-001",
    name: "Offline Test Medicine",
    strength: "100 mg",
  },
]);

const medicines = await getAllRecords("medicines");

console.log("Saved medicines:", medicines);
console.log("IndexedDB test successful!");


} catch (error) {
console.error("IndexedDB test failed:", error);
}
}

testDatabase();
