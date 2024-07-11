import { Injectable } from '@nestjs/common';
import { handleErrors } from 'src/utils/handle-errors';
@Injectable()
export class IPFSService {
  constructor() {}

  async pin(articleContent: string, subtitle: string, id: number) {
    try {
      const body = JSON.stringify({
        pinataContent: {
          id: id,
          subtitle: subtitle,
          content: articleContent,
        },
        pinataMetadata: {
          name: `article_${id}_content`,
        },
      });

      const res = await fetch(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.pinataToken}`,
          },
          body,
        },
      );
      const resData = await res.json();

      if (!resData.IpfsHash) throw new Error('Cannot retrieve CID.');

      return resData.IpfsHash;
    } catch (error) {
      handleErrors(error);
    }
  }

  async delete(hashToUnpin: string) {
    try {
      await fetch(`https://api.pinata.cloud/pinning/unpin/${hashToUnpin}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${process.env.pinataToken}`,
        },
      });
    } catch (error) {
      handleErrors(error);
    }
  }

  async update(
    newContent: string,
    subtitle: string,
    hashToUpdate: string,
    id: number,
  ): Promise<string> {
    this.delete(hashToUpdate);
    return await this.pin(newContent, subtitle, id);
  }
}
