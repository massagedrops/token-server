const { RtcTokenBuilder, RtcRole } = require("agora-token");

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
  };

  const channel = String((event.queryStringParameters || {}).channel || "");

  if (!/^[A-Za-z0-9_-]{6,64}$/.test(channel)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "invalid channel" }) };
  }

  const appId = process.env.AGORA_APP_ID;
  const appCert = process.env.AGORA_APP_CERT;
  if (!appId || !appCert) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "server not configured" }) };
  }

  const expireSeconds = 3600;
  const token = RtcTokenBuilder.buildTokenWithUid(
    appId, appCert, channel, 0, RtcRole.PUBLISHER, expireSeconds, expireSeconds
  );

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ token, channel, expiresIn: expireSeconds }),
  };
};
