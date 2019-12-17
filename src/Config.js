/* global CONFIG */
// we'll be getting this from `window` later on ...
// eslint-disable-next-line

const INJECTED = (typeof (CONFIG) === 'undefined') ? {} : CONFIG

const Config = {
  "OAUTH_ISSUER": "fscker-public-qa.eu.auth0.com",
  "OAUTH_CLIENT_ID": "X8Q3vadW5s1VkbqleV4LrpFwU5UjV2Ay",
  "OAUTH_AUDIENCE": "snacker-tracker-reporter",
  "REPORTER_URL": "https://reporter.snacker-tracker.qa.k8s.fscker.org/v1",
  ...INJECTED,
}

console.log('EffectiveConfig', Config)

export default Config
