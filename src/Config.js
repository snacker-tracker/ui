// we'll be getting this from `window` later on ...
// eslint-disable-next-line
var CONFIG = CONFIG || {}

const Config = {
  "OAUTH_ISSUER": "fscker-public-qa.eu.auth0.com",
  "OAUTH_CLIENT_ID": "X8Q3vadW5s1VkbqleV4LrpFwU5UjV2Ay",
  "OAUTH_AUDIENCE": "snacker-tracker-reporter",
  ...CONFIG,
}

console.log('EffectiveConfig', Config)

export default Config
