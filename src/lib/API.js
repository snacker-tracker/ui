class API {
  constructor(base, options = {}) {
    this.base = base

    if(options.token) {
      this.setToken(options.token)
    } else {
      this.setToken(false)
    }
  }

  async getToken() {
    if(typeof(this.token) == "function") {
      return await this.token()
    } else {
      return this.token
    }
  }

  setToken(token) {
    this.token = token
  }

  async ListScans() {
    return await this._get(`scans`)
  }

  async ListCodes() {
    return await this._get(`codes`)
  }

  async GetCode(code) {
    const response = await this._get(`codes/${code}`)
    return response
  }

  _get(url, params = {}, options = {}) {
    const req = {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      }
    }

    return this._request(
      `${this.base}/${url}`,
      req
    )

  }

  _post() {
      //body: JSON.stringify(data) // body data type must match "Content-Type" header
  }

  async _request(url, req) {
    req.headers = req.headers || {}
    req.headers['Accept'] = 'application/json'

    let token
    if(this.token) {
      token = await this.getToken()
      req.headers['Authorization'] = `Bearer ${token}`
    }

    return await fetch(url, req)
  }
}

export default API
