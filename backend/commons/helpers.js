const waitForABit = async (milis) => {
    await sleep(milis);
};

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = {
    waitForABit
}