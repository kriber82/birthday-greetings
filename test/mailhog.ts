import { execSync } from 'child_process'
import fetch from 'node-fetch'

export const startMailhog = () => {
    const whichDockerCompose = execSync('which docker-compose').toString()
    if (whichDockerCompose === '') {
        // tslint:disable-next-line:no-console
        console.warn('To run this test you should have docker-compose installed.')
    }

    execSync('docker-compose stop')
    execSync('docker-compose up -d')
    execSync('sleep 5') // TODO slow & flaky
}

export const stopMailHog = () => {
    execSync('docker-compose stop')
    execSync('docker-compose rm -f')
    execSync('sleep 1') // TODO slow & flaky
}

export const messagesSent = async (): Promise<Message[]> => new Promise(resolve => {
    // TODO slow & flaky
    return setTimeout(async () => resolve((await fetch('http://127.0.0.1:8025/api/v1/messages')).json()), 500)
})

interface Message {
    Content: {
        Body: string
        Headers: {
            Subject: string[],
            To: string[]
        }
    }
}