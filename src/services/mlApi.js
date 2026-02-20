// Minimal API service for ML endpoints
// Exported function: predictFertilizer(data, signal?)
export async function predictFertilizer(data, signal) {
  const url = "https://sunainakancharla-nethra-yield-model.hf.space/predict-fertilizer";

  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal,
  };

  let res;
  try {
    res = await fetch(url, opts);
  } catch (err) {
    // network-level error (could be CORS or connectivity)
    const message = err && err.message ? err.message : "Network error";
    const e = new Error(`Request failed: ${message}`);
    e.cause = err;
    throw e;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const msg = `Server responded with ${res.status}${text ? `: ${text}` : ""}`;
    const e = new Error(msg);
    throw e;
  }

  // parse JSON
  try {
    const json = await res.json();
    return json;
  } catch (err) {
    const e = new Error("Invalid JSON response");
    e.cause = err;
    throw e;
  }
}

export default { predictFertilizer };
