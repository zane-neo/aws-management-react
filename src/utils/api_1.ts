export async function callApi_1(method: string, url: string, path: string, data?: any) {
  // console.log("entered call api 1 method, url is:" + url + ", path is: " + path)
  const url_f = new URL(url + path)
  // console.log("url f is been created: "+ url_f)
  let requestBody = undefined
  // console.log("url f is been created: "+ url_f)
  if (data !== undefined) {
    // console.log("entered data undefined check true condition")
    if (data instanceof Map) {
      // console.log("starting to add query parameters")
      data.forEach((v: string, k: string, m: any) => {
        url_f.searchParams.append(k, v)
      });
    } else {
      // console.log("starting to build request body")
      requestBody = JSON.stringify(data)
    }
  }
  // console.log("starting to send the request to backend")
  const res = await fetch(url_f, {
    method,
    headers: {
      Accept: 'application/json'
    },
    body: requestBody // This is how to pass request body in fetch API.
  })
  return await res.json()
}
