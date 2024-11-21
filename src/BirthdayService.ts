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
        const employeeCsvLinesWitHeader = employeeCsvFileContent.split(/\r?\n/)
        const employeeCsvLinesWithoutHeader = employeeCsvLinesWitHeader.slice(1)

        for (const employeeCsvLine of employeeCsvLinesWithoutHeader) {
            const employee = this.parseEmployeeCsvLine(employeeCsvLine);
            await this.sendMessageOnBirthday(employee, today, smtpHost, smtpPort);
        }
    }

    private async sendMessageOnBirthday(employee: Employee, today: XDate, smtpHost: string, smtpPort: number) {
        const shouldSendBirthdayMessage = employee.isBirthday(today);
        if (shouldSendBirthdayMessage) {
            const subject = 'Happy Birthday!';
            const body = 'Happy Birthday, dear %NAME%!'.replace('%NAME%', employee.getFirstName())
            const recipient = employee.getEmail();
            await this.sendMessage(smtpHost, smtpPort, 'sender@here.com', subject, body, recipient)
        }
    }

    private parseEmployeeCsvLine(csvLine: string) {
        const csvFields = csvLine.split(', ')
        const firstName = csvFields[1];
        const lastName = csvFields[0];
        const birthDate = csvFields[2];
        const email = csvFields[3];
        return new Employee(firstName, lastName, birthDate, email);
    }

    private async sendMessage(smtpHost: string, smtpPort: number, sender: string,
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
