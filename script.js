const topCandles = document.getElementById("top-candles");
const bottomCandles = document.getElementById("bottom-candles");
const candleCountElem = document.getElementById("candleCount");

function addCandle() {
  const candle = document.createElement("div");
  candle.classList.add("candle");
  
  // Randomly put candle on top or bottom tier
  if (Math.random() < 0.5) {
    topCandles.appendChild(candle);
  } else {
    bottomCandles.appendChild(candle);
  }

  const total = document.querySelectorAll(".candle").length;
  candleCountElem.textContent = total;
}

function loadCandlesFromURL() {
  const params = new URLSearchParams(window.location.search);
  const count = parseInt(params.get("candles")) || 0;

  topCandles.innerHTML = "";
  bottomCandles.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const candle = document.createElement("div");
    candle.classList.add("candle");
    if (Math.random() < 0.5) topCandles.appendChild(candle);
    else bottomCandles.appendChild(candle);
  }

  candleCountElem.textContent = count;
}

function generateLink() {
  const total = document.querySelectorAll(".candle").length;
  const url = `${window.location.origin}${window.location.pathname}?candles=${total}`;
  prompt("Copy this link and share:", url);
}

function blowCandles() {
  const candles = document.querySelectorAll(".candle");
  candles.forEach(c => c.classList.add("out"));
}

function initMicrophone() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function detectBlow() {
        analyser.getByteFrequencyData(dataArray);
        let volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        if (volume > 40) blowCandles();
        requestAnimationFrame(detectBlow);
      }

      detectBlow();
    })
    .catch(err => console.error("Mic error:", err));
}

window.addEventListener("DOMContentLoaded", () => {
  if (window.location.search.includes("candles")) loadCandlesFromURL();
  initMicrophone();
});
