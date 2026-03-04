//https://request-function-eedjehbjbngpa8ha.eastus2-01.azurewebsites.net/api/hipaa_check?code=Wmaumz_1yIvt0DiR37hfCErtNIwzyLhXlVJPPpg5SenMAzFuVZVMPQ==
// ✅ Set these two endpoints (Function key included)
const HIPAA_URL =
  "https://request-function-eedjehbjbngpa8ha.eastus2-01.azurewebsites.net/api/hipaa_check?code=Wmaumz_1yIvt0DiR37hfCErtNIwzyLhXlVJPPpg5SenMAzFuVZVMPQ==&debug=1";

const EXTRACT_URL =
  "https://request-function-eedjehbjbngpa8ha.eastus2-01.azurewebsites.net/api/extract_order?code=Wmaumz_1yIvt0DiR37hfCErtNIwzyLhXlVJPPpg5SenMAzFuVZVMPQ==&debug=1";


function getFileOrThrow() {
  const out = document.getElementById("output");
  const input = document.getElementById("fileInput");

  if (!input.files.length) {
    out.innerText = "Select a PDF first.";
    throw new Error("No file selected");
  }

  return input.files[0];
}

async function postFile(url, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(url, { method: "POST", body: formData });
  const raw = await res.text();

  let data;
  try { data = JSON.parse(raw); }
  catch { data = raw; }

  return { res, data };
}

function pretty(data) {
  if (typeof data === "string") return data;
  return JSON.stringify(data, null, 2);
}

function renderHipaa(data) {
  if (!data || typeof data !== "object") return pretty(data);

  let s = "";
  s += `Order Type: ${data.order_type}\n`;
  s += `Doc Kind: ${data.doc_kind}\n`;
  s += `Signature: ${data.signature?.signature_type || "unknown"} (${data.signature?.confidence || "low"})\n\n`;
  s += `Compliance Score: ${data.compliance_score}%\n`;
  s += `Risk: ${(data.risk_level || "").toUpperCase()}\n\n`;

  if (data.missing_items?.length) {
    s += "Missing:\n";
    data.missing_items.forEach(x => s += `  - ${x}\n`);
    s += "\n";
  }

  if (data.results?.length) {
    s += "Results:\n";
    data.results.forEach(r => {
      s += `--- ${r.id} | ${r.status}\n`;
      if (r.evidence) s += `    evidence: ${r.evidence}\n`;
    });
    s += "\n";
  }

  return s;
}

function renderExtract(data) {
  if (!data || typeof data !== "object") return pretty(data);

  let s = "";
  s += `External ID: ${data.external_id}\n`;
  s += `Order Type: ${data.order_type}\n`;
  s += `DOS: ${data.dos}\n`;
  s += `Patient Name: ${data.patient_name}\n`;
  s += `DOB: ${data.dob}\n`;
  s += `Pick Up Provider: ${data.pickup_provider}\n\n`;

  s += "Evidence:\n";
  const ev = data.evidence || {};
  Object.keys(ev).forEach(k => {
    if (ev[k]) s += `  - ${k}: ${ev[k]}\n`;
  });

  if (data.timing_ms) {
    s += `\nTiming (ms): ${JSON.stringify(data.timing_ms)}\n`;
  }

  return s;
}

async function extractOrder() {
  const out = document.getElementById("output");
  out.innerText = "Extracting order data...";

  try {
    const file = getFileOrThrow();
    const { res, data } = await postFile(EXTRACT_URL, file);

    if (!res.ok) {
      out.innerText = `Status: ${res.status}\n\n${pretty(data)}`;
      return;
    }

    out.innerText = renderExtract(data);

  } catch (e) {
    out.innerText = `ERROR:\n${e.message}`;
  }
}

async function runHipaa(reviewer) {
  const out = document.getElementById("output");
  out.innerText = `Running HIPAA Checklist ${reviewer}...`;

  try {
    const file = getFileOrThrow();
    const url = HIPAA_URL + `&reviewer=${reviewer}`;

    const { res, data } = await postFile(url, file);

    if (!res.ok) {
      out.innerText = `Status: ${res.status}\n\n${pretty(data)}`;
      return;
    }

    out.innerText = renderHipaa(data);

  } catch (e) {
    out.innerText = `ERROR:\n${e.message}`;
  }
}
