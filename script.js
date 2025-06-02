const qrCanvas = document.getElementById("qrCanvas");

document.getElementById("generateBtn").addEventListener("click", generateQR);
document.getElementById("downloadbtn").addEventListener("click", downloadQr);


//function for generate qr

function generateQR(){
    const type = document.getElementById("inputType").value;
    const rawdata = document.getElementById("inputData").value.trim();
    const color = document.getElementById("inputColor").value;
    const size = parseInt (document.getElementById("inputSize").value||200);
    const bgColor = document.getElementById("inputBgColor").value;
    const logo = document.getElementById("inputLogo").files[0];

    if(!rawdata){
        alert("please enter some data...");
        return;
    }

    let data = rawdata;
    if(type === "email"){
        data = `mailto:${rawdata}`;
    }
    else if(type === "url" && !rawdata.startsWith("http")){
        data = `https://${rawdata}`;
    }
    else if(type === "wifi") {
        const ssid = prompt("Enter WiFi SSID:");
        const pass = prompt("Enter WiFi Password:");
        const encryption = prompt("Enter Encryption Type (WPA/WEP):", "WPA");
        data = `WIFI:T:${encryption};S:${ssid};P:${pass};;`;
    }

  QRCode.toCanvas(qrCanvas, data, {
        width: size,
        color:{
            dark: color,
            light:bgColor
        }

    }, err=>{
        if (err) return console.error(err);

        //draw logo if exixt
        if (logo) {
           const newLogo = qrCanvas.getContext("2d");
           const img = new Image();
           img.onload = () => {
               const logoSize = size * 0.2;
               const x = (qrCanvas.width - logoSize) / 2;
               const y = (qrCanvas.height - logoSize) / 2;
               newLogo.drawImage(img, x, y, logoSize, logoSize);
       };
       img.src = URL.createObjectURL(logo);
    }

    });
}

function updatePreview(){
    document.getElementById("inputData").addEventListener("input", updatePreview);
    generateQR();
}

function downloadQr(){
    if(!qrCanvas) return alert("Generate a QR Code first");
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = qrCanvas.toDataURL();
    link.click();
}


