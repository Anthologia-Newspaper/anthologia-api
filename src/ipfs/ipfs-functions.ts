import { handleErrors } from "src/utils/handle-errors";

const JWT = process.env.JWT;

export class IPFSInteraction {
    async pinToIpfs(articleContent: string, subtitle: string, id: number) : Promise<string> {
        try {
            const data = JSON.stringify({
                pinataContent: {
                    id: id,
                    subtitle: subtitle,
                    content: articleContent
                },
                pinataMetadata: {
                    name: `article_${id}_content`,
                }
            })
            const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JWT}`,
                },
                body: data,
            });
            const resData = await res.json();
            return resData.IpfsHash
        } catch (error) {
            handleErrors(error)
        }
        return "failed";
    }

    async removeFromIpfs(hashToUnpin : string) {
        try {
            await fetch(
                `https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${JWT}`,
                    },
                }
            );
        } catch (error) {
            handleErrors(error)
        }
    }

    async updateIpfsHash(newContent: string, subtitle: string, hashToUpdate: string, id: number) : Promise<string>{
        this.removeFromIpfs(hashToUpdate)
        const res = await this.pinToIpfs(newContent, subtitle, id);

        return res
    }
}