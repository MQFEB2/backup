let ENDPOINTS = {
  COLLECTION: "/v1/collection.json",
  ITEM: "/v1/item.json",
  FOLDER: "/v1/folder.json",
  REQUEST: "/v1/request.json",
  RESPONSE: "/v1/response.json",
  EXPORT: "/v1/export.json",
  IMPORT: "/V1/import.json",
};

class Request {
  get(url, options) {
    return useFetch(url, {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      ...options,
    });
  }

  post(url, options) {
    return useFetch(url, {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      ...options,
    });
  }

  patch(url, options) {
    return useFetch(url, {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      ...options,
    });
  }

  put(url, options) {
    return useFetch(url, {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      ...options,
    });
  }

  delete(url, options) {
    return useFetch(url, {
      baseURL: useRuntimeConfig().public.baseURL,
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      ...options,
    });
  }
}

class RestApi {
  constructor() {
    this.requester = new Request();
    this.collection = new Collection(this.requester);
  }

  async login(user) {
    return this.requester.post(ENDPOINTS.SIGN_IN, user, {
      headers: {},
    });
  }

  login_sso(data) {
    return this.requester.post(ENDPOINTS.LOGIN_SSO, { body: data });
  }

  // luyentm todo not use right now
  isTokenExpired(token) {
    try {
      return (
        Date.now() >= JSON.parse(window.atob(token.split(".")[1])).exp * 1000
      );
    } catch (e) {
      return false;
    }
  }

  async parserDocx(fileUrl = "") {
    console.log(
      "🚀 ~ file: useApi.js:216 ~ RestApi ~ parserDocx ~ fileUrl:",
      fileUrl
    );
    return this.requester.post(ENDPOINTS.DOCX_PARSER, {
      body: { fileUrl: fileUrl },
    });
  }

  async get_url_upload(acl, content_encoding, content_type, key, platform) {
    let data = { acl, content_encoding, content_type, key, platform };
    return this.requester.put(ENDPOINTS.S3, { body: data });
  }
}

class Collection {
  constructor(requester) {
    this.requester = new Request();
  }

  async get() {
    return this.requester.get(ENDPOINTS.COLLECTION);
  }
}

export default () => {
  return { Collection: new Collection() }
}