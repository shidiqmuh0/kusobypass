const axios = require("axios");
const cheerio = require("cheerio");
const readline = require("readline");

// Membuat interface pembaca baris dari terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to scrape data from a given URL
function kusoBypass(url) {
    return new Promise((resolve, reject) => {
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

                    const scrapedData = [];

                    // Loop melalui setiap elemen <strong>
                    strongElements.each((index, element) => {
                        const strongText = $(element).text();

                        // Cari elemen <a> yang menjadi anak dari elemen <strong>
                        const siblingLinks = $(element).nextAll("a");

                        const links = [];

                        // Loop melalui elemen-elemen <a> yang ditemukan
                        siblingLinks.each((index, siblingElement) => {
                            const link = $(siblingElement).attr("href");
                            const linkText = $(siblingElement).text();
                            const combinedText = `${linkText} | ${link}`;
                            links.push(combinedText);
                        });

                        // Push data to the scrapedData array
                        scrapedData.push({ size: strongText, links: links });
                    });

                    resolve(scrapedData);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// Export the function
module.exports = kusoBypass;

// Menutup interface pembaca baris setelah selesai
rl.close();