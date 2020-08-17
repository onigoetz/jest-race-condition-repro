# Reproduction for Jest Issue #8942

This repository provides a reproduction for the issue https://github.com/facebook/jest/issues/8942

The error goes like this 

1. Test 1 starts
2. Test 1 timeouts in the middle
3. Test 2 starts
4. Test 1 reaches an `expect(...).toMatchSnapshot()` and records is a snapshot for test 2

A this stage, the test 1 is already timeout, but affects the content of the test 2

# Experimental Fix

The file `experimental-fix.patch` provides an experimantal fix that uses Continuation Local Storage to store the name of the test that executed the `expect` call, which might be different from the test that is running right now, and skips the `expect()` call.

Apply the patch by running `patch -p1 < experimental-fix.patch`

You can now run `yarn test` and see that both tests fail after a timeout (which is what we expect in this test, previously the second test would fail with incorrect snapshot content)

It will also log the following: 

```
  console.log
    Trying to snapshot on a different test than the test running now { currentTestName: 'Runs a second test', cls: 'Runs a first test' }

      at _toMatchSnapshot (node_modules/jest-snapshot/build/index.js:322:15)
```