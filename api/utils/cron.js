import cron from 'cron';
import https from 'https';

const URL = 'https://musify-music-player.onrender.com/';

const job = new cron.CronJob("*/10 * * * *", () => {
      https.get(URL, (res) => {
            if (res.statusCode === 200) {
                  console.log("Ping successful ✅");
            } else {
                  console.log("Ping failed ❌");
            }
      }).on('error', (e) => {
            console.log("Error while sending ping:", e);
      });
});

export default job;