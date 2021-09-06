
const verifyStatus = (status) => {

    switch (status) {
        case 'pending':
            return [true];
            break;
        case 'canceled':
            return [true];
            break;

        case 'preparing':
            return [true];
            break;

        case 'delivering':
            return [true];
            break;
        case 'delivered':
            return [true, new Date()];
        default:
            return [false];
    }
};

module.exports = verifyStatus;