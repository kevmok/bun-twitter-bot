import Client from './client';
import config from './config/config.json';
import { filterList } from './utils/common';
const client = new Client();

async function Main() {
    // main function
    const handleId = await client.getUserIdByHandle(config.handle);
    const followingArray = await client.getFollowingList(handleId);

    const filteredList = filterList(followingArray);
    console.log(`Number of users to unfollow: ${filteredList.length}`);

    filteredList.forEach((user, index) => {
        setTimeout(async () => {
            try {
                console.log('Unfollowing: ', user.username);
                const ans = await client.unfollowUserbyId(handleId, user);
                console.log(ans);
                console.log(index);
                console.log('Waiting 25 seconds to unfollow next...');
            } catch (error) {
                console.error(error);
            }
        }, index * config.timeout);
    });
}

Main();
