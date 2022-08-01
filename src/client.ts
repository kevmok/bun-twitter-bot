import { createHmac } from 'crypto';
import { user } from './types/common';
import OAuth from 'oauth-1.0a';

interface userData extends Response {
    data: user;
}
interface userList {
    data: user[];
}

interface unfollowData {
    data: {
        following: boolean;
    };
}

export default class Client {
    private token: { key: string; secret: string };
    private oauth: any;
    private bearerHeader: { Authorization: string };

    constructor() {
        this.token = {
            key: process.env.TWITTER_ACCESS_KEY,
            secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        };
        this.bearerHeader = { Authorization: process.env.BearerToken };
        this.oauth = new OAuth({
            consumer: {
                key: process.env.TWITTER_CONSUMER_KEY,
                secret: process.env.TWITTER_CONSUMER_SECRET,
            },
            signature_method: 'HMAC-SHA1',
            hash_function: (baseString, key) =>
                createHmac('sha1', key).update(baseString).digest('base64'),
        });
    }

    async getUserHandleById(id: string): Promise<string> {
        try {
            console.log('here');
            const response = await fetch(
                `https://api.twitter.com/2/users/:${id}`,
                {
                    headers: this.bearerHeader,
                }
            );
            console.log('here');
            const res: userData = await response.json();
            return res.data.username;
        } catch (error) {
            console.error(error);
        }
    }

    async getUserIdByHandle(handle: string): Promise<string> {
        try {
            const response = await fetch(
                `https://api.twitter.com/2/users/by/username/${handle}`,
                {
                    headers: this.bearerHeader,
                }
            );
            const res: userData = await response.json();
            return res.data.id;
        } catch (error) {
            console.error(error);
        }
    }

    async getFollowingList(id: string): Promise<user[]> {
        try {
            const response = await fetch(
                `https://api.twitter.com/2/users/${id}/following?max_results=400`,
                {
                    headers: this.bearerHeader,
                }
            );
            const res: userList = await response.json();
            return res.data;
        } catch (error) {
            console.error(error);
        }
    }

    async unfollowUserbyId(handleId: string, user: user): Promise<string> {
        const url = `https://api.twitter.com/2/users/${handleId.toString()}/following/${user.id.toString()}`;

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.oauth.toHeader(
                    this.oauth.authorize(
                        { url: url, method: 'DELETE' },
                        this.token
                    )
                    // "Content-Type: 'application/json'"
                ),
            });

            if (response.status == 200) {
                const jsonres: unfollowData = await response.json();
                if (!jsonres.data.following)
                    return `Unfollowed ${user.username}`;
            }
        } catch (error) {
            console.error(error);
            // process.exit(1);
        }
    }
}
