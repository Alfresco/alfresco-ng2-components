import axios, { AxiosResponse } from 'axios';
import AdmZip from 'adm-zip';
import path from 'path';

export class GitHubRepoUtils {
    private baseURL = 'https://api.github.com';
    private token: string;
    private repo: string;
    private subFolderName: string;

    constructor(token: string, repo: string) {
        this.token = token;
        this.repo = repo;
    }

    async downloadRepoAndUnpackRepository(owner: string, branch = 'main'): Promise<void> {
        const url = `${this.baseURL}/repos/${owner}/${this.repo}/zipball/${branch}`;
        const headers = {
            Authorization: `token ${this.token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };

        try {
            const response: AxiosResponse = await axios.get(url, {
                responseType: 'arraybuffer',
                headers,
            });
            const repoZipped = new AdmZip(response.data);
            this.subFolderName = (repoZipped.getEntries().find(entry => entry.entryName.includes(owner))).entryName;

            new AdmZip(response.data).extractAllTo(this.repo, /** overwrite **/ true);

        } catch (error) {
            throw new Error(`Failed to download repository: ${error}`);
        }
    }

    async zipNeededApplication(appName: string): Promise<string> {
        const pathToZip = path.resolve(`${process.cwd()}/${this.repo}`, `${appName}.zip`);
        try {
            const zip = new AdmZip();
            zip.addLocalFolder(`${process.cwd()}/${this.repo}/${this.subFolderName}${appName}`);
            await zip.writeZipPromise(pathToZip);
        } catch (e) {
            console.log(`Error during zipping app ${e}`)
        }
        return pathToZip;
    }

}
