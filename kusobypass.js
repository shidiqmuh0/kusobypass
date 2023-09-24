const axios = require("axios");
const cheerio = require("cheerio");
const readline = require("readline");

// Membuat interface pembaca baris dari terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Meminta pengguna untuk memasukkan URL
rl.question("Masukkan URL: ", (userInput) => {
    const url = userInput;

    axios
        .get(url)
        .then((response) => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);

                // Cari elemen <div> dengan id "dl" dan class "smokeurlrh"
                const smokeUrl = $(".smokeurlrh");

                // Ambil semua elemen <strong> di dalam <div> tersebut
                const strongElements = smokeUrl.find("strong");

                // Loop melalui setiap elemen <strong>
                strongElements.each((index, element) => {
                    const strongText = $(element).text();
                    console.log("Ukuran:", strongText);

                    // Cari elemen <a> yang menjadi anak dari elemen <strong>
                    const siblingLinks = $(element).nextAll("a");

                    // Loop melalui elemen-elemen <a> yang ditemukan
                    siblingLinks.each((index, siblingElement) => {
                        const link = $(siblingElement).attr("href");
                        const linkText = $(siblingElement).text();
                        const combinedText = `${linkText} | ${link}`;
                        console.log(combinedText);
                    });
                });
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    // Menutup interface pembaca baris setelah selesai
    rl.close();
});
