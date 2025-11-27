exports.handler = async (event, context) => {
  try {
    const adminToken = process.env.NETLIFY_IDENTITY_ADMIN_TOKEN;
    const siteUrl = process.env.URL || process.env.DEPLOY_URL;

    if (!adminToken || !siteUrl) {
      return {
        statusCode: 500,
        body: "Missing admin token or site URL",
      };
    }

    const res = await fetch(`${siteUrl}/.netlify/identity/admin/users`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: text };
    }

    const users = await res.json();

    const profiles = users.map((u) => ({
      email: u.email,
      name: u.user_metadata?.name || "",
      structure: u.user_metadata?.structure || "",
      passions: u.user_metadata?.passions || [],
      description: u.user_metadata?.description || "",
      photo: u.user_metadata?.photo || null,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(profiles),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "Error: " + err.message,
    };
  }
};

