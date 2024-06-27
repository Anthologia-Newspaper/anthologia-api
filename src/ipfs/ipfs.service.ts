import { Injectable } from '@nestjs/common';

import pinataSDK, { PinataMetadata, PinataOptions, PinataPinOptions } from '@pinata/sdk';

const JWT = process.env.JWT;

@Injectable()
export class IpfsService {
    async pinToIpfs(articleContent: string, id: number) {
        const pinata = new pinataSDK({ pinataJWTKey: JWT });

        const body = {
            content: articleContent
        };

        const pinataMetadata: PinataMetadata = {
            key: `articleContent${id}`
        }
        const pinataOptions: PinataOptions = {
            cidVersion: 0
        }
        const options: PinataPinOptions = {
            pinataMetadata,
            pinataOptions
        };
        const res = await pinata.pinJSONToIPFS(body, options)

        return res.IpfsHash
    }
}
