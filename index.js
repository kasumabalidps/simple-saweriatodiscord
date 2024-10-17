const { Client } = require("saweria");
const client = new Client();

const { WebhookClient } = require("discord.js");
const dotenv = require("dotenv");
dotenv.config();

client.on("login", (user) => {
	console.log("Logged in as: ", user.username);
});
client.login(process.env.SAWERIA_EMAIL, process.env.SAWERIA_PASSWORD).catch((error) => {
  console.error("Login failed: ", error.message || error);
});

client.on("donations", (donations) => {
  // convert donations to json
  const jsonDonations = JSON.stringify(donations);
  //console.log(jsonDonations);
  const donationsArray = JSON.parse(jsonDonations); 
  if (donationsArray.length > 0 && donationsArray[0].amount > 0) {
    console.log("Donasi Berjumlah: ", donationsArray[0].amount);
    // kirim ke discord webhook
    const webhook = new WebhookClient({
      url: process.env.DISCORD_WEBHOOK,
    });

    const embed = {
      color: 0x00ff99,
      title: "🎉 Donasi Diterima! 🎉",
      fields: [
        { name: "👤 Donator", value: ` \`\`\`${donationsArray[0].donator}\`\`\` `, inline: true },
        { name: "💰 Jumlah Donasi", value: ` \`\`\`Rp ${donationsArray[0].amount.toString()}\`\`\` `, inline: true },
        { name: "💬 Pesan dari Donator", value: ` \`\`\`${donationsArray[0].message || "Tidak ada pesan yang disertakan"}\`\`\` `, inline: false }
      ],
      image: donationsArray[0]?.media?.src?.[0] && 
       donationsArray[0].media.src[0].trim() !== '' &&
       !donationsArray[0].media.src[0].endsWith('.gif')
      ? { url: donationsArray[0].media.src[0] }
      : undefined,
      footer: { text: "Setiap donasi sangat berarti bagi kami! ❤️" },
      timestamp: new Date()
    };

    webhook.send({ content: "@everyone", embeds: [embed] });
  }
});