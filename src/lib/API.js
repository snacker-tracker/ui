class API {
  constructor(base, options = {}) {
    this.base = new URL(base + "/")

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

  async ListScans(options = {}) {
    options = {
      ...options
    }
    return await this._get(`scans`, options)
  }

  async ListCodes(options = {}) {
    options = {
      ...options
    }

    return await this._get(`codes`, options)
  }

  async ListCategories(options = {}) {
    return await this._get(`categories/`)
  }

  async GetCodeScanCounts(code, period) {
    return await this._get(`stats/scan-counts/${code}`, {period})
  }

  async GetTopScans(args = {}) {
    return await this._get(`stats/top-scans`, args)
  }

  async GetCode(code) {
    const response = await this._get(`codes/${code}`)
    return response
  }

  async GetCodePictures(code) {
    const response = await this._get(`codes/${code}/pictures`)
    return response
  }

  _get(url, params = {}, options = {}) {
    const req = {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const path = new URL(url, this.base)

    if(Object.keys(params).length > 0) {
      for( var p of Object.entries(params)) {
        path.searchParams.append(p[0], p[1])
      }
    }

    return this._request(
      path,
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
