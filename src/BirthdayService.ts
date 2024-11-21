import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import {Employee} from './Employee'
import {XDate} from './XDate'
import SMTPTransport from "nodemailer/lib/smtp-transport";
import Mail from "nodemailer/lib/mailer";

export class BirthdayService {
    async sendGreetings(employeeCsvFilename: string, today: XDate, mailService: MailService) {
        const employees = this.parseEmployeeCsvFile(employeeCsvFilename);
        await this.sendBirthdayGreetingsToEmployees(employees, today, mailService);
    }

    private parseEmployeeCsvFile(employeeCsvFilename: string) {
        const employeeCsvFileContent = fs.readFileSync(path.resolve(__dirname, `../resources/${employeeCsvFilename}`), 'utf-8')
        const employeeCsvLinesWithHeader = employeeCsvFileContent.split(/\r?\n/)
        const employeeCsvLinesWithoutHeader = employeeCsvLinesWithHeader.slice(1)
        return employeeCsvLinesWithoutHeader.map((employeeCsvLine) => this.parseEmployeeCsvLine(employeeCsvLine));
    }

    private parseEmployeeCsvLine(csvLine: string) {
        const csvFields = csvLine.split(', ')
        const firstName = csvFields[1];
        const lastName = csvFields[0];
        const birthDate = csvFields[2];
        const email = csvFields[3];
        return new Employee(firstName, lastName, birthDate, email);
    }

    private async sendBirthdayGreetingsToEmployees(employees: Employee[], today: XDate, mailService: MailService) {
        for (const employee of employees) {
            if (employee.isBirthday(today)) {
                await this.sendBirthdayMessage(employee, mailService);
            }
        }
    }

    private async sendBirthdayMessage(employee: Employee, mailService: MailService) {
        const subject = 'Happy Birthday!';
        const body = 'Happy Birthday, dear %NAME%!'.replace('%NAME%', employee.getFirstName())
        const recipient = employee.getEmail();
        await mailService.sendMessage('sender@here.com', subject, body, recipient)
    }
}


export class MailService {
    private readonly smtpHost: string;
    private readonly smtpPort: number;

    constructor(smtpHost: string, smtpPort: number) {
        this.smtpHost = smtpHost;
        this.smtpPort = smtpPort;
    }

    async sendMessage(sender: string, subject: string, body: string, recipient: string) {
        const options: SMTPTransport.Options = {host: this.smtpHost, port: this.smtpPort}
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