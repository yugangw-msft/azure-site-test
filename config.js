// Don't commit this file to your public repos. This config is for first-run
// Configure AAD app at https://apps.dev.microsoft.com/?referrer=https://azure.microsoft.com/documentation/articles&deeplink=/appList
// Sample comes from: https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-devquickstarts-node-web
exports.creds = {
 	returnURL: 'http://localhost:3000/auth/openid/return',
 	identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration', // For using Microsoft you should never need to change this.
 	realm: 'http://localhost:3000',
  clientID: '<TOFILL>',
 	clientSecret: '<TOFILL>',
 	skipUserProfile: true, // for OpenID only flows this should be set to true
 	responseType: 'id_token', // for login only flows
 	responseMode: 'form_post', // As per the OAuth 2.0 standard.
 	scope: ['email', 'profile'] // additional scopes you may wish to pass
};
