import { Injectable } from '@nestjs/common';
import { raw } from '@prisma/client/runtime/library';
import axios from 'axios';
import { handleErrors } from 'src/utils/handle-errors';
@Injectable()
export class IPFSService {
  async uploadImage(image: Express.Multer.File) {
    const data = new FormData();
    data.append('file', new Blob([image.buffer]), image.originalname);

    return (
      await axios.post(
        String(process.env.STARTON_API_IPFS_FILE_ENDPOINT),
        data,
        {
          headers: {
            'x-api-key': process.env.STARTON_API_KEY,
            'Content-Type': 'multipart/form-data',
          },
        },
      )
    ).data.cid;
  }

  async uploadJson(name: string, content: object) {
    return (
      await axios.post(
        String(process.env.STARTON_API_IPFS_JSON_ENDPOINT),
        { name, content },
        {
          headers: {
            'x-api-key': process.env.STARTON_API_KEY,
            'Content-Type': 'application/json',
          },
        },
      )
    ).data.cid;
  }

  // ─────────────────────────────────────────────────────────────────────

  async pin(articleContent: string, title: string, subtitle: string, id: number, articleRawContent: string) {
    try {
      const body = JSON.stringify({
        pinataContent: {
          id: id,
          title: title,
          subtitle: subtitle,
          content: articleContent,
          rawContent: articleRawContent
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
            Authorization: `Bearer ${process.env.PINATA_KEY}`,
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
          Authorization: `Bearer ${process.env.PINATA_KEY}`,
        },
      });
    } catch (error) {
      handleErrors(error);
    }
  }

  async update(
    newContent: string,
    newRawContent: string,
    title: string,
    subtitle: string,
    hashToUpdate: string,
    id: number,
  ): Promise<string> {
    this.delete(hashToUpdate);
    return await this.pin(newContent, title, subtitle, id, newRawContent);
  }
}
