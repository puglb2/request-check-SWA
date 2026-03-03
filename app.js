//https://request-function-eedjehbjbngpa8ha.eastus2-01.azurewebsites.net/api/hipaa_check?code=Wmaumz_1yIvt0DiR37hfCErtNIwzyLhXlVJPPpg5SenMAzFuVZVMPQ==
  
async function run() {
  const output = document.getElementById("output");
  const text = document.getElementById("input").value;

  output.innerText = "Loading...";

  try {
    const res = await fetch(
      "https://request-function-eedjehbjbngpa8ha.eastus2-01.azurewebsites.net/api/hipaa_check?code=Wmaumz_1yIvt0DiR37hfCErtNIwzyLhXlVJPPpg5SenMAzFuVZVMPQ==&debug=1",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ocr_text: text })
      }
    );

    const data = await res.json();
    output.innerText = JSON.stringify(data, null, 2);

  } catch (err) {
    output.innerText = "ERROR:\n" + err.message;
  }
}


async function uploadFile() {
  const output = document.getElementById("output");
  const fileInput = document.getElementById("fileInput");

  if (!fileInput.files.length) {
    output.innerText = "Please select a file.";
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();
  formData.append("file", file);

  output.innerText = "Uploading...";

  try {
    const res = await fetch(
      "https://request-function-eedjehbjbngpa8ha.eastus2-01.azurewebsites.net/api/hipaa_check?code=Wmaumz_1yIvt0DiR37hfCErtNIwzyLhXlVJPPpg5SenMAzFuVZVMPQ==&debug=1",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await res.json();
    output.innerText = JSON.stringify(data, null, 2);

  } catch (err) {
    output.innerText = "ERROR:\n" + err.message;
  }
}
