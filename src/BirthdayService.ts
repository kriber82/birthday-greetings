import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import {Employee} from './Employee'
import {XDate} from './XDate'
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";

export class BirthdayService {
    async sendGreetings(fileName: string, xDate: XDate, smtpHost: string, smtpPort: number) {
        const data = fs.readFileSync(path.resolve(__dirname, `../resources/${fileName}`), 'utf-8')
        const strings = data.split(/\r?\n/)
        strings.shift() // skip header
        for (const str of strings) {
            const employeeData = str.split(', ')
            const employee = new Employee(employeeData[1], employeeData[0], employeeData[2], employeeData[3])
            if (employee.isBirthday(xDate)) {
                const recipient = employee.getEmail()
                const body = 'Happy Birthday, dear %NAME%!'.replace('%NAME%', employee.getFirstName())
                const subject = 'Happy Birthday!'
                await this.sendMessage(smtpHost, smtpPort, 'sender@here.com', subject, body, recipient)
            }
        }
    }

    async sendMessage(smtpHost: string, smtpPort: number, sender: string,
                      subject: string, body: string, recipient: string) {

        // create a mail transport
        const options: SMTPTransport.Options = {host: smtpHost, port: smtpPort}
        const transport = nodemailer.createTransport(options)

        // construct the message
        const message: Mail.Options = {
            from: sender,
            to: [recipient],
            subject,
            text: body
        }

        // send the message
        await transport.sendMail(message)
    }

}
