const axios = require("axios");

const fonts = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
    j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜",
    J: "𝗝", K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥",
    S: "𝗦", T: "𝗧", U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
};

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    credits: "Vincent Armenion",
    description: "Interact with Llama AI",
    hasPrefix: false,
    cooldown: 5,
    aliases: ["llama", "AI", "Ai"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        let q = args.join(" ");
        if (!q) {
            return api.sendMessage("Missing question☹️", event.threadID, event.messageID);
        }

        const initialMessage = await new Promise((resolve, reject) => {
            api.sendMessage("⏱️Please wait...", event.threadID, (err, info) => {
                if (err) return reject(err);
                resolve(info);
            });
        });

        try {
            const response = await axios.get(`https://kaiz-apis.gleeze.com/api/gpt-4o?q=${encodeURIComponent(q)}&uid=100`);
            const answer = response.data.response;

            // Replace characters in the response with stylized characters from fonts
            const stylizedResponse = answer.split('').map(char => fonts[char] || char).join('');

            const formattedResponse = `𝗩𝗜𝗡𝗖𝗘𝗡𝗧 𝗕𝗢𝗧\n❖═══════━━━◈━━━═══════❖\n${stylizedResponse}\n❖═══════━━◈━━═══════❖\𝗢𝘄𝗻𝗲𝗿-𝗟𝗶𝗻𝗸:https://www.facebook.com/100090775159086`;

            await api.editMessage(formattedResponse, initialMessage.messageID);
        } catch (error) {
            console.error("Error fetching or processing API response:", error);
            await api.editMessage("An error occurred while processing your request.", initialMessage.messageID);
        }
    } catch (error) {
        console.error("Error in ai command:", error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};
