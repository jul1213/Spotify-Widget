import { app } from 'electron'
import fs from 'fs'
import path from 'path'

const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json')

export function saveSettings(partialSettings) {
    try {
        const current = loadSettings() || {}
        const updated = { ...current, ...partialSettings }
        fs.writeFileSync(SETTINGS_PATH, JSON.stringify(updated))
    } catch (err) {
        console.error('saveSettings failed:', err)
    }
}

export function loadSettings() {
    try {
        const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8')
        return JSON.parse(raw)
    } catch (err) {
        // file doesn't exist yet
        return null
    }
}