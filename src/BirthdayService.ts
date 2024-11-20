import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import {Employee} from './Employee'
import {XDate} from './XDate'
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";

export class BirthdayService {
    async sendGreetings(fileName: string, xDate: XDate, smtpHost: string, smtpPort: number) {
        // read file
        const data = fs.readFileSync(path.resolve(__dirname, `../resources/${fileName}`), 'utf-8')
        const split = data.split(/\r?\n/)

        for (let i = 0; i < split.length; i++) {
            const str = split[i];

            // handle header
            if (i === 0) {
                continue
            }

            // parse csv record
            const rec = str.split(', ')
            const e = new Employee(rec[1], rec[0], rec[2], rec[3])

            // check if we need to send a birthday message
            if (e.isBirthday(xDate)) {
                // actually send birthday email
                const body = 'Happy Birthday, dear %NAME%!'.replace('%NAME%', e.getFirstName())
                await this.sendMessage(smtpHost, smtpPort, 'sender@here.com', 'Happy Birthday!', body, e.getEmail())
            }
        }
    }

    async sendMessage(smtpHost: string, smtpPort: number, sender: string,
                      subject: string, body: string, recipient: string) {

        // create a mail transport
        const o: SMTPTransport.Options = {host: smtpHost, port: smtpPort}
        const t = nodemailer.createTransport(o)

        // construct the message
        const msg: Mail.Options = {
            from: sender,
            to: [recipient],
            subject,
            text: body
        }

        // send the message
        await t.sendMail(msg)
    }

}
