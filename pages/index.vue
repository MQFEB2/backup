<template>
  <div>
    <NUpload :show-file-list="false" accept=".json" @change="handleChange">
      <button>Upload file</button>
    </NUpload>
    <input type="file" accept=".json" @change="selectFile" />
    <button @click="logFile">Log file content</button>

    <button @click="ImportCollection">import</button>
  </div>
  <div>
    <pre>{{ fileData }}</pre>
  </div>
</template>

<script setup>
import { NUpload } from "naive-ui";
const fileContent = ref("");
const temp = {
  info: {
    _postman_id: "beee044c-210f-43d0-b6f3-b304f47069bc",
    name: "Test Export",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "New Folder",
      item: [
        {
          name: "New Request",
          protocolProfileBehavior: {
            disableBodyPruning: true,
          },
          request: {
            method: "GET",
            header: [],
            body: {
              mode: "raw",
              options: {
                raw: {
                  language: "json",
                },
              },
            },
            url: {
              host: [""],
            },
          },
          response: [],
        },
      ],
    },
    {
      name: "New Folder",
      item: [
        {
          name: "New Request",
          protocolProfileBehavior: {
            disableBodyPruning: true,
          },
          request: {
            method: "GET",
            header: [],
            body: {
              mode: "raw",
              options: {
                raw: {
                  language: "json",
                },
              },
            },
            url: {
              host: [""],
            },
          },
          response: [
            {
              name: "New Example",
              originalRequest: {
                method: "GET",
                header: [],
                body: {
                  mode: "raw",
                  options: {
                    raw: {
                      language: "json",
                    },
                  },
                },
                url: {
                  raw:
                    "http://127.0.0.1:8000/rp/body/5033c2b8-1e5a-4a7a-a545-d50ebbef2aa6",
                  protocol: "http",
                  host: ["127", "0", "0", "1"],
                  path: ["rp", "body", "5033c2b8-1e5a-4a7a-a545-d50ebbef2aa6"],
                },
              },
              status: "200",
              code: "OK",
              _postman_previewlanguage: "json",
              header: "",
              body: '{\n"id":1,\n"name": "admin",\n"pw":1234\n}',
            },
          ],
        },
      ],
    },
    {
      name: "New Folder",
      item: [],
    },
    {
      name: "New Request",
      protocolProfileBehavior: {
        disableBodyPruning: true,
      },
      request: {
        method: "GET",
        header: [],
        body: {
          mode: "raw",
          options: {
            raw: {
              language: "json",
            },
          },
        },
        url: {
          raw: "https://jsonplaceholder.typicode.com/users/1",
          protocol: "https",
          host: ["jsonplaceholder", "typicode", "com"],
          path: ["users", "1"],
        },
      },
      response: [
        {
          name: "New Example",
          originalRequest: {
            method: "GET",
            header: [],
            body: {
              mode: "raw",
              raw: '{"title":"foo","body":"bar","userId":"1"}',
              options: {
                raw: {
                  language: "json",
                },
              },
            },
            url: {
              raw: "https://jsonplaceholder.typicode.com/users/5342?id=m5\u0026name=123",
              protocol: "https",
              host: ["jsonplaceholder", "typicode", "com"],
              path: ["users", "5342"],
              query: [
                {
                  key: "id",
                  value: "m5",
                },
                {
                  key: "name",
                  value: "123",
                },
              ],
            },
          },
          status: "200",
          code: "OK",
          _postman_previewlanguage: "json",
          header: "",
          body: '{\r\n    "json":"placeholder"\r\n}',
        },
        {
          name: "New Example",
          originalRequest: {
            method: "GET",
            header: [],
            body: {
              mode: "raw",
              options: {
                raw: {
                  language: "json",
                },
              },
            },
            url: {
              raw: "http://127.0.0.1:8000/rp/body/ce2c3919-1e26-48c8-9865-5d8bd433abf7",
              protocol: "http",
              host: ["127", "0", "0", "1"],
              path: ["rp", "body", "ce2c3919-1e26-48c8-9865-5d8bd433abf7"],
            },
          },
          status: "200",
          code: "OK",
          _postman_previewlanguage: "json",
          header: "",
          body:
            '{\n  "id": 1,\n  "name": "Leanne Graham",\n  "username": "Bret",\n  "email": "Sincere@april.biz",\n  "address": {\n    "street": "Kulas Light",\n    "suite": "Apt. 556",\n    "city": "Gwenborough",\n    "zipcode": "92998-3874",\n    "geo": {\n      "lat": "-37.3159",\n      "lng": "81.1496"\n    }\n  },\n  "phone": "1-770-736-8031 x56442",\n  "website": "hildegard.org",\n  "company": {\n    "name": "Romaguera-Crona",\n    "catchPhrase": "Multi-layered client-server neural-net",\n    "bs": "harness real-time e-markets"\n  }\n}',
        },
      ],
    },
  ],
};
const fileData = ref();

const handleChange = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    fileContent.value = JSON.parse(reader.result);
    console.log(fileContent);
    ImportCollection();
  };
  reader.readAsText(file.file.file);
};

const logFile = () => {
  fileData.value = fileContent.value;
  console.log(fileData.value);
};

const selectFile = async (e) => {
  const file = e.target.files[0];

  /* Make sure file exists */
  if (!file) return;

  /* create a reader */
  const readData = (f) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsText(f);
    });

  /* Read data */
  const data = await readData(file);

  /* upload the converted data */
  console.log(data);
};
const ImportCollection = () => {
  console.log(fileContent.value);
  // info
  const info = fileContent.value.info;
  console.log(info);
  for (let i = 0; i < fileContent.value.item.length; i++) {
    // item (folder || request)
    const item = fileContent.value.item[i];
    console.log(item.name);

    if (item.item !== undefined) {
      if (item.item.length == 0) {
        continue;
      }
      //check folder
      if (item.item.length > 0) {
        for (let j = 0; j < item.item.length; j++) {
          // request
          const folder = item.item[j];
          const request = folder.request;
          {
            const method = request.method;
            console.log(method);
            if (request.header?.length !== 0 && request.header?.length !== undefined) {
              for (let p = 0; p < request.header.length; p++) {
                const header = request.header[p];
                console.log(header);
              }
            }
            if (request.body?.raw !== undefined) {
              const body = request.body.raw;
              console.log(body);
            }
            if (request.url?.raw !== undefined) {
              const url = request.url.raw;
              console.log(url);
            }
          }
          console.log(folder.name);
          if (folder.response.length > 0) {
            for (let k = 0; k < folder.response.length; k++) {
              // response
              const Example = folder.response[k];
              {
                if (Example.body !== undefined) {
                  const exampBody = Example.body;
                  console.log(exampBody);
                }
                if (Example.originalRequest?.method !== undefined) {
                  const method = Example.originalRequest.method;
                  console.log(method);
                }

                if (Example.originalRequest.header?.length != 0) {
                  for (let p = 0; p < Example.originalRequest.header.length; p++) {
                    const header = Example.originalRequest.header[p];
                    console.log(header);
                  }
                }
                if (Example.originalRequest.body?.raw !== undefined) {
                  const body = Example.originalRequest.body.raw;
                  console.log(body);
                }
                if (Example.originalRequest.url?.raw !== undefined) {
                  const url = Example.originalRequest.url.raw;
                  console.log(url);
                }
              }
              console.log(Example.name);
            }
          }
        }
      }
    } else {
      console.log(item);
      if (item.response.length == 0) {
        continue;
      }
      const request = item.request;
      {
        const method = request.method;
        console.log(method);
        if (request.header?.length !== 0 && request.header?.length !== undefined) {
          for (let p = 0; p < request.header.length; p++) {
            const header = request.header[p];
            console.log(header);
          }
        }
        if (request.body?.raw !== undefined) {
          const body = request.body.raw;
          console.log(body);
        }
        if (request.url?.raw !== undefined) {
          const url = request.url.raw;
          console.log(url);
        }
      }
      if (item.response.length > 0) {
        for (let k = 0; k < item.response.length; k++) {
          const Example = item.response[k];
          {
            if (Example.body !== undefined) {
              const exampBody = Example.body;
              console.log(exampBody);
            }
            if (Example.originalRequest?.method !== undefined) {
              const method = Example.originalRequest.method;
              console.log(method);
            }

            if (Example.originalRequest.header?.length != 0) {
              for (let p = 0; p < Example.originalRequest.header.length; p++) {
                const header = Example.originalRequest.header[p];
                console.log(header);
              }
            }
            if (Example.originalRequest.body?.raw !== undefined) {
              const body = Example.originalRequest.body.raw;
              console.log(body);
            }
            if (Example.originalRequest.url?.raw !== undefined) {
              const url = Example.originalRequest.url.raw;
              console.log(url);
            }
          }
          console.log(Example.name);
        }
      }
    }
  }
};
</script>
