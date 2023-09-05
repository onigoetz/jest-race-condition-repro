# Reproduction for Jest Issue #8942

This repository provides a reproduction for the issue https://github.com/facebook/jest/issues/8942

The error goes like this 

1. _Test 1_ starts
2. The timeout for _Test 1_ is reached, but the test is still ongoing
3. _Test 2_ starts
4. _Test 1_ reaches an `expect(...).toMatchSnapshot()` and records is a snapshot for _Test 2_

A this stage, Jest considers it's running _Test 2_, but the content of the snapshot comes from _Test 1_

# Experimental Fix

> This experimental fix was meant for `jest-jasmine2` which was now removed
> It seems that Jest already has such a mechanism but it apparently doesn't catch these cases

The file `experimental-fix.patch` provides an experimantal fix that uses Continuation Local Storage to store the name of the test that executed the `expect` call, which might be different from the test that is running right now, and skips the `expect()` call.

Apply the patch by running `patch -p1 < experimental-fix.patch`

You can now run `yarn test` and see that both tests fail after a timeout (which is what we expect in this test, previously the second test would fail with incorrect snapshot content)

It will also log the following: 

```
  console.log
    Trying to snapshot on a different test than the test running now { currentTestName: 'Runs a second test', cls: 'Runs a first test' }

      at _toMatchSnapshot (node_modules/jest-snapshot/build/index.js:322:15)
```