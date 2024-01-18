import AdmZip from 'adm-zip';
import path from 'path';
import { Octokit } from "@octokit/rest";

export class GitHubRepoUtils {
    private repo: string;
    private subfolderName: string;
    private octokit: Octokit;

    constructor(token: string, repo: string) {
        this.octokit = new Octokit({
            auth: `token ${token}`,
            baseUrl: 'https://api.github.com',
        })

        this.repo = repo;
    }

    async downloadAndUnpackRepository(owner: string, branch = 'main'): Promise<void> {
        try {
            const response = await this.octokit.repos.downloadZipballArchive({
                repo: this.repo,
                owner,
                ref: branch,
             })

            const parsedResponse = Buffer.from(<ArrayBuffer>response.data);
            const zippedRepo = new AdmZip(parsedResponse);
            this.subfolderName = (zippedRepo.getEntries().find(entry => entry.entryName.includes(owner))).entryName;

            zippedRepo.extractAllTo(this.repo, true);

        } catch (error) {
            throw new Error(`Failed to download repository: ${error}`);
        }
    }

    async zipNeededApplication(appName: string): Promise<string> {
        const pathToZip = path.resolve(`${process.cwd()}/${this.repo}`, `${appName}.zip`);
        try {
            const zip = new AdmZip();
            zip.addLocalFolder(`${process.cwd()}/${this.repo}/${this.subfolderName}${appName}`);
            await zip.writeZipPromise(pathToZip);
            return pathToZip;
        } catch (e) {
            throw Error(`Error during zipping app ${e}`)
        }
    }

}
