async function run() {
  const output = document.getElementById("output");
  const text = document.getElementById("input").value;

  output.innerText = "Loading...";

  try {
    const res = await fetch("/api/hipaa_check?debug=1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ocr_text: text
      })
    });

    const requestId = res.headers.get("x-request-id");

    const rawText = await res.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = rawText;
    }

    output.innerText =
      "Status: " + res.status + "\n" +
      "Request ID: " + requestId + "\n\n" +
      JSON.stringify(data, null, 2);

  } catch (err) {
    output.innerText = "ERROR:\n" + err.message;
  }
}
