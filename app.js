//https://request-function-eedjehbjbngpa8ha.eastus2-01.azurewebsites.net/api/hipaa_check?code=Wmaumz_1yIvt0DiR37hfCErtNIwzyLhXlVJPPpg5SenMAzFuVZVMPQ==
const API_URL =
  "https://request-function-eedjehbjbngpa8ha.eastus2-01.azurewebsites.net/api/hipaa_check?code=Wmaumz_1yIvt0DiR37hfCErtNIwzyLhXlVJPPpg5SenMAzFuVZVMPQ==&debug=1";


/* =========================
   TEXT CHECK
========================= */

async function run() {
  const output = document.getElementById("output");
  const textInput = document.getElementById("input").value;

  output.innerText = "Loading...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ocr_text: textInput })
    });

    handleResponse(res);

  } catch (err) {
    output.innerText = "ERROR:\n" + err.message;
  }
}


/* =========================
   FILE CHECK
========================= */

async function uploadFile() {
  const output = document.getElementById("output");
  const fileInput = document.getElementById("fileInput");

  if (!fileInput.files.length) {
    output.innerText = "Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  output.innerText = "Uploading...";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      body: formData
    });

    handleResponse(res);

  } catch (err) {
    output.innerText = "ERROR:\n" + err.message;
  }
}


/* =========================
   RESPONSE HANDLING
========================= */

async function handleResponse(res) {
  const output = document.getElementById("output");

  const rawText = await res.text();

  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    output.innerText =
      "Status: " + res.status + "\n\n" + rawText;
    return;
  }

  if (!res.ok) {
    output.innerText =
      "Status: " + res.status + "\n\n" +
      JSON.stringify(data, null, 2);
    return;
  }

  output.innerText = renderResult(data);
}


/* =========================
   FORMATTED OUTPUT
========================= */

function renderResult(data) {
  if (!data || data.error) {
    return JSON.stringify(data, null, 2);
  }

  let text = "";

  text += "Compliance Score: " + data.compliance_score + "%\n";
  text += "Risk Level: " + data.risk_level.toUpperCase() + "\n\n";

  if (data.missing_items && data.missing_items.length) {
    text += "Missing Items:\n";
    data.missing_items.forEach(id => {
      text += "  - " + id + "\n";
    });
    text += "\n";
  }

  text += "Detailed Results:\n";

  data.results.forEach(r => {
    text += "----------------------------------\n";
    text += "ID: " + r.id + "\n";
    text += "Status: " + r.status.toUpperCase() + "\n";
    text += "Evidence: " + r.evidence + "\n\n";
  });

  return text;
}
