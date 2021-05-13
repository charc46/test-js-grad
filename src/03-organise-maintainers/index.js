/**
 * Make the following POST request with either axios or node-fetch:

POST url: http://ambush-api.inyourarea.co.uk/ambush/intercept
BODY: {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
}

 *******

The results should have this structure:
{
    "status": 200.0,
    "location": [
      ...
    ],
    "from": "CACHE",
    "content": [
      ...
    ]
}

 ******

 * With the results from this request, inside "content", 
 * list every maintainer and each package name that they maintain,
 * return an array with the following shape:
[
    ...
    {
        username: "a-username",
        packageNames: ["a-package-name", "another-package"]
    }
    ...
]
 * NOTE: the parent array and each "packageNames" array should 
 * be in alphabetical order.
 */
const axios = require('axios')

module.exports = async function organiseMaintainers() {

  const { data } = await axios.post('http://ambush-api.inyourarea.co.uk/ambush/intercept', {
    "url": "https://api.npms.io/v2/search/suggestions?q=react",
    "method": "GET",
    "return_payload": true
  })

  // Retrieve maintainer names from each package in response
  let names = []
  data.content.forEach(p => {
    p.package.maintainers.forEach(maintainer => names.push(maintainer.username))
  })
  // Get unique names
  const uniqueNames = [...new Set(names)]

  // Find packages containing each name in uniqueNames array
  const maintainers = uniqueNames.map(username => {
    let packageNames = []

    // Loop through response data
    data.content.forEach(p => {
      // Loop through maintainers in each package and add to current maintainers package array if names match
      p.package.maintainers.forEach(maintainer => {
        maintainer.username === username && packageNames.push(p.package.name) 
      })
    })

    packageNames.sort((a, b) => a > b ? 1 : -1)
    return { username, packageNames }

  }).sort((a, b) => a.username > b.username ? 1 : -1)

  return maintainers
};