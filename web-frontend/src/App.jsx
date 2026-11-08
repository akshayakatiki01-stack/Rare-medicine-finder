import { useState, useEffect } from "react";
import "./App.css";
import { fetchCachedRecords } from "./offline/cacheService.js";
import { savePendingRequest } from "./offline/database.js";

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
  const handleOnline = () => setIsOnline(true);
  const handleOffline = () => setIsOnline(false);

  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);

  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, []);
// Medicine states
const [search, setSearch] = useState("");
const [medicines, setMedicines] = useState([]);
const [medicineLoading, setMedicineLoading] = useState(false);
const [medicineError, setMedicineError] = useState("");
const [medicineSource, setMedicineSource] = useState("online");
const [hasSearched, setHasSearched] = useState(false);

// Pharmacy states
const [pharmacies, setPharmacies] = useState([]);
const [pharmacyLoading, setPharmacyLoading] = useState(false);
const [pharmacyError, setPharmacyError] = useState("");

// Inventory states
const [inventory, setInventory] = useState([]);
const [inventoryLoading, setInventoryLoading] = useState(false);
const [inventoryError, setInventoryError] = useState("");

// Hospital states
const [hospitals, setHospitals] = useState([]);
const [hospitalLoading, setHospitalLoading] = useState(false);
const [hospitalError, setHospitalError] = useState("");
const [hospitalSearch, setHospitalSearch] = useState("");

// Offline cache status
const [dataSources, setDataSources] = useState({
pharmacies: "loading",
inventory: "loading",
hospitals: "loading",
});
const [cacheTimes, setCacheTimes] = useState({
  pharmacies: null,
  inventory: null,
  hospitals: null,
});

// Medicine Request states
const [requestForm, setRequestForm] = useState({
medicineName: "",
genericName: "",
strength: "",
dosageForm: "",
city: "",
contactEmail: "",
notes: "",
});

const [requestLoading, setRequestLoading] = useState(false);
const [requestMessage, setRequestMessage] = useState("");
const [requestError, setRequestError] = useState("");

// Search medicines online or from cached data
const handleSearch = async (event) => {
event.preventDefault();


if (!search.trim()) {
  setMedicineError("Please enter a medicine name");
  setMedicines([]);
  setHasSearched(false);
  return;
}

try {
  setMedicineLoading(true);
  setMedicineError("");
  setHasSearched(true);

  const result = await fetchCachedRecords(
    `http://localhost:5000/api/medicines/search?name=${encodeURIComponent(
      search.trim()
    )}`,
    "medicines"
  );

  const matchingMedicines = result.records.filter((medicine) =>
    medicine.name?.toLowerCase().includes(search.trim().toLowerCase())
  );

  setMedicines(matchingMedicines);
  setMedicineSource(result.source);

  if (result.source === "offline" && matchingMedicines.length === 0) {
    setMedicineError(
      "No matching medicine found in saved offline data. Connect to the internet to search the full database."
    );
  }
} catch (error) {
  setMedicineError(error.message || "Medicine search failed.");
  setMedicines([]);
} finally {
  setMedicineLoading(false);
}


};

// Fetch and cache pharmacies
useEffect(() => {
const loadPharmacies = async () => {
try {
setPharmacyLoading(true);
setPharmacyError("");


    const result = await fetchCachedRecords(
      "http://localhost:5000/api/pharmacies",
      "pharmacies"
    );

    setPharmacies(result.records);

    setDataSources((previous) => ({
      ...previous,
      pharmacies: result.source,
    }));
    setCacheTimes((previous) => ({
  ...previous,
  pharmacies: result.cachedAt,
}));

    if (result.source === "offline" && result.records.length === 0) {
      setPharmacyError("No saved pharmacy data available offline.");
    }
  } catch (error) {
    setPharmacyError(error.message);
  } finally {
    setPharmacyLoading(false);
  }
};

loadPharmacies();


}, []);

// Fetch and cache inventory
useEffect(() => {
const loadInventory = async () => {
try {
setInventoryLoading(true);
setInventoryError("");


    const result = await fetchCachedRecords(
      "http://localhost:5000/api/inventory",
      "inventory"
    );

    setInventory(result.records);

    setDataSources((previous) => ({
      ...previous,
      inventory: result.source,
    }));
    setCacheTimes((previous) => ({
  ...previous,
  inventory: result.cachedAt,
}));

    if (result.source === "offline" && result.records.length === 0) {
      setInventoryError("No saved inventory data available offline.");
    }
  } catch (error) {
    setInventoryError(error.message);
  } finally {
    setInventoryLoading(false);
  }
};

loadInventory();


}, []);

// Fetch and cache hospitals
useEffect(() => {
const loadHospitals = async () => {
try {
setHospitalLoading(true);
setHospitalError("");


    const result = await fetchCachedRecords(
      "http://localhost:5000/api/hospitals",
      "hospitals"
    );

    setHospitals(result.records);

    setDataSources((previous) => ({
      ...previous,
      hospitals: result.source,
    }));
    setCacheTimes((previous) => ({
  ...previous,
  hospitals: result.cachedAt,
}));

    if (result.source === "offline" && result.records.length === 0) {
      setHospitalError("No saved hospital data available offline.");
    }
  } catch (error) {
    setHospitalError(error.message);
  } finally {
    setHospitalLoading(false);
  }
};

loadHospitals();


}, []);

// Submit medicine request online or save locally when offline
const handleRequestSubmit = async (event) => {
event.preventDefault();


try {
  setRequestLoading(true);
  setRequestMessage("");
  setRequestError("");

  const requestData = { ...requestForm };

  if (!navigator.onLine) {
    await savePendingRequest(requestData);

    setRequestMessage(
      "Internet unavailable. Your request has been saved on this device and is waiting to sync."
    );

    setRequestForm({
      medicineName: "",
      genericName: "",
      strength: "",
      dosageForm: "",
      city: "",
      contactEmail: "",
      notes: "",
    });

    return;
  }

  const response = await fetch(
    "http://localhost:5000/api/medicine-requests",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    }
  );

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Request submission failed");
  }

  setRequestMessage("Medicine request submitted successfully!");

  setRequestForm({
    medicineName: "",
    genericName: "",
    strength: "",
    dosageForm: "",
    city: "",
    contactEmail: "",
    notes: "",
  });
} catch (error) {
  setRequestError(error.message || "Unable to submit request.");
} finally {
  setRequestLoading(false);
}


};
const formatCacheTime = (time) => {
  if (!time) return "Not available";

  return new Date(time).toLocaleString("en-IN");
};

// Keep your existing return (...) section below this line.


return ( <div className="app">


  {/* Navigation */}
  <nav className="navbar">
<div className="connection-status">
  {isOnline && navigator.onLine ? (
    <span className="online-status">
      🟢 Internet Connected
    </span>
  ) : (
    <span className="offline-status">
      🔴 Offline Mode
    </span>
  )}
</div>
    <div className="logo">💊 RareMed Finder</div>

    <div className="nav-links">
  <a href="#home">Home</a>
  <a href="#search">Find Medicines</a>
  <a href="#pharmacy">Pharmacies</a>
  <a href="#inventory">Availability</a>
  <a href="#request">Request Medicine</a>
  <a href="#emergency">🚨 Emergency</a>
  <a href="#hospitals">Hospitals</a>
  <a href="#about">About</a>
</div>
 
    <a href="#search" className="nav-button">
      Get Started
    </a>
  </nav>
  <section className="emergency-section" id="emergency">

  <div className="emergency-content">


<span className="emergency-badge">
  🚨 EMERGENCY SUPPORT
</span>

<h2>Need Urgent Medical Help?</h2>

<p>
  Get emergency assistance and find medical facilities.
  No registration or login required.
</p>

<div className="emergency-buttons">

  <a href="tel:112" className="emergency-call-button">
    📞 Call Emergency Services – 112
  </a>

  <a href="#emergency-guidance" className="emergency-guidance-button">
    🩺 Emergency First-Aid Guidance
  </a>

</div>

<p className="emergency-note">
  Emergency assistance is accessible without login.
</p>


  </div>

</section>

{/* Emergency First Aid Guidance */}

<section className="emergency-guidance" id="emergency-guidance">

  <h2>Emergency First-Aid Guidance</h2>

  <div className="guidance-grid">


<div className="guidance-card">
  <h3>🐍 Snakebite</h3>
  <ul>
    <li>Move away from the snake.</li>
    <li>Keep the affected person calm and still.</li>
    <li>Immobilize the affected limb.</li>
    <li>Remove rings or tight items near the bite.</li>
    <li>Seek immediate hospital treatment.</li>
    <li>Do not cut, suck or apply a tourniquet.</li>
  </ul>
</div>

<div className="guidance-card">
  <h3>🚑 General Emergency</h3>
  <ul>
    <li>Call emergency services at 112.</li>
    <li>Follow instructions from emergency responders.</li>
    <li>Do not give food or drink to an unconscious person.</li>
    <li>Do not move someone with a suspected serious spinal injury unless necessary for immediate safety.</li>
    <li>Seek professional medical assistance immediately.</li>
  </ul>
</div>


  </div>

  <p className="medical-disclaimer">
    This information is for immediate safety guidance only.
    It does not replace professional medical treatment.
    Never delay emergency medical care.
  </p>

</section>

  {/* Hero Section */}
  <section className="hero" id="home">
    {/* Emergency Assistance */}



    <div className="hero-content">
      <span className="badge">
        Healthcare Made Accessible
      </span>

      <h1>
        Find Rare Medicines.
        <br />
        <span>Find Hope.</span>
      </h1>

      <p>
        Search for difficult-to-find medicines and discover
        pharmacies that may have them available.
      </p>

      {/* Medicine Search */}
      <form
        className="search-box"
        id="search"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Enter medicine name..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <button type="submit" disabled={medicineLoading}>
          {medicineLoading ? "Searching..." : "Search"}
        </button>
      </form>

      {medicineError && (
        <p className="error-message">{medicineError}</p>
      )}

      {/* Medicine Results */}
      {medicines.length > 0 && (
        <div className="medicine-results">
          <h2>Search Results</h2>

          {medicines.map((medicine) => (
            <div className="medicine-card" key={medicine._id}>
              <h3>{medicine.name}</h3>
              <p>Generic: {medicine.genericName || "Not specified"}</p>
              <p>Strength: {medicine.strength || "Not specified"}</p>
              <p>Brand: {medicine.brand || "Not specified"}</p>
              <p>Dosage: {medicine.dosageForm || "Not specified"}</p>
            </div>
          ))}
        </div>
      )}

      {!medicineLoading &&
        hasSearched &&
        !medicineError &&
        medicines.length === 0 && (
          <p>No medicines found. Try another name.</p>
        )}

      <p className="small-text">
        Helping patients connect with pharmacies.
      </p>
    </div>

    <div className="hero-image">
      <div className="medical-card">
        <div className="medical-icon">🏥</div>
        <h2>Medicine Discovery</h2>
        <p>Connecting patients with pharmacies.</p>
      </div>
    </div>
  </section>

  {/* Pharmacy Directory */}
  <section className="pharmacy-section" id="pharmacy">
    <h2>Find Nearby Pharmacies</h2>

    <p className="section-description">
      Explore pharmacies registered on RareMed Finder.
    </p>

    {pharmacyLoading && <p>Loading pharmacies...</p>}

    {pharmacyError && (
      <p className="error-message">{pharmacyError}</p>
    )}

    {!pharmacyLoading &&
      !pharmacyError &&
      pharmacies.length === 0 && (
        <p>No pharmacies are currently registered.</p>
      )}

    <div className="pharmacy-grid">
      {pharmacies.map((pharmacy) => (
        <div className="pharmacy-card" key={pharmacy._id}>
          <h3>🏥 {pharmacy.name}</h3>

          <p>
            <strong>Address:</strong> {pharmacy.address}
          </p>

          <p>
            <strong>City:</strong> {pharmacy.city}
          </p>

          <p>
            <strong>State:</strong> {pharmacy.state}
          </p>

          <p>
            <strong>Contact:</strong> {pharmacy.phone}
          </p>

          <span className="pharmacy-status">
            {pharmacy.isVerified
              ? "✓ Verified Pharmacy"
              : "Verification Pending"}
          </span>
        </div>
      ))}
    </div>
    <p className="cache-info">
  {dataSources.pharmacies === "online"
    ? "🟢 Online data"
    : "🟡 Cached data"}
  {" | Last updated: "}
  {formatCacheTime(cacheTimes.pharmacies)}
</p>
  </section>
  
  {/* Emergency Hospital Finder */}
<section className="hospital-section" id="hospitals">

  <h2>🏥 Emergency Hospital Finder</h2>

  <p className="section-description">
    Find registered hospitals and their emergency contact details.
  </p>

  <input
    type="text"
    className="hospital-search"
    placeholder="Search by city..."
    value={hospitalSearch}
    onChange={(e) => setHospitalSearch(e.target.value)}
  />

  {hospitalLoading && <p>Loading hospitals...</p>}

  {hospitalError && (
    <p className="error-message">{hospitalError}</p>
  )}

  {!hospitalLoading &&
    !hospitalError &&
    hospitals.filter((hospital) =>
      hospital.city?.toLowerCase().includes(
        hospitalSearch.trim().toLowerCase()
      )
    ).length === 0 && (
      <p>No hospitals found in this city.</p>
    )}

  <div className="hospital-grid">

    {hospitals
      .filter((hospital) =>
        hospital.city?.toLowerCase().includes(
          hospitalSearch.trim().toLowerCase()
        )
      )
      .map((hospital) => (

        <div className="hospital-card" key={hospital._id}>

          <h3>🏥 {hospital.name}</h3>

          <p>
            <strong>Address:</strong> {hospital.address}
          </p>

          <p>
            <strong>City:</strong> {hospital.city}
          </p>

          <p>
            <strong>District:</strong> {hospital.district || "Not specified"}
          </p>

          <p>
            <strong>Emergency Department:</strong>{" "}
            {hospital.hasEmergencyDepartment ? "Listed" : "Not listed"}
          </p>

          <p>
            <strong>Antivenom Service:</strong>{" "}
            {hospital.hasAntivenomService ? "Listed" : "Not listed"}
          </p>

          <p>
            <strong>Emergency Services:</strong>
          </p>

          <ul>
            {hospital.emergencyServices?.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>

          <span className="hospital-status">
            {hospital.isVerified
              ? "✓ Verified Hospital"
              : "⚠ Verification Pending"}
          </span>

          <div className="hospital-buttons">

            <a href={`tel:${hospital.phone}`}>
              📞 Call Hospital
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${hospital.name}, ${hospital.address}, ${hospital.city}, ${hospital.state}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 Directions
            </a>

          </div>

        </div>
      ))}

  </div>
  <p className="cache-info">
  {dataSources.hospitals === "online"
    ? "🟢 Online data"
    : "🟡 Cached data"}
  {" | Last updated: "}
  {formatCacheTime(cacheTimes.hospitals)}
</p>

</section>

  {/* Features */}
  <section className="features" id="about">
    {/* Medicine Availability Section */}
    {/* Medicine Request Section */}

<section className="request-section" id="request">

  <h2>Can't Find Your Medicine?</h2>

  <p className="section-description">
    Submit a request and help us identify your medicine needs.
  </p>

  <form className="request-form" onSubmit={handleRequestSubmit}>


<input
  type="text"
  placeholder="Medicine Name *"
  value={requestForm.medicineName}
  onChange={(e) =>
    setRequestForm({ ...requestForm, medicineName: e.target.value })
  }
  required
/>

<input
  type="text"
  placeholder="Generic Name"
  value={requestForm.genericName}
  onChange={(e) =>
    setRequestForm({ ...requestForm, genericName: e.target.value })
  }
/>

<input
  type="text"
  placeholder="Strength (e.g. 50 mg)"
  value={requestForm.strength}
  onChange={(e) =>
    setRequestForm({ ...requestForm, strength: e.target.value })
  }
/>

<input
  type="text"
  placeholder="Dosage Form (e.g. Tablet)"
  value={requestForm.dosageForm}
  onChange={(e) =>
    setRequestForm({ ...requestForm, dosageForm: e.target.value })
  }
/>

<input
  type="text"
  placeholder="Your City *"
  value={requestForm.city}
  onChange={(e) =>
    setRequestForm({ ...requestForm, city: e.target.value })
  }
  required
/>

<input
  type="email"
  placeholder="Contact Email *"
  value={requestForm.contactEmail}
  onChange={(e) =>
    setRequestForm({ ...requestForm, contactEmail: e.target.value })
  }
  required
/>

<textarea
  placeholder="Additional Notes"
  value={requestForm.notes}
  onChange={(e) =>
    setRequestForm({ ...requestForm, notes: e.target.value })
  }
/>

<button type="submit" disabled={requestLoading}>
  {requestLoading ? "Submitting..." : "Submit Medicine Request"}
</button>

{requestMessage && (
  <p className="success-message">{requestMessage}</p>
)}

{requestError && (
  <p className="error-message">{requestError}</p>
)}


  </form>

</section>

    
<section className="inventory-section" id="inventory">

  <h2>Medicine Availability</h2>

  <p className="section-description">
    Check reported medicine availability at registered pharmacies.
  </p>

  {inventoryLoading && <p>Loading inventory...</p>}

  {inventoryError && (
    <p className="error-message">{inventoryError}</p>
  )}

  {!inventoryLoading &&
    !inventoryError &&
    inventory.length === 0 && (
      <p>No inventory records available.</p>
    )}

  <div className="inventory-grid">

    {inventory.map((item) => (
      <div className="inventory-card" key={item._id}>

        <h3>
          💊 {item.medicine?.name || "Medicine"}
        </h3>

        <p>
          <strong>Generic:</strong>{" "}
          {item.medicine?.genericName || "Not specified"}
        </p>

        <p>
          <strong>Strength:</strong>{" "}
          {item.medicine?.strength || "Not specified"}
        </p>

        <p>
          <strong>Pharmacy:</strong>{" "}
          {item.pharmacy?.name || "Not specified"}
        </p>

        <p>
          <strong>Location:</strong>{" "}
          {item.pharmacy?.city || "Not specified"},{" "}
          {item.pharmacy?.state || ""}
        </p>

        <p>
          <strong>Price:</strong> ₹{item.price}
        </p>

        <p>
          <strong>Quantity:</strong> {item.quantity}
        </p>

        <span className="inventory-status">
          {item.availabilityStatus}
        </span>

        <p className="inventory-verification">
          {item.verified
            ? "✓ Inventory Verified"
            : "⚠ Inventory Not Verified"}
        </p>

        <p>
          <strong>Contact:</strong>{" "}
          {item.pharmacy?.phone || "Not available"}
        </p>

      </div>
    ))}

  </div>
  <p className="cache-info">
  {dataSources.inventory === "online"
    ? "🟢 Online data"
    : "🟡 Cached data"}
  {" | Last updated: "}
  {formatCacheTime(cacheTimes.inventory)}
</p>

</section>
    <h2>How RareMed Finder Helps You</h2>

    <p className="section-description">
      Making medicine discovery easier and faster.
    </p>

    <div className="feature-grid">
      <div className="feature-card">
        <div className="feature-icon">🔍</div>
        <h3>Search Medicines</h3>
        <p>Search for rare and difficult-to-find medicines.</p>
      </div>

      <div className="feature-card">
        <div className="feature-icon">🏪</div>
        <h3>Find Pharmacies</h3>
        <p>Discover pharmacies registered on our platform.</p>
      </div>

      <div className="feature-card">
        <div className="feature-icon">📦</div>
        <h3>Check Availability</h3>
        <p>View reported inventory and availability information.</p>
      </div>

      <div className="feature-card">
        <div className="feature-icon">📝</div>
        <h3>Request Medicines</h3>
        <p>Submit requests for medicines you cannot find.</p>
      </div>
    </div>
  </section>

  {/* Footer */}
  <footer>
    <h3>💊 RareMed Finder</h3>
    <p>
      Connecting patients with medicine availability information.
    </p>
    <p>© 2026 RareMed Finder. All rights reserved.</p>
  </footer>

</div>


);
}

export default App;

