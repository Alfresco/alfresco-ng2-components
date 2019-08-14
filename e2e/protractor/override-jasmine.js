function beforeAllRewrite() {

    const originalBeforeAll = global.beforeAll;

    // tslint:disable-next-line
    global.beforeAll = function (beforeAllFunction, timeout) {
        const wrapClbk = async (done) => {
            try {
                await beforeAllFunction(done);
            } catch (error) {
                console.log('Error Before all second attempt in 10 sec');
                sleep(10000);
                try {
                    await beforeAllFunction(done);
                } catch (e) {
                    // tslint:disable-next-line:no-console
                    console.log('Error Before all second attempt fail all' + JSON.stringify(error));
                    await expect(true).toBe(false);
                }
            }

            done();
        };

        originalBeforeAll(wrapClbk, timeout);

    };
}

function afterAllRewrite() {

    const originalAfterAll = global.afterAll;

    // tslint:disable-next-line
    global.afterAll = function (afterAllFunction, timeout) {
        const wrapClbk = async (done) => {
            try {
                await afterAllFunction(done);
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log('Error After all' + JSON.stringify(error));
            }

            done();
        };

        originalAfterAll(wrapClbk, timeout);

    };
}

function beforeEachAllRewrite() {

    const originalBeforeEach = global.beforeEach;

    // tslint:disable-next-line
    global.beforeEach = function (beforeEachFunction, timeout) {
        const wrapClbk = async (done) => {
            try {
                await beforeEachFunction(done);
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log('Error before Each' + JSON.stringify(error));
            }

            done();
        };

        originalBeforeEach(wrapClbk, timeout);

    };
}

function afterEachAllRewrite() {

    const originalAfterEach = global.afterEach;

    // tslint:disable-next-line
    global.afterEach = function (afterEachFunction, timeout) {
        const wrapClbk = async (done) => {
            try {
                await afterEachFunction(done);
            } catch (error) {
                // tslint:disable-next-line:no-console
                console.log('Error After each' + JSON.stringify(error));
            }

            done();
        };

        originalAfterEach(wrapClbk, timeout);

    };
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay) ;
}

module.exports = {
    beforeAllRewrite: beforeAllRewrite,
    afterAllRewrite: afterAllRewrite,
    beforeEachAllRewrite: beforeEachAllRewrite,
    afterEachAllRewrite: afterEachAllRewrite
};
