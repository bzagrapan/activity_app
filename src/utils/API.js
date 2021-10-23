import axios from 'axios';
import * as dayjs from 'dayjs';
import uuid from 'react-uuid';

export const getActivity = () => {
    return new Promise(function (resolve, reject) {
        axios
            .get('https://www.boredapi.com/api/activity')
            .then((response) => {
                let res = response.data;
                res.createdAt = dayjs().format('HH:mm:ss');
                res.id = uuid();
                return resolve(res);
            })
            .catch((e) => {
                return reject(e);
            });
    });
};
