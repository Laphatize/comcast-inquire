// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
});

import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect();

export async function storeMessageHistory(userId, message) {
  const key = `user:${userId}:messages`;
  await redisClient.rPush(key, JSON.stringify(message));
}

export async function retrieveMessageHistory(userId) {
  const key = `user:${userId}:messages`;
  const messages = await redisClient.lRange(key, 0, -1);
  return messages.map(message => JSON.parse(message));
}

// get the selected services from redis
export async function retrieveSelectedServices(userId) {
  const key = `selectedServices_${userId}`;
  const selectedServices = await redisClient.get(key);
  return selectedServices;
}



export default async function handler(req, res) {

    let history = [];
    if (await retrieveMessageHistory(req.body.user.id)) {
     history = await retrieveMessageHistory(req.body.user.id);
    }

    let customerProducts = "";
    if (await retrieveSelectedServices(req.body.user.id)) {
        customerProducts = await retrieveSelectedServices(req.body.user.id);
        console.log(" CUSTOMER PRODUCTS " + customerProducts)
    }


    // if the history length is greater than 30, remove the  some of the oldest messages
    if (history.length > 30) {

        // dont judge
        for (let i = 0; i < 10; i++) {
            history.shift();
        }

    }

    
 


    let messages = [{ role: "system", content: `You are a customer support / sales agent for Comcast. The customer (${req.body.user.name}) has the following selected services: ${customerProducts}. Always provide a link to one of the following Comcast articles. Never given anything else! LIST OF JSON ARTICLES: [
        {"name": "General Xfinity Support", "link": "https://www.xfinity.com/support"},
        {"name": "Xfinity Contact Us", "link": "https://www.xfinity.com/support/contact-us"},
        {"name": "Internet Help and Support", "link": "https://www.xfinity.com/support/internet"},
        {"name": "Xfinity Chat Support", "link": "https://www.xfinity.com/chat"},
        {"name": "Xfinity Mobile Support", "link": "https://www.xfinity.com/mobile/support"},
        {"name": "Xfinity Customer Login Portal", "link": "https://customer.xfinity.com/?beta=1%5C"},
        {"name": "Report Xfinity Service Issues", "link": "https://www.xfinity.com/support/articles/report-issues-xfinity-services"},
        {"name": "Xfinity Service Status", "link": "https://www.xfinity.com/support/status"},
        {"name": "Check for Service Outage", "link": "https://www.xfinity.com/support/articles/check-service-outage"},
        {"name": "Bill Payment Support", "link": "https://www.xfinity.com/support/articles/pay-your-bill-echat"},
        {"name": "Troubleshoot Email Errors", "link": "https://www.xfinity.com/support/articles/email-errors"},
        {"name": "Xfinity Home Support", "link": "https://www.xfinity.com/support/xfinity-home"},
        {"name": "TV Help and Support", "link": "https://www.xfinity.com/support/tv"},
        {"name": "Troubleshooting TV Issues", "link": "https://www.xfinity.com/support/repair/tv/"},
        {"name": "Xfinity Rewards Information", "link": "https://www.xfinity.com/support/articles/xfinity-rewards"},
        {"name": "Schedule a Callback", "link": "https://www.xfinity.com/support/schedule-callback"},
        {"name": "WiFi Network Help", "link": "https://www.xfinity.com/support/articles/wifi-change-admin-tool"},
        {"name": "Remote Programming", "link": "https://www.xfinity.com/support/remotes"},
        {"name": "Store Locator", "link": "https://www.xfinity.com/support/store-selector"},
        {"name": "ACP Benefit Transfer", "link": "https://www.xfinity.com/support/articles/emergency-broadband-benefit-enroll"},
        {"name": "Account & Billing Help", "link": "https://www.xfinity.com/support/account-billing"},
        {"name": "Xfinity Login", "link": "https://my.xfinity.com/oauth/login"},
        {"name": "Issue Reporting", "link": "https://www.xfinity.com/support/articles/report-an-issue"},
        {"name": "Xfinity xFi", "link": "https://www.xfinity.com/support/articles/xfinity-xfi-overview"},
        {"name": "Xfinity Stream App", "link": "https://www.xfinity.com/support/articles/tv-app-overview"},
        {"name": "TV Support", "link": "https://www.xfinity.com/support/tv"},
        {"name": "Bridge Mode on Gateway", "link": "https://www.xfinity.com/support/articles/wireless-gateway-enable-disable-bridge-mode"},
        {"name": "Gateway Overview", "link": "https://www.xfinity.com/support/articles/broadband-gateways-userguides"},
        {"name": "Internet Troubleshooting", "link": "https://www.xfinity.com/support/articles/internet-connectivity-troubleshooting"},
        {"name": "Email Error Troubleshooting", "link": "https://www.xfinity.com/support/articles/email-errors"},
        {"name": "Xfinity Home Assistance", "link": "https://www.xfinity.com/support/xfinity-home"},
        {"name": "Change WiFi Name and Password", "link": "https://www.xfinity.com/support/articles/wifi-change-admin-tool"},
        {"name": "Program Your Remote", "link": "https://www.xfinity.com/support/remotes"},
        {"name": "Service and Payment Centers", "link": "https://www.xfinity.com/support/store-selector"},
        {"name": "Transfer ACP Benefits", "link": "https://www.xfinity.com/support/articles/emergency-broadband-benefit-enroll"},
        {"name": "How to Make a Payment", "link": "https://www.xfinity.com/support/articles/pay-your-bill-echat"},
        {"name": "Xfinity Rewards", "link": "https://www.xfinity.com/support/articles/xfinity-rewards"},
        {"name": "Xfinity Stream App Overview", "link": "https://www.xfinity.com/support/articles/tv-app-overHere is a JSON array with the names and links of 56 Xfinity support articles for your convenience:
        {"name": "General Xfinity Support", "link": "https://www.xfinity.com/support"},
        {"name": "Xfinity Contact Us", "link": "https://www.xfinity.com/support/contact-us"},
        {"name": "Internet Help and Support", "link": "https://www.xfinity.com/support/internet"},
        {"name": "Xfinity Chat Support", "link": "https://www.xfinity.com/chat"},
        {"name": "Xfinity Mobile Support", "link": "https://www.xfinity.com/mobile/support"},
        {"name": "Xfinity Customer Login Portal", "link": "https://customer.xfinity.com/?beta=1%5C"},
        {"name": "Report Xfinity Service Issues", "link": "https://www.xfinity.com/support/articles/report-issues-xfinity-services"},
        {"name": "Xfinity Service Status", "link": "https://www.xfinity.com/support/status"},
        {"name": "Check for Service Outage", "link": "https://www.xfinity.com/support/articles/check-service-outage"},
        {"name": "Bill Payment Support", "link": "https://www.xfinity.com/support/articles/pay-your-bill-echat"},
        {"name": "Troubleshoot Email Errors", "link": "https://www.xfinity.com/support/articles/email-errors"},
        {"name": "Xfinity Home Support", "link": "https://www.xfinity.com/support/xfinity-home"},
        {"name": "TV Help and Support", "link": "https://www.xfinity.com/support/tv"},
        {"name": "Troubleshooting TV Issues", "link": "https://www.xfinity.com/support/repair/tv/"},
        {"name": "Xfinity Rewards Information", "link": "https://www.xfinity.com/support/articles/xfinity-rewards"},
        {"name": "Schedule a Callback", "link": "https://www.xfinity.com/support/schedule-callback"},
        {"name": "WiFi Network Help", "link": "https://www.xfinity.com/support/articles/wifi-change-admin-tool"},
        {"name": "Remote Programming", "link": "https://www.xfinity.com/support/remotes"},
        {"name": "Store Locator", "link": "https://www.xfinity.com/support/store-selector"},
        {"name": "ACP Benefit Transfer", "link": "https://www.xfinity.com/support/articles/emergency-broadband-benefit-enroll"},
        {"name": "Account & Billing Help", "link": "https://www.xfinity.com/support/account-billing"},
        {"name": "Xfinity Login", "link": "https://my.xfinity.com/oauth/login"},
        {"name": "Issue Reporting", "link": "https://www.xfinity.com/support/articles/report-an-issue"},
        {"name": "Xfinity xFi", "link": "https://www.xfinity.com/support/articles/xfinity-xfi-overview"},
        {"name": "Xfinity Stream App", "link": "https://www.xfinity.com/support/articles/tv-app-overview"},
        {"name": "TV Support", "link": "https://www.xfinity.com/support/tv"},
        {"name": "Bridge Mode on Gateway", "link": "https://www.xfinity.com/support/articles/wireless-gateway-enable-disable-bridge-mode"},
        {"name": "Gateway Overview", "link": "https://www.xfinity.com/support/articles/broadband-gateways-userguides"},
        {"name": "Internet Troubleshooting", "link": "https://www.xfinity.com/support/articles/internet-connectivity-troubleshooting"},
        {"name": "Email Error Troubleshooting", "link": "https://www.xfinity.com/support/articles/email-errors"},
        {"name": "Xfinity Home Assistance", "link": "https://www.xfinity.com/support/xfinity-home"},
        {"name": "Change WiFi Name and Password", "link": "https://www.xfinity.com/support/articles/wifi-change-admin-tool"},
        {"name": "Program Your Remote", "link": "https://www.xfinity.com/support/remotes"},
        {"name": "Service and Payment Centers", "link": "https://www.xfinity.com/support/store-selector"},
        {"name": "Transfer ACP Benefits", "link": "https://www.xfinity.com/support/articles/emergency-broadband-benefit-enroll"},
        {"name": "How to Make a Payment", "link": "https://www.xfinity.com/support/articles/pay-your-bill-echat"},
        {"name": "Xfinity Rewards", "link": "https://www.xfinity.com/support/articles/xfinity-rewards"},
        {"name": "Xfinity Stream App Overview", "link": "https://www.xfinity.com/support/articles/tv-app-overHere is a JSON array with the names and links of 56 Xfinity support articles for your convenience:
        {"name": "General Xfinity Support", "link": "https://www.xfinity.com/support"},
        {"name": "Xfinity Contact Us", "link": "https://www.xfinity.com/support/contact-us"},
        {"name": "Internet Help and Support", "link": "https://www.xfinity.com/support/internet"},
        {"name": "Xfinity Chat Support", "link": "https://www.xfinity.com/chat"},
        {"name": "Xfinity Mobile Support", "link": "https://www.xfinity.com/mobile/support"},
        {"name": "Xfinity Customer Login Portal", "link": "https://customer.xfinity.com/?beta=1%5C"},
        {"name": "Report Xfinity Service Issues", "link": "https://www.xfinity.com/support/articles/report-issues-xfinity-services"},
        {"name": "Xfinity Service Status", "link": "https://www.xfinity.com/support/status"},
        {"name": "Check for Service Outage", "link": "https://www.xfinity.com/support/articles/check-service-outage"},
        {"name": "Bill Payment Support", "link": "https://www.xfinity.com/support/articles/pay-your-bill-echat"},
        {"name": "Troubleshoot Email Errors", "link": "https://www.xfinity.com/support/articles/email-errors"},
        {"name": "Xfinity Home Support", "link": "https://www.xfinity.com/support/xfinity-home"},
        {"name": "TV Help and Support", "link": "https://www.xfinity.com/support/tv"},
        {"name": "Troubleshooting TV Issues", "link": "https://www.xfinity.com/support/repair/tv/"},
        {"name": "Xfinity Rewards Information", "link": "https://www.xfinity.com/support/articles/xfinity-rewards"},
        {"name": "Schedule a Callback", "link": "https://www.xfinity.com/support/schedule-callback"},
        {"name": "WiFi Network Help", "link": "https://www.xfinity.com/support/articles/wifi-change-admin-tool"},
        {"name": "Remote Programming", "link": "https://www.xfinity.com/support/remotes"},
        {"name": "Store Locator", "link": "https://www.xfinity.com/support/store-selector"},
        {"name": "ACP Benefit Transfer", "link": "https://www.xfinity.com/support/articles/emergency-broadband-benefit-enroll"},
        {"name": "Account & Billing Help", "link": "https://www.xfinity.com/support/account-billing"},
        {"name": "Xfinity Login Portal", "link": "https://my.xfinity.com/oauth/login"},
        {"name": "Issue Reporting", "link": "https://www.xfinity.com/support/articles/report-an-issue"},
        {"name": "Xfinity xFi", "link": "https://www.xfinity.com/support/articles/xfinity-xfi-overview"},
        {"name": "Xfinity Stream App", "link": "https://www.xfinity.com/support/articles/tv-app-overview"},
        {"name": "TV Support", "link": "https://www.xfinity.com/support/tv"},
        {"name": "Bridge Mode on Gateway", "link": "https://www.xfinity.com/support/articles/wireless-gateway-enable-disable-bridge-mode"},
        {"name": "Gateway Overview", "link": "https://www.xfinity.com/support/articles/broadband-gateways-userguides"},
        {"name": "Internet Troubleshooting", "link": "https://www.xfinity.com/support/articles/internet-connectivity-troubleshooting"},
        {"name": "Email Error Troubleshooting", "link": "https://www.xfinity.com/support/articles/email-errors"},
        {"name": "Xfinity Home Assistance", "link": "https://www.xfinity.com/support/xfinity-home"},
        {"name": "Change WiFi Name and Password", "link": "https://www.xfinity.com/support/articles/wifi-change-admin-tool"},
        {"name": "Program Your Remote", "link": "https://www.xfinity.com/support/remotes"},
        {"name": "Service and Payment Centers", "link": "https://www.xfinity.com/support/store-selector"},
        {"name": "Transfer ACP Benefits", "link": "https://www.xfinity.com/support/articles/emergency-broadband-benefit-enroll"},
        {"name": "How to Make a Payment", "link": "https://www.xfinity.com/support/articles/pay-your-bill-echat"},
        {"name": "Email Error Troubleshooting", "link": "https://www.xfinity.com/support/articles/email-errors"},
        {"name": "Xfinity Home Support", "link": "https://www.xfinity.com/support/xfinity-home"},
        {"
          END OF ARTICLES
          You are a customer support / sales agent for Comcast. The customer (${req.body.user.name}) (aka the person you are talking too) OWNS THE CURRENT COMCAST/XFINITY services: ${customerProducts}. Always provide a link to one of the following Comcast articles. Never given anything else! ` }];

    if (history && history.length > 0) {
        messages.push({ role: "system", content: `The following is the message history from the user: ${history.toString()}` });
    }


    // push new message
    messages.push({ role: "user", content: req.body.message + `\n (Customer owns these ${customerProducts}, but don't bring it up unless asked.)` });

    const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-4",
      });
    
      console.log(completion.choices[0]);


      // update history
      await storeMessageHistory(req.body.user.id, completion.choices[0].message.content);


      
      return res.json({
        response: completion.choices[0].message.content
      })

      
  }
  