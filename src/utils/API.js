import axios from 'axios';

export const getActivity = () => {
    return new Promise(function (resolve, reject) {
        axios
            .get('https://www.boredapi.com/api/activity')
            .then((response) => {
                return resolve(response.data);
            })
            .catch((e) => {
                return reject(e);
            });
    });
};
