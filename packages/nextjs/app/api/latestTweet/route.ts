const url = "https://api.twitterapi.io/twitter/user/last_tweets";
const options = {method: "GET", headers: {"X-API-Key": "new1_307a82e43fdc4889ad6649920c544e5b"}, body: undefined};

try {
    const responses = await fetch(url, options);
    const data = await responses.json();
    console.log(data);

} catch (error) {
    console.error(error)
}
