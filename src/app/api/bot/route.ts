import { Bot, webhookCallback } from "grammy";
import { NextResponse } from "next/server";

// Initialize the bot with your token
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN || "");

// Define bot commands
bot.command("start", (ctx) =>
  ctx.reply(
    "Welcome to the Cannabis Store! Use /search <strain> to find a strain or /help for assistance."
  )
);
bot.command("help", (ctx) =>
  ctx.reply(
    "Commands:\n/search <strain> - Search for a strain\n/help - Show this message"
  )
);

// Sample strain data (replace with a database later)
const strains = [
  { name: "Blue Dream", thc: "18%", price: 25, effects: "Relaxing, Uplifting" },
  {
    name: "OG Kush",
    thc: "22%",
    price: 30,
    effects: "Euphoric, Stress-relieving",
  },
  {
    name: "Sour Diesel",
    thc: "20%",
    price: 28,
    effects: "Energizing, Creative",
  },
];

//handle /all command

bot.command("all", (ctx) => {
  if (strains.length === 0) {
    return ctx.reply("No strains available at the moment.");
  }

  const strainList = strains.map((strain) => `- ${strain.name}`).join("\n");
  ctx.reply(`Available strains:\n${strainList}`);
});
// Handle /search command
bot.command("search", async (ctx) => {
  const query = ctx.match.trim().toLowerCase(); // Get the strain name from the command (e.g., /search Blue Dream)
  if (!query) {
    return ctx.reply("Please provide a strain name, e.g., /search Blue Dream");
  }

  const strain = strains.find((s) => s.name.toLowerCase().includes(query));
  if (!strain) {
    return ctx.reply(
      "Strain not found. Try another strain, e.g., /search OG Kush"
    );
  }

  // Send strain details with purchase and chat options
  const message = `
  **${strain.name}**
  THC: ${strain.thc}
  Price: $${strain.price}/g
  Effects: ${strain.effects}
  `;
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Purchase", callback_data: `purchase_${strain.name}` },
          { text: "Join Chat", url: "https://t.me/your_group_or_channel" }, // Replace with your group/channel link
        ],
      ],
    },
  };
  await ctx.reply(message, keyboard);
});

// Handle purchase button clicks
bot.on("callback_query:data", async (ctx) => {
  const data = ctx.callbackQuery.data;
  if (data.startsWith("purchase_")) {
    const strainName = data.replace("purchase_", "");
    await ctx.reply(
      `You selected to purchase ${strainName}. Visit our website to complete your order: https://your-store.com/checkout`
    ); // Replace with your checkout URL
    await ctx.answerCallbackQuery(); // Acknowledge the button click
  }
});

// Handle webhook requests
export const POST = async (request) => {
  try {
    await webhookCallback(bot, "std/http")(request);
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
};
