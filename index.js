const express = require('express');
const router = express.Router();
const cors = require('cors');
const morgan = require('morgan');
const nodemailer = require('nodemailer');
const Joi = require('joi');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());


const contactEmail = nodemailer.createTransport({
   service: 'Yahoo',
  port: 445,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
    tls: {
   rejectUnauthorized: true,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Ready to Send');
  }
});


router.post('/contact', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const mail = {
    from: name,
    to: process.env.EMAIL,
    subject: 'Contact Form Submission',
    html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json({ status: 'ERROR' });
    } else {
      res.json({ status: 'Message Sent' });
    }
      contactEmail.close();
  });
});

app.use('/', router);

app.listen(8080, () => console.log('Server Running'));
