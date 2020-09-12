#!/usr/bin/env node
import got from "got";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { Bar, Presets } from "cli-progress";

export const DOWNLOAD_BASE_URL =
    "https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Win_x64%2F";

export const APP_FOLDER = `${process.env.LOCALAPPDATA}/Chromium`;

function getInstalledVersion() {
    const filename = `${APP_FOLDER}/version.txt`;
    if (fs.existsSync(filename)) return fs.readFileSync(filename, "utf8");
    return "";
}

export const INSTALLED_VERSION = getInstalledVersion();

export async function getLatestVersion() {
    const response = await got(`${DOWNLOAD_BASE_URL}LAST_CHANGE?alt=media`);
    return response.body;
}

function rimrafExcept(dir: string, except: string[]) {
    let hasException = false;
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(function (entry) {
            const entryPath = path.join(dir, entry);
            if (except.indexOf(entryPath) >= 0) {
                hasException = true;
                return;
            }
            if (fs.lstatSync(entryPath).isDirectory()) {
                if (rimrafExcept(entryPath, except)) hasException = true;
            } else {
                fs.unlinkSync(entryPath);
            }
        });
        if (!hasException) fs.rmdirSync(dir);
    }
    return hasException;
}

async function install(version: string) {
    const bar = new Bar({}, Presets.shades_classic);
    bar.start(100, 0);
    try {
        const url = `${DOWNLOAD_BASE_URL}${version}%2Fchrome-win.zip?alt=media`;
        const promise = got(url).buffer();
        let sizeInitialized = false;
        promise.on("downloadProgress", (p) => {
            if (sizeInitialized) {
                bar.update(p.transferred);
            } else if (!sizeInitialized && p.total) {
                sizeInitialized = true;
                bar.start(p.total, p.transferred);
            } else {
                bar.update(Math.floor(p.percent * 100));
            }
        });
        const response = await promise;
        bar.stop();

        if (fs.existsSync(APP_FOLDER)) rimrafExcept(APP_FOLDER, [path.join(APP_FOLDER, "User Data")]);

        const zip = new AdmZip(response);

        for (const entry of zip.getEntries()) {
            const path = APP_FOLDER + "/" + entry.entryName.split("/").slice(1).join("/");
            if (!entry.isDirectory) fs.writeFileSync(path, entry.getData());
            else if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
        }

        fs.writeFileSync(`${APP_FOLDER}/version.txt`, version, "utf8");
    } finally {
        bar.stop();
    }
}

async function run() {
    const latestVersion = await getLatestVersion();
    if (latestVersion === INSTALLED_VERSION) {
        console.info("Already up to date!");
    } else {
        console.log("Downloading latest chromium version: " + latestVersion);
        await install(latestVersion);
        console.log("Installation complete");
    }
    console.log(latestVersion);
}

run();
