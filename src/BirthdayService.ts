import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import {Employee} from './Employee'
import {XDate} from './XDate'
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";

export class BirthdayService {
    async sendGreetings(employeeCsvFilename: string, today: XDate, smtpHost: string, smtpPort: number) {
        const employeeCsvFileContent = fs.readFileSync(path.resolve(__dirname, `../resources/${employeeCsvFilename}`), 'utf-8')
        const employeeCsvLines = employeeCsvFileContent.split(/\r?\n/)

        for (let i = 0; i < employeeCsvLines.length; i++) {
            const employeeCsvLine = employeeCsvLines[i];

            const skipCsvHeaderLine = i === 0;
            if (skipCsvHeaderLine) {
                continue
            }

            // parse csv record
            const employeeCsvFields = employeeCsvLine.split(', ')
            const firstName = employeeCsvFields[1];
            const lastName = employeeCsvFields[0];
            const birthDate = employeeCsvFields[2];
            const email = employeeCsvFields[3];
            const employee = new Employee(firstName, lastName, birthDate, email)

            const shouldSendBirthdayMessage = employee.isBirthday(today);
            if (shouldSendBirthdayMessage) {
                const subject = 'Happy Birthday!';
                const body = 'Happy Birthday, dear %NAME%!'.replace('%NAME%', employee.getFirstName())
                const recipient = employee.getEmail();
                await this.sendMessage(smtpHost, smtpPort, 'sender@here.com', subject, body, recipient)
            }
        }
    }

    async sendMessage(smtpHost: string, smtpPort: number, sender: string,
                      subject: string, body: string, recipient: string) {
        const options: SMTPTransport.Options = {host: smtpHost, port: smtpPort}
        const transport = nodemailer.createTransport(options)

        const message: Mail.Options = {
            from: sender,
            to: [recipient],
            subject,
            text: body
        }

        await transport.sendMail(message)
    }

}
