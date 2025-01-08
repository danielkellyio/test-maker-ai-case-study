When adding new API endpoint tests, always:

- focus on testing a single API endpoint at a time
- use Nuxt test utils and Vitest to write the test
- create the test in the`tests/api` folder
- test for probable error status codes based on REST standards
- test for the proper responses
- test that request body validation works
