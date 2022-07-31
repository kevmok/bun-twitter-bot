import config from '../config/config.json';
import { user } from '../types/common';

export const filterList = (list: user[]) => {
    let filteredList: user[] = [];

    list.forEach((user) => {
        if (!config.whitelist.includes(user.username)) {
            filteredList.push(user);
        }
    });
    return filteredList;
};
