const nodemailer = require('nodemailer');
const { subscriber_notification } = require('../models/model.js');
const config = require('../config/appConfig');

const canSendEmail = Boolean(config.mail.user && config.mail.pass);

const transporter = canSendEmail
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.mail.user,
        pass: config.mail.pass,
      },
    })
  : null;

const sendNotificationToAll = async (req, res) => {
  try {
    if (!canSendEmail || !transporter) {
      return res.status(400).json({
        message: 'Email is not configured. Set GMAIL and APP_PASSWORD.',
      });
    }

    const subscribers = await subscriber_notification.find({}, { email: 1, _id: 0 });

    if (!subscribers.length) {
      return res.status(404).json({ message: 'No subscribers found.' });
    }

    const emails = subscribers.map((sub) => sub.email).filter(Boolean);
    const siteUrl = config.frontendUrl;

    await transporter.sendMail({
      from: config.mail.user,
      to: emails,
      subject: 'New Scholarship Opportunity',
      html: `
        <h2>New scholarship just added!</h2>
        <p>Visit our website now to explore and apply.</p>
        <a href="${siteUrl}" style="color: blue;">Visit Website</a>
      `,
    });

    return res.status(200).json({ message: 'Emails sent to all subscribers.' });
  } catch (error) {
    console.error('Error in sendNotificationToAll:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { sendNotificationToAll };
